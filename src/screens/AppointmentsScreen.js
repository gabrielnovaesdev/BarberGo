import React, { useState, useRef, useEffect } from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity,
  Image, Animated, Alert, Modal
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { theme } from '../theme';
import { StatusTracker } from '../components/StatusTracker';
import { InteractiveStarRating } from '../components/StarRating';
import { useApp } from '../context/AppContext';
import GlobalFooter from '../components/GlobalFooter';

const STATUS_COLORS = {
  upcoming: { bg: 'rgba(245,166,35,0.12)', border: 'rgba(245,166,35,0.3)', text: theme.colors.primary, label: 'Agendado' },
  completed: { bg: 'rgba(48,209,88,0.1)', border: 'rgba(48,209,88,0.2)', text: theme.colors.success, label: 'Concluído' },
  cancelled: { bg: 'rgba(255,69,58,0.1)', border: 'rgba(255,69,58,0.2)', text: theme.colors.error, label: 'Cancelado' },
};

export default function AppointmentsScreen({ navigation }) {
  const { state, cancelAppointment, rateAppointment } = useApp();
  const [activeTab, setActiveTab] = useState('upcoming');
  const [trackingVisible, setTrackingVisible] = useState(false);
  const [ratingVisible, setRatingVisible] = useState(false);
  const [selectedRating, setSelectedRating] = useState(0);
  const [ratingAppointmentId, setRatingAppointmentId] = useState(null);
  const [trackingStep, setTrackingStep] = useState(1);
  const tabIndicator = useRef(new Animated.Value(0)).current;

  const TABS = ['upcoming', 'completed', 'cancelled'];
  const TAB_LABELS = ['Próximos', 'Concluídos', 'Cancelados'];

  const filteredAppointments = state.appointments.filter(a => a.status === activeTab);

  const handleCancel = (id) => {
    Alert.alert(
      'Cancelar Agendamento',
      'Tem certeza que deseja cancelar este agendamento?',
      [
        { text: 'Não', style: 'cancel' },
        {
          text: 'Cancelar', style: 'destructive',
          onPress: () => cancelAppointment(id),
        },
      ]
    );
  };

  const handleTrackingPress = () => {
    setTrackingStep(1);
    setTrackingVisible(true);
    // Simulate progression
    let step = 1;
    const interval = setInterval(() => {
      step++;
      setTrackingStep(step);
      if (step >= 3) clearInterval(interval);
    }, 2000);
  };

  const handleRate = (appointmentId) => {
    setRatingAppointmentId(appointmentId);
    setSelectedRating(0);
    setRatingVisible(true);
  };

  const submitRating = () => {
    if (selectedRating > 0) {
      rateAppointment(ratingAppointmentId, selectedRating);
      setRatingVisible(false);
    }
  };

  const formatDate = (dateStr) => {
    const date = new Date(dateStr + 'T00:00:00');
    return date.toLocaleDateString('pt-BR', { weekday: 'short', day: 'numeric', month: 'short' });
  };

  return (
    <View style={styles.container}>
      <SafeAreaView edges={['top']}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Meus Agendamentos</Text>
          <View style={styles.countBadge}>
            <Text style={styles.countText}>{state.appointments.length}</Text>
          </View>
        </View>

        {/* Tab Bar */}
        <View style={styles.tabs}>
          {TABS.map((tab, i) => {
            const isActive = activeTab === tab;
            const count = state.appointments.filter(a => a.status === tab).length;
            return (
              <TouchableOpacity
                key={tab}
                onPress={() => setActiveTab(tab)}
                style={[styles.tab, isActive && styles.tabActive]}
              >
                {isActive ? (
                  <LinearGradient
                    colors={[theme.colors.primary, '#FF6B35']}
                    style={StyleSheet.absoluteFill}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 0 }}
                  />
                ) : null}
                <Text style={[styles.tabText, isActive && styles.tabTextActive]}>
                  {TAB_LABELS[i]}
                </Text>
                {count > 0 && (
                  <View style={[styles.tabBadge, isActive && styles.tabBadgeActive]}>
                    <Text style={[styles.tabBadgeText, isActive && { color: '#000' }]}>{count}</Text>
                  </View>
                )}
              </TouchableOpacity>
            );
          })}
        </View>
      </SafeAreaView>

      <ScrollView style={styles.scroll} showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        {filteredAppointments.length === 0 ? (
          <View style={styles.empty}>
            <Ionicons name="calendar-outline" size={64} color={theme.colors.textDisabled} />
            <Text style={styles.emptyTitle}>Nenhum agendamento</Text>
            <Text style={styles.emptySubtitle}>
              {activeTab === 'upcoming'
                ? 'Agende seu próximo corte agora!'
                : 'Seu histórico aparecerá aqui'}
            </Text>
            {activeTab === 'upcoming' && (
              <TouchableOpacity
                style={styles.emptyBtn}
                onPress={() => navigation.navigate('Home')}
              >
                <LinearGradient
                  colors={[theme.colors.primary, '#FF6B35']}
                  style={styles.emptyBtnGradient}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                >
                  <Text style={styles.emptyBtnText}>Buscar Barbeiros</Text>
                </LinearGradient>
              </TouchableOpacity>
            )}
          </View>
        ) : (
          <View style={styles.list}>
            {filteredAppointments.map(appointment => {
              const statusColors = STATUS_COLORS[appointment.status];
              return (
                <View key={appointment.id} style={styles.card}>
                  {/* Card Header */}
                  <View style={styles.cardHeader}>
                    <Image source={{ uri: appointment.barberAvatar }} style={styles.barberAvatar} />
                    <View style={styles.cardInfo}>
                      <Text style={styles.barberName}>{appointment.barberName}</Text>
                      <Text style={styles.serviceText}>{appointment.service}</Text>
                    </View>
                    <View style={[styles.statusBadge, { backgroundColor: statusColors.bg, borderColor: statusColors.border }]}>
                      <Text style={[styles.statusText, { color: statusColors.text }]}>
                        {statusColors.label}
                      </Text>
                    </View>
                  </View>

                  {/* Card Details */}
                  <View style={styles.cardBody}>
                    <View style={styles.detailRow}>
                      <Ionicons name="calendar-outline" size={15} color={theme.colors.textMuted} />
                      <Text style={styles.detailText}>{formatDate(appointment.date)} às {appointment.time}</Text>
                    </View>
                    <View style={styles.detailRow}>
                      <Ionicons name="cash-outline" size={15} color={theme.colors.textMuted} />
                      <Text style={styles.detailText}>R${appointment.price}</Text>
                    </View>
                    <View style={styles.detailRow}>
                      <Ionicons name="location-outline" size={15} color={theme.colors.textMuted} />
                      <Text style={styles.detailText} numberOfLines={1}>{appointment.address}</Text>
                    </View>
                  </View>

                  {/* Rating (completed only) */}
                  {appointment.status === 'completed' && (
                    <View style={styles.cardRating}>
                      {appointment.rating ? (
                        <View style={styles.ratingDone}>
                          <Text style={styles.ratingDoneText}>Sua avaliação: </Text>
                          {[1, 2, 3, 4, 5].map(s => (
                            <Ionicons key={s} name="star" size={16} color={s <= appointment.rating ? theme.colors.star : theme.colors.border} />
                          ))}
                        </View>
                      ) : (
                        <TouchableOpacity
                          style={styles.rateBtn}
                          onPress={() => handleRate(appointment.id)}
                        >
                          <Ionicons name="star-outline" size={16} color={theme.colors.primary} />
                          <Text style={styles.rateBtnText}>Avaliar Barbeiro</Text>
                        </TouchableOpacity>
                      )}
                    </View>
                  )}

                  {/* Actions */}
                  {appointment.status === 'upcoming' && (
                    <View style={styles.cardActions}>
                      <TouchableOpacity
                        style={styles.trackBtn}
                        onPress={handleTrackingPress}
                      >
                        <LinearGradient
                          colors={[theme.colors.primary, '#FF6B35']}
                          style={styles.trackBtnGradient}
                          start={{ x: 0, y: 0 }}
                          end={{ x: 1, y: 0 }}
                        >
                          <Ionicons name="locate" size={16} color="#fff" />
                          <Text style={styles.trackBtnText}>Rastrear</Text>
                        </LinearGradient>
                      </TouchableOpacity>
                      <TouchableOpacity
                        style={styles.cancelBtn}
                        onPress={() => handleCancel(appointment.id)}
                      >
                        <Text style={styles.cancelBtnText}>Cancelar</Text>
                      </TouchableOpacity>
                    </View>
                  )}
                </View>
              );
            })}
          </View>
        )}
        <GlobalFooter />
        <View style={{ height: 100 }} />
      </ScrollView>

      {/* Tracking Modal */}
      <Modal visible={trackingVisible} animationType="slide" transparent>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Rastreamento</Text>
              <TouchableOpacity onPress={() => setTrackingVisible(false)}>
                <Ionicons name="close" size={24} color={theme.colors.text} />
              </TouchableOpacity>
            </View>

            {/* Map placeholder */}
            <View style={styles.mapPlaceholder}>
              <LinearGradient
                colors={['#1A1A1A', '#141414']}
                style={StyleSheet.absoluteFill}
              />
              <View style={styles.mapGrid} />
              <View style={styles.mapPin}>
                <LinearGradient colors={[theme.colors.primary, '#FF6B35']} style={styles.mapPinBg}>
                  <Ionicons name="home" size={20} color="#fff" />
                </LinearGradient>
              </View>
              <View style={styles.mapBarberPin}>
                <LinearGradient colors={['#6C63FF', '#3B3ABF']} style={styles.mapPinBg}>
                  <Ionicons name="person" size={14} color="#fff" />
                </LinearGradient>
              </View>
              <Text style={styles.mapLabel}>Mapa simulado • ETA: ~15 min</Text>
            </View>

            <StatusTracker currentStep={trackingStep} />

            <TouchableOpacity
              style={styles.closeTrackingBtn}
              onPress={() => setTrackingVisible(false)}
            >
              <Text style={styles.closeTrackingText}>Fechar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Rating Modal */}
      <Modal visible={ratingVisible} animationType="fade" transparent>
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContent, styles.ratingModal]}>
            <Text style={styles.ratingModalTitle}>Como foi o atendimento?</Text>
            <Text style={styles.ratingModalSubtitle}>Sua avaliação ajuda outros usuários</Text>
            
            <InteractiveStarRating
              rating={selectedRating}
              onRate={setSelectedRating}
              size={40}
            />
            
            <Text style={styles.ratingLabel}>
              {selectedRating === 5 ? '🎉 Excelente!' :
               selectedRating === 4 ? '😊 Muito Bom!' :
               selectedRating === 3 ? '😐 Regular' :
               selectedRating === 2 ? '😞 Ruim' :
               selectedRating === 1 ? '😡 Péssimo' : 'Toque nas estrelas'}
            </Text>

            <TouchableOpacity
              style={[styles.submitRatingBtn, selectedRating === 0 && { opacity: 0.4 }]}
              onPress={submitRating}
              disabled={selectedRating === 0}
            >
              <LinearGradient
                colors={[theme.colors.primary, '#FF6B35']}
                style={styles.submitRatingGradient}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
              >
                <Text style={styles.submitRatingText}>Enviar Avaliação</Text>
              </LinearGradient>
            </TouchableOpacity>
            
            <TouchableOpacity onPress={() => setRatingVisible(false)}>
              <Text style={styles.skipRatingText}>Não agora</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    gap: 12,
  },
  headerTitle: {
    color: theme.colors.text,
    fontSize: 24,
    fontWeight: theme.fontWeight.black,
  },
  countBadge: {
    backgroundColor: theme.colors.primary,
    borderRadius: 12,
    paddingHorizontal: 10,
    paddingVertical: 3,
  },
  countText: {
    color: '#000',
    fontSize: 13,
    fontWeight: theme.fontWeight.bold,
  },
  tabs: {
    flexDirection: 'row',
    marginHorizontal: 20,
    backgroundColor: theme.colors.card,
    borderRadius: theme.borderRadius.lg,
    padding: 4,
    marginBottom: 20,
  },
  tab: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    borderRadius: theme.borderRadius.md,
    gap: 6,
    overflow: 'hidden',
    position: 'relative',
  },
  tabActive: {
    overflow: 'hidden',
  },
  tabText: {
    color: theme.colors.textMuted,
    fontSize: 12,
    fontWeight: theme.fontWeight.semibold,
  },
  tabTextActive: {
    color: '#000',
    fontWeight: theme.fontWeight.bold,
  },
  tabBadge: {
    backgroundColor: theme.colors.border,
    borderRadius: 8,
    paddingHorizontal: 6,
    paddingVertical: 1,
  },
  tabBadgeActive: {
    backgroundColor: 'rgba(0,0,0,0.2)',
  },
  tabBadgeText: {
    color: theme.colors.textMuted,
    fontSize: 10,
    fontWeight: theme.fontWeight.bold,
  },
  scroll: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 20,
  },
  list: {
    gap: 16,
  },
  card: {
    backgroundColor: theme.colors.card,
    borderRadius: theme.borderRadius.xl,
    padding: 16,
    ...theme.shadows.md,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    gap: 12,
  },
  barberAvatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    borderWidth: 2,
    borderColor: theme.colors.primary,
  },
  cardInfo: {
    flex: 1,
  },
  barberName: {
    color: theme.colors.text,
    fontSize: 16,
    fontWeight: theme.fontWeight.bold,
  },
  serviceText: {
    color: theme.colors.textMuted,
    fontSize: 13,
    marginTop: 2,
  },
  statusBadge: {
    borderRadius: theme.borderRadius.full,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderWidth: 1,
  },
  statusText: {
    fontSize: 12,
    fontWeight: theme.fontWeight.bold,
  },
  cardBody: {
    gap: 8,
    borderTopWidth: 1,
    borderTopColor: theme.colors.border,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
    paddingVertical: 12,
    marginBottom: 12,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  detailText: {
    color: theme.colors.textSecondary,
    fontSize: 14,
    flex: 1,
  },
  cardRating: {
    marginBottom: 12,
  },
  ratingDone: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  ratingDoneText: {
    color: theme.colors.textMuted,
    fontSize: 13,
  },
  rateBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: theme.colors.primaryTransparent,
    borderRadius: theme.borderRadius.md,
    padding: 10,
    borderWidth: 1,
    borderColor: 'rgba(245,166,35,0.2)',
  },
  rateBtnText: {
    color: theme.colors.primary,
    fontSize: 13,
    fontWeight: theme.fontWeight.semibold,
  },
  cardActions: {
    flexDirection: 'row',
    gap: 12,
  },
  trackBtn: {
    flex: 1,
    borderRadius: theme.borderRadius.md,
    overflow: 'hidden',
  },
  trackBtnGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: 12,
  },
  trackBtnText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: theme.fontWeight.bold,
  },
  cancelBtn: {
    border: 1,
    borderWidth: 1,
    borderColor: theme.colors.error,
    borderRadius: theme.borderRadius.md,
    paddingHorizontal: 20,
    paddingVertical: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cancelBtnText: {
    color: theme.colors.error,
    fontSize: 14,
    fontWeight: theme.fontWeight.semibold,
  },
  empty: {
    alignItems: 'center',
    paddingTop: 80,
    paddingHorizontal: 40,
    gap: 12,
  },
  emptyTitle: {
    color: theme.colors.textSecondary,
    fontSize: 20,
    fontWeight: theme.fontWeight.bold,
    marginTop: 8,
  },
  emptySubtitle: {
    color: theme.colors.textMuted,
    fontSize: 15,
    textAlign: 'center',
  },
  emptyBtn: {
    marginTop: 12,
    borderRadius: theme.borderRadius.full,
    overflow: 'hidden',
  },
  emptyBtnGradient: {
    paddingHorizontal: 28,
    paddingVertical: 14,
    borderRadius: theme.borderRadius.full,
  },
  emptyBtnText: {
    color: '#fff',
    fontSize: 15,
    fontWeight: theme.fontWeight.bold,
  },
  // Modal
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.85)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: theme.colors.surface,
    borderTopLeftRadius: 32,
    borderTopRightRadius: 32,
    paddingHorizontal: 20,
    paddingTop: 24,
    paddingBottom: 48,
    gap: 16,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  modalTitle: {
    color: theme.colors.text,
    fontSize: 20,
    fontWeight: theme.fontWeight.bold,
  },
  mapPlaceholder: {
    height: 200,
    borderRadius: theme.borderRadius.xl,
    overflow: 'hidden',
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center',
  },
  mapGrid: {
    position: 'absolute',
    top: 0, left: 0, right: 0, bottom: 0,
    borderWidth: 1,
    borderColor: 'rgba(245,166,35,0.1)',
  },
  mapPin: {
    alignItems: 'center',
  },
  mapBarberPin: {
    position: 'absolute',
    top: 60,
    left: 80,
  },
  mapPinBg: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  mapLabel: {
    position: 'absolute',
    bottom: 12,
    color: theme.colors.textMuted,
    fontSize: 12,
  },
  closeTrackingBtn: {
    backgroundColor: theme.colors.card,
    borderRadius: theme.borderRadius.lg,
    padding: 14,
    alignItems: 'center',
  },
  closeTrackingText: {
    color: theme.colors.textMuted,
    fontSize: 15,
    fontWeight: theme.fontWeight.medium,
  },
  ratingModal: {
    alignItems: 'center',
    justifyContent: 'flex-end',
    paddingTop: 32,
  },
  ratingModalTitle: {
    color: theme.colors.text,
    fontSize: 22,
    fontWeight: theme.fontWeight.bold,
    textAlign: 'center',
  },
  ratingModalSubtitle: {
    color: theme.colors.textMuted,
    fontSize: 14,
    textAlign: 'center',
    marginBottom: 8,
  },
  ratingLabel: {
    color: theme.colors.textSecondary,
    fontSize: 16,
    fontWeight: theme.fontWeight.semibold,
    textAlign: 'center',
    minHeight: 24,
  },
  submitRatingBtn: {
    width: '100%',
    borderRadius: theme.borderRadius.full,
    overflow: 'hidden',
    marginTop: 8,
  },
  submitRatingGradient: {
    height: 56,
    alignItems: 'center',
    justifyContent: 'center',
  },
  submitRatingText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: theme.fontWeight.bold,
  },
  skipRatingText: {
    color: theme.colors.textMuted,
    fontSize: 14,
    textAlign: 'center',
    padding: 8,
  },
});
