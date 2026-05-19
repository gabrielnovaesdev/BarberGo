import React, { useState, useRef, useEffect } from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity,
  Image, Animated, Alert, Dimensions
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { theme } from '../theme';
import { ServiceCard } from '../components/ServiceCard';
import { useApp } from '../context/AppContext';
import GlobalFooter from '../components/GlobalFooter';

const { width } = Dimensions.get('window');

const DAYS = ['Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb', 'Dom'];
const FULL_DAYS = ['Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado', 'Domingo'];

function getNextDates() {
  const dates = [];
  const today = new Date();
  for (let i = 0; i < 14; i++) {
    const d = new Date(today);
    d.setDate(today.getDate() + i);
    dates.push(d);
  }
  return dates;
}

export default function BookingScreen({ route, navigation }) {
  const { barber } = route.params;
  const { addAppointment, state } = useApp();

  const [step, setStep] = useState(1); // 1: service, 2: date/time, 3: confirm
  const [selectedService, setSelectedService] = useState(null);
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedTime, setSelectedTime] = useState(null);
  const [isConfirmed, setIsConfirmed] = useState(false);

  const successScale = useRef(new Animated.Value(0)).current;
  const successOpacity = useRef(new Animated.Value(0)).current;
  const progressAnim = useRef(new Animated.Value(0)).current;
  const dates = getNextDates();

  useEffect(() => {
    Animated.timing(progressAnim, {
      toValue: (step - 1) / 2,
      duration: 300,
      useNativeDriver: false,
    }).start();
  }, [step]);

  const getAvailableTimesForDate = (date) => {
    if (!date) return [];
    const dayName = FULL_DAYS[date.getDay() === 0 ? 6 : date.getDay() - 1];
    return barber.availability[dayName] || [];
  };

  const availableTimes = getAvailableTimesForDate(selectedDate);

  const handleConfirm = () => {
    const appointment = {
      barberId: barber.id,
      barberName: barber.name,
      barberAvatar: barber.avatar,
      service: selectedService.name,
      date: selectedDate.toISOString().split('T')[0],
      time: selectedTime,
      price: selectedService.price,
    };
    addAppointment(appointment);

    // Success animation
    setIsConfirmed(true);
    Animated.sequence([
      Animated.delay(100),
      Animated.parallel([
        Animated.spring(successScale, { toValue: 1, tension: 50, friction: 6, useNativeDriver: true }),
        Animated.timing(successOpacity, { toValue: 1, duration: 300, useNativeDriver: true }),
      ]),
    ]).start();
  };

  if (isConfirmed) {
    return (
      <View style={styles.successContainer}>
        <LinearGradient
          colors={[theme.colors.background, '#0D150A']}
          style={StyleSheet.absoluteFill}
        />
        <Animated.View style={[styles.successContent, { opacity: successOpacity, transform: [{ scale: successScale }] }]}>
          <LinearGradient
            colors={[theme.colors.primary, '#FF6B35']}
            style={styles.successIconBg}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
          >
            <Ionicons name="checkmark" size={60} color="#fff" />
          </LinearGradient>
          
          <Text style={styles.successTitle}>Agendado! ✨</Text>
          <Text style={styles.successSubtitle}>Seu corte foi confirmado com sucesso!</Text>

          {/* Appointment Card */}
          <View style={styles.successCard}>
            <View style={styles.successBarber}>
              <Image source={{ uri: barber.avatar }} style={styles.successAvatar} />
              <View>
                <Text style={styles.successBarberName}>{barber.name}</Text>
                <Text style={styles.successService}>{selectedService?.name}</Text>
              </View>
            </View>
            <View style={styles.successDivider} />
            <View style={styles.successDetails}>
              <View style={styles.successDetail}>
                <Ionicons name="calendar" size={18} color={theme.colors.primary} />
                <Text style={styles.successDetailText}>
                  {selectedDate?.toLocaleDateString('pt-BR', { weekday: 'long', day: 'numeric', month: 'long' })}
                </Text>
              </View>
              <View style={styles.successDetail}>
                <Ionicons name="time" size={18} color={theme.colors.primary} />
                <Text style={styles.successDetailText}>{selectedTime}</Text>
              </View>
              <View style={styles.successDetail}>
                <Ionicons name="location" size={18} color={theme.colors.primary} />
                <Text style={styles.successDetailText}>{state.user.address}</Text>
              </View>
              <View style={styles.successDetail}>
                <Ionicons name="cash" size={18} color={theme.colors.primary} />
                <Text style={styles.successDetailText}>R${selectedService?.price}</Text>
              </View>
            </View>
          </View>

          <TouchableOpacity
            style={styles.successBtn}
            onPress={() => navigation.navigate('Appointments')}
          >
            <LinearGradient
              colors={[theme.colors.primary, '#FF6B35']}
              style={styles.successBtnGradient}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
            >
              <Text style={styles.successBtnText}>Ver Meus Agendamentos</Text>
              <Ionicons name="arrow-forward" size={18} color="#fff" />
            </LinearGradient>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.successSecondaryBtn}
            onPress={() => navigation.navigate('Home')}
          >
            <Text style={styles.successSecondaryBtnText}>Voltar para Início</Text>
          </TouchableOpacity>
        </Animated.View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Header */}
      <SafeAreaView edges={['top']}>
        <View style={styles.header}>
          <TouchableOpacity style={styles.backBtn} onPress={() => step > 1 ? setStep(step - 1) : navigation.goBack()}>
            <Ionicons name="chevron-back" size={22} color={theme.colors.text} />
          </TouchableOpacity>
          <View style={styles.headerCenter}>
            <Text style={styles.headerTitle}>Agendamento</Text>
            <Text style={styles.headerSubtitle}>Passo {step} de 3</Text>
          </View>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Ionicons name="close" size={22} color={theme.colors.textMuted} />
          </TouchableOpacity>
        </View>

        {/* Progress Bar */}
        <View style={styles.progressContainer}>
          <Animated.View
            style={[
              styles.progress,
              {
                width: progressAnim.interpolate({
                  inputRange: [0, 1],
                  outputRange: ['33.3%', '100%'],
                }),
              },
            ]}
          />
        </View>
      </SafeAreaView>

      {/* Barber mini card */}
      <View style={styles.barberMini}>
        <Image source={{ uri: barber.avatar }} style={styles.barberMiniAvatar} />
        <View>
          <Text style={styles.barberMiniName}>{barber.name}</Text>
          <View style={styles.barberMiniRating}>
            <Ionicons name="star" size={12} color={theme.colors.star} />
            <Text style={styles.barberMiniRatingText}>{barber.rating.toFixed(1)}</Text>
            <Text style={styles.barberMiniDistance}>• {barber.distance} km</Text>
          </View>
        </View>
      </View>

      <ScrollView style={styles.scroll} showsVerticalScrollIndicator={false}>
        {/* Step 1: Choose Service */}
        {step === 1 && (
          <View style={styles.stepContent}>
            <Text style={styles.stepTitle}>Escolha o Serviço</Text>
            <Text style={styles.stepSubtitle}>Selecione o tipo de corte desejado</Text>

            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.servicesScroll}
            >
              {barber.services.map(service => (
                <ServiceCard
                  key={service.id}
                  service={service}
                  selected={selectedService?.id === service.id}
                  onPress={() => setSelectedService(service)}
                />
              ))}
            </ScrollView>

            {selectedService && (
              <View style={styles.selectedInfo}>
                <LinearGradient
                  colors={['rgba(245,166,35,0.12)', 'rgba(245,166,35,0.06)']}
                  style={styles.selectedInfoGradient}
                >
                  <Ionicons name="information-circle" size={20} color={theme.colors.primary} />
                  <View style={styles.selectedInfoText}>
                    <Text style={styles.selectedInfoTitle}>{selectedService.name}</Text>
                    <Text style={styles.selectedInfoSub}>
                      Duração: {selectedService.duration} min • Preço: R${selectedService.price}
                    </Text>
                  </View>
                </LinearGradient>
              </View>
            )}
          </View>
        )}

        {/* Step 2: Date & Time */}
        {step === 2 && (
          <View style={styles.stepContent}>
            <Text style={styles.stepTitle}>Data e Horário</Text>
            <Text style={styles.stepSubtitle}>Escolha quando quer ser atendido</Text>

            {/* Date picker */}
            <Text style={styles.pickerLabel}>Selecione a Data</Text>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.datesScroll}
            >
              {dates.map((date, i) => {
                const dayIndex = date.getDay();
                const dayName = DAYS[dayIndex === 0 ? 6 : dayIndex - 1];
                const fullDayName = FULL_DAYS[dayIndex === 0 ? 6 : dayIndex - 1];
                const hasSlots = (barber.availability[fullDayName] || []).length > 0;
                const isSelected = selectedDate?.toDateString() === date.toDateString();
                const isToday = i === 0;

                return (
                  <TouchableOpacity
                    key={i}
                    onPress={() => { if (hasSlots) { setSelectedDate(date); setSelectedTime(null); }}}
                    style={[
                      styles.dateItem,
                      isSelected && styles.dateItemSelected,
                      !hasSlots && styles.dateItemDisabled,
                    ]}
                    disabled={!hasSlots}
                  >
                    {isSelected ? (
                      <LinearGradient colors={[theme.colors.primary, '#FF6B35']} style={styles.dateItemGradient}>
                        <Text style={[styles.dateDay, styles.dateDaySelected]}>{dayName}</Text>
                        <Text style={[styles.dateNum, styles.dateNumSelected]}>{date.getDate()}</Text>
                        {isToday && <Text style={[styles.dateTodayBadge, { color: '#000' }]}>Hoje</Text>}
                      </LinearGradient>
                    ) : (
                      <View style={styles.dateItemInner}>
                        <Text style={[styles.dateDay, !hasSlots && styles.dateDisabled]}>{dayName}</Text>
                        <Text style={[styles.dateNum, !hasSlots && styles.dateDisabled]}>{date.getDate()}</Text>
                        {isToday && <Text style={styles.dateTodayBadge}>Hoje</Text>}
                        {!hasSlots && <View style={styles.noSlotsLine} />}
                      </View>
                    )}
                  </TouchableOpacity>
                );
              })}
            </ScrollView>

            {/* Time slots */}
            {selectedDate && (
              <>
                <Text style={styles.pickerLabel}>
                  Horários Disponíveis
                  {availableTimes.length > 0 && <Text style={styles.slotsCount}> ({availableTimes.length})</Text>}
                </Text>
                {availableTimes.length === 0 ? (
                  <View style={styles.noSlots}>
                    <Ionicons name="calendar-outline" size={32} color={theme.colors.textDisabled} />
                    <Text style={styles.noSlotsText}>Sem horários nesta data</Text>
                  </View>
                ) : (
                  <View style={styles.timeSlots}>
                    {availableTimes.map((time, i) => {
                      const isTimeSelected = selectedTime === time;
                      return (
                        <TouchableOpacity
                          key={i}
                          onPress={() => setSelectedTime(time)}
                          style={[styles.timeSlot, isTimeSelected && styles.timeSlotSelected]}
                        >
                          {isTimeSelected ? (
                            <LinearGradient
                              colors={[theme.colors.primary, '#FF6B35']}
                              style={styles.timeSlotGradient}
                              start={{ x: 0, y: 0 }}
                              end={{ x: 1, y: 0 }}
                            >
                              <Ionicons name="time" size={14} color="#000" />
                              <Text style={[styles.timeText, { color: '#000' }]}>{time}</Text>
                            </LinearGradient>
                          ) : (
                            <>
                              <Ionicons name="time-outline" size={14} color={theme.colors.textMuted} />
                              <Text style={styles.timeText}>{time}</Text>
                            </>
                          )}
                        </TouchableOpacity>
                      );
                    })}
                  </View>
                )}
              </>
            )}
          </View>
        )}

        {/* Step 3: Confirm */}
        {step === 3 && (
          <View style={styles.stepContent}>
            <Text style={styles.stepTitle}>Confirmação</Text>
            <Text style={styles.stepSubtitle}>Revise os detalhes do agendamento</Text>

            {/* Summary card */}
            <View style={styles.summaryCard}>
              <Text style={styles.summaryTitle}>📋 Resumo do Pedido</Text>

              <View style={styles.summaryRow}>
                <View style={styles.summaryIcon}>
                  <Ionicons name="cut" size={18} color={theme.colors.primary} />
                </View>
                <View style={styles.summaryInfo}>
                  <Text style={styles.summaryLabel}>Serviço</Text>
                  <Text style={styles.summaryValue}>{selectedService?.name}</Text>
                </View>
              </View>

              <View style={styles.summaryDivider} />

              <View style={styles.summaryRow}>
                <View style={styles.summaryIcon}>
                  <Ionicons name="person" size={18} color={theme.colors.primary} />
                </View>
                <View style={styles.summaryInfo}>
                  <Text style={styles.summaryLabel}>Barbeiro</Text>
                  <Text style={styles.summaryValue}>{barber.name}</Text>
                </View>
              </View>

              <View style={styles.summaryDivider} />

              <View style={styles.summaryRow}>
                <View style={styles.summaryIcon}>
                  <Ionicons name="calendar" size={18} color={theme.colors.primary} />
                </View>
                <View style={styles.summaryInfo}>
                  <Text style={styles.summaryLabel}>Data e Hora</Text>
                  <Text style={styles.summaryValue}>
                    {selectedDate?.toLocaleDateString('pt-BR', { weekday: 'short', day: 'numeric', month: 'short' })} às {selectedTime}
                  </Text>
                </View>
              </View>

              <View style={styles.summaryDivider} />

              <View style={styles.summaryRow}>
                <View style={styles.summaryIcon}>
                  <Ionicons name="location" size={18} color={theme.colors.primary} />
                </View>
                <View style={styles.summaryInfo}>
                  <Text style={styles.summaryLabel}>Local</Text>
                  <Text style={styles.summaryValue}>{state.user.address}</Text>
                </View>
              </View>

              <View style={styles.summaryDivider} />

              <View style={styles.summaryRow}>
                <View style={styles.summaryIcon}>
                  <Ionicons name="time" size={18} color={theme.colors.primary} />
                </View>
                <View style={styles.summaryInfo}>
                  <Text style={styles.summaryLabel}>Duração estimada</Text>
                  <Text style={styles.summaryValue}>{selectedService?.duration} minutos</Text>
                </View>
              </View>

              <LinearGradient
                colors={['rgba(245,166,35,0.1)', 'rgba(245,166,35,0.05)']}
                style={styles.totalRow}
              >
                <Text style={styles.totalLabel}>Total</Text>
                <Text style={styles.totalValue}>R${selectedService?.price}</Text>
              </LinearGradient>
            </View>

            {/* Payment Badge */}
            <View style={styles.paymentInfo}>
              <Ionicons name="shield-checkmark" size={16} color={theme.colors.success} />
              <Text style={styles.paymentText}>Pagamento na hora do serviço • Dinheiro ou Pix</Text>
            </View>
          </View>
        )}

        <GlobalFooter />
        <View style={{ height: 120 }} />
      </ScrollView>

      {/* Bottom button */}
      <View style={styles.footer}>
        <View style={styles.footerContent}>
          {step === 3 && selectedService && (
            <View style={styles.footerPrice}>
              <Text style={styles.footerPriceLabel}>Total</Text>
              <Text style={styles.footerPriceValue}>R${selectedService.price}</Text>
            </View>
          )}
          <TouchableOpacity
            style={[
              styles.nextBtn,
              !(step === 1 ? selectedService :
                step === 2 ? selectedDate && selectedTime : true) && styles.nextBtnDisabled
            ]}
            onPress={() => {
              if (step < 3) setStep(step + 1);
              else handleConfirm();
            }}
            disabled={
              step === 1 ? !selectedService :
              step === 2 ? !selectedDate || !selectedTime : false
            }
            activeOpacity={0.85}
          >
            <LinearGradient
              colors={
                (step === 1 ? selectedService :
                step === 2 ? selectedDate && selectedTime : true)
                  ? [theme.colors.primary, '#FF6B35']
                  : [theme.colors.textDisabled, theme.colors.textDisabled]
              }
              style={styles.nextBtnGradient}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
            >
              <Text style={styles.nextBtnText}>
                {step === 3 ? 'Confirmar Agendamento' : 'Continuar'}
              </Text>
              <Ionicons name={step === 3 ? 'checkmark' : 'arrow-forward'} size={20} color="#fff" />
            </LinearGradient>
          </TouchableOpacity>
        </View>
      </View>
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
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 12,
  },
  backBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: theme.colors.card,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerCenter: {
    alignItems: 'center',
  },
  headerTitle: {
    color: theme.colors.text,
    fontSize: 17,
    fontWeight: theme.fontWeight.bold,
  },
  headerSubtitle: {
    color: theme.colors.textMuted,
    fontSize: 13,
    marginTop: 2,
  },
  progressContainer: {
    height: 3,
    backgroundColor: theme.colors.border,
    marginHorizontal: 20,
    borderRadius: 2,
    overflow: 'hidden',
  },
  progress: {
    height: '100%',
    backgroundColor: theme.colors.primary,
    borderRadius: 2,
  },
  barberMini: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
  },
  barberMiniAvatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    borderWidth: 2,
    borderColor: theme.colors.primary,
  },
  barberMiniName: {
    color: theme.colors.text,
    fontSize: 15,
    fontWeight: theme.fontWeight.bold,
  },
  barberMiniRating: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginTop: 2,
  },
  barberMiniRatingText: {
    color: theme.colors.textSecondary,
    fontSize: 13,
  },
  barberMiniDistance: {
    color: theme.colors.textMuted,
    fontSize: 13,
  },
  scroll: {
    flex: 1,
  },
  stepContent: {
    padding: 20,
  },
  stepTitle: {
    color: theme.colors.text,
    fontSize: 24,
    fontWeight: theme.fontWeight.bold,
    marginBottom: 6,
  },
  stepSubtitle: {
    color: theme.colors.textMuted,
    fontSize: 15,
    marginBottom: 24,
  },
  servicesScroll: {
    paddingBottom: 8,
  },
  selectedInfo: {
    marginTop: 20,
    borderRadius: theme.borderRadius.lg,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(245,166,35,0.3)',
  },
  selectedInfoGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    padding: 16,
  },
  selectedInfoText: {
    flex: 1,
  },
  selectedInfoTitle: {
    color: theme.colors.text,
    fontSize: 15,
    fontWeight: theme.fontWeight.semibold,
  },
  selectedInfoSub: {
    color: theme.colors.textMuted,
    fontSize: 13,
    marginTop: 2,
  },
  pickerLabel: {
    color: theme.colors.textSecondary,
    fontSize: 15,
    fontWeight: theme.fontWeight.semibold,
    marginBottom: 12,
  },
  slotsCount: {
    color: theme.colors.primary,
  },
  datesScroll: {
    paddingBottom: 8,
    marginBottom: 24,
    gap: 10,
  },
  dateItem: {
    width: 64,
    height: 80,
    borderRadius: theme.borderRadius.lg,
    backgroundColor: theme.colors.card,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  dateItemSelected: {
    borderColor: theme.colors.primary,
  },
  dateItemDisabled: {
    opacity: 0.4,
  },
  dateItemGradient: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 2,
  },
  dateItemInner: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 2,
  },
  dateDay: {
    color: theme.colors.textMuted,
    fontSize: 12,
    fontWeight: theme.fontWeight.medium,
  },
  dateDaySelected: {
    color: '#000',
  },
  dateNum: {
    color: theme.colors.text,
    fontSize: 22,
    fontWeight: theme.fontWeight.bold,
  },
  dateNumSelected: {
    color: '#000',
  },
  dateTodayBadge: {
    color: theme.colors.primary,
    fontSize: 9,
    fontWeight: theme.fontWeight.bold,
  },
  dateDisabled: {
    color: theme.colors.textDisabled,
  },
  noSlotsLine: {
    position: 'absolute',
    width: '80%',
    height: 1,
    backgroundColor: theme.colors.textDisabled,
  },
  noSlots: {
    alignItems: 'center',
    padding: 32,
    gap: 12,
  },
  noSlotsText: {
    color: theme.colors.textMuted,
    fontSize: 15,
  },
  timeSlots: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  timeSlot: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: theme.colors.card,
    borderRadius: theme.borderRadius.md,
    borderWidth: 1,
    borderColor: theme.colors.border,
    overflow: 'hidden',
    minWidth: 90,
    height: 44,
    paddingHorizontal: 14,
  },
  timeSlotSelected: {
    borderColor: theme.colors.primary,
  },
  timeSlotGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    flex: 1,
    height: '100%',
    paddingHorizontal: 0,
  },
  timeText: {
    color: theme.colors.textSecondary,
    fontSize: 14,
    fontWeight: theme.fontWeight.semibold,
  },
  summaryCard: {
    backgroundColor: theme.colors.card,
    borderRadius: theme.borderRadius.xl,
    padding: 20,
    marginBottom: 16,
    ...theme.shadows.md,
  },
  summaryTitle: {
    color: theme.colors.text,
    fontSize: 18,
    fontWeight: theme.fontWeight.bold,
    marginBottom: 20,
  },
  summaryRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
    paddingVertical: 4,
  },
  summaryIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: theme.colors.primaryTransparent,
    alignItems: 'center',
    justifyContent: 'center',
  },
  summaryInfo: {
    flex: 1,
  },
  summaryLabel: {
    color: theme.colors.textMuted,
    fontSize: 12,
    marginBottom: 2,
  },
  summaryValue: {
    color: theme.colors.text,
    fontSize: 15,
    fontWeight: theme.fontWeight.semibold,
  },
  summaryDivider: {
    height: 1,
    backgroundColor: theme.colors.border,
    marginVertical: 12,
  },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderRadius: theme.borderRadius.lg,
    padding: 16,
    marginTop: 16,
    borderWidth: 1,
    borderColor: 'rgba(245,166,35,0.2)',
  },
  totalLabel: {
    color: theme.colors.textSecondary,
    fontSize: 16,
    fontWeight: theme.fontWeight.bold,
  },
  totalValue: {
    color: theme.colors.primary,
    fontSize: 24,
    fontWeight: theme.fontWeight.black,
  },
  paymentInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: 'rgba(48,209,88,0.1)',
    borderRadius: theme.borderRadius.md,
    padding: 12,
    borderWidth: 1,
    borderColor: 'rgba(48,209,88,0.2)',
  },
  paymentText: {
    color: theme.colors.success,
    fontSize: 13,
    flex: 1,
  },
  footer: {
    backgroundColor: theme.colors.background,
    borderTopWidth: 1,
    borderTopColor: theme.colors.border,
  },
  footerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    paddingBottom: 34,
    gap: 16,
  },
  footerPrice: {
    alignItems: 'flex-start',
  },
  footerPriceLabel: {
    color: theme.colors.textMuted,
    fontSize: 11,
  },
  footerPriceValue: {
    color: theme.colors.text,
    fontSize: 20,
    fontWeight: theme.fontWeight.black,
  },
  nextBtn: {
    flex: 1,
    borderRadius: theme.borderRadius.full,
    overflow: 'hidden',
    ...theme.shadows.primary,
  },
  nextBtnDisabled: {
    opacity: 0.5,
  },
  nextBtnGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    height: 56,
    borderRadius: theme.borderRadius.full,
  },
  nextBtnText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: theme.fontWeight.bold,
  },
  // Success Screen
  successContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: theme.colors.background,
  },
  successContent: {
    alignItems: 'center',
    paddingHorizontal: 24,
    width: '100%',
  },
  successIconBg: {
    width: 120,
    height: 120,
    borderRadius: 60,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 24,
    ...theme.shadows.primary,
  },
  successTitle: {
    color: theme.colors.text,
    fontSize: 36,
    fontWeight: theme.fontWeight.black,
    marginBottom: 8,
  },
  successSubtitle: {
    color: theme.colors.textMuted,
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 32,
  },
  successCard: {
    width: '100%',
    backgroundColor: theme.colors.card,
    borderRadius: theme.borderRadius.xl,
    padding: 20,
    marginBottom: 24,
    ...theme.shadows.md,
  },
  successBarber: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 16,
  },
  successAvatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    borderWidth: 2,
    borderColor: theme.colors.primary,
  },
  successBarberName: {
    color: theme.colors.text,
    fontSize: 16,
    fontWeight: theme.fontWeight.bold,
  },
  successService: {
    color: theme.colors.textMuted,
    fontSize: 13,
    marginTop: 2,
  },
  successDivider: {
    height: 1,
    backgroundColor: theme.colors.border,
    marginBottom: 16,
  },
  successDetails: {
    gap: 12,
  },
  successDetail: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 10,
  },
  successDetailText: {
    color: theme.colors.textSecondary,
    fontSize: 14,
    flex: 1,
  },
  successBtn: {
    width: '100%',
    borderRadius: theme.borderRadius.full,
    overflow: 'hidden',
    marginBottom: 12,
    ...theme.shadows.primary,
  },
  successBtnGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    height: 56,
  },
  successBtnText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: theme.fontWeight.bold,
  },
  successSecondaryBtn: {
    padding: 12,
  },
  successSecondaryBtnText: {
    color: theme.colors.textMuted,
    fontSize: 15,
    fontWeight: theme.fontWeight.medium,
  },
});
