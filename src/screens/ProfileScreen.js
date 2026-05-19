import React, { useState } from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity,
  Image, Switch, Alert
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { theme } from '../theme';
import { useApp } from '../context/AppContext';
import GlobalFooter from '../components/GlobalFooter';

const StatCard = ({ icon, value, label, color }) => (
  <View style={styles.statCard}>
    <LinearGradient
      colors={[`${color}25`, `${color}10`]}
      style={styles.statCardBg}
    >
      <Ionicons name={icon} size={22} color={color} />
      <Text style={[styles.statValue, { color }]}>{value}</Text>
      <Text style={styles.statLabel}>{label}</Text>
    </LinearGradient>
  </View>
);

const MenuItem = ({ icon, label, sublabel, onPress, rightElement, color, danger }) => (
  <TouchableOpacity style={styles.menuItem} onPress={onPress} activeOpacity={0.7}>
    <View style={[styles.menuIcon, { backgroundColor: color ? `${color}20` : theme.colors.surface }]} >
      <Ionicons name={icon} size={20} color={color || (danger ? theme.colors.error : theme.colors.textMuted)} />
    </View>
    <View style={styles.menuContent}>
      <Text style={[styles.menuLabel, danger && { color: theme.colors.error }]}>{label}</Text>
      {sublabel && <Text style={styles.menuSublabel}>{sublabel}</Text>}
    </View>
    {rightElement || <Ionicons name="chevron-forward" size={18} color={theme.colors.textDisabled} />}
  </TouchableOpacity>
);

export default function ProfileScreen({ navigation }) {
  const { state, logout } = useApp();
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [locationEnabled, setLocationEnabled] = useState(true);

  const completedCuts = state.appointments.filter(a => a.status === 'completed').length;
  const upcomingCuts = state.appointments.filter(a => a.status === 'upcoming').length;
  const favorites = state.favorites.length;

  return (
    <View style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Hero Header */}
        <LinearGradient
          colors={['#1A0E00', '#0F0F0F', theme.colors.background]}
          style={styles.hero}
          start={{ x: 0, y: 0 }}
          end={{ x: 0, y: 1 }}
        >
          <SafeAreaView edges={['top']}>
            <View style={styles.heroContent}>
              {/* Avatar */}
              <View style={styles.avatarContainer}>
                <LinearGradient
                  colors={[theme.colors.primary, '#FF6B35']}
                  style={styles.avatarRing}
                >
                  <Image source={{ uri: state.user.avatar }} style={styles.avatar} />
                </LinearGradient>
                <TouchableOpacity style={styles.editAvatar}>
                  <Ionicons name="camera" size={14} color="#000" />
                </TouchableOpacity>
              </View>

              {/* User Info */}
              <Text style={styles.userName}>{state.user.name}</Text>
              <Text style={styles.userEmail}>{state.user.email}</Text>
              
              <View style={styles.ratingContainer}>
                <Ionicons name="star" size={16} color={theme.colors.star || '#FFD700'} />
                <Text style={styles.ratingValue}>{state.user.rating || '4.9'}</Text>
                <Text style={styles.ratingCount}>({state.user.reviews || '128'})</Text>
              </View>

              <View style={styles.memberBadge}>
                <Ionicons name="shield-checkmark" size={13} color={theme.colors.primary} />
                <Text style={styles.memberText}>Membro desde {state.user.memberSince}</Text>
              </View>

              {/* Edit Profile Button */}
              <TouchableOpacity style={styles.editBtn} onPress={() => Alert.alert('Editar Perfil', 'Edição de perfil em breve.')}>
                <Ionicons name="pencil" size={14} color={theme.colors.text} />
                <Text style={styles.editBtnText}>Editar Perfil</Text>
              </TouchableOpacity>
            </View>
          </SafeAreaView>
        </LinearGradient>

        {/* Stats */}
        <View style={styles.stats}>
          <StatCard icon="cut" value={completedCuts} label="Cortes" color={theme.colors.primary} />
          <StatCard icon="calendar" value={upcomingCuts} label="Agendados" color={theme.colors.info} />
          <StatCard icon="heart" value={favorites} label="Favoritos" color="#FF453A" />
        </View>

        {/* Achievements */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>CONQUISTAS</Text>
            <TouchableOpacity hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
              <Text style={styles.seeAllText}>Ver todas</Text>
            </TouchableOpacity>
          </View>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.achievementsList}>
            <View style={styles.achievementCard}>
              <Image source={require('../../assets/badges/100_cuts.png')} style={styles.achievementImage} />
              <Text style={styles.achievementTitle}>100+ Cortes</Text>
              <Text style={styles.achievementDesc}>Fez mais de 100 cortes no app</Text>
            </View>
            <View style={styles.achievementCard}>
              <Image source={require('../../assets/badges/top_rated.png')} style={styles.achievementImage} />
              <Text style={styles.achievementTitle}>Cliente Top</Text>
              <Text style={styles.achievementDesc}>Avaliação máxima constante</Text>
            </View>
            <View style={styles.achievementCard}>
              <Image source={require('../../assets/badges/pioneer.png')} style={styles.achievementImage} />
              <Text style={styles.achievementTitle}>Pioneiro</Text>
              <Text style={styles.achievementDesc}>Um dos primeiros usuários</Text>
            </View>
          </ScrollView>
        </View>

        {/* My Info */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>INFORMAÇÕES</Text>
          <View style={styles.menuCard}>
            <MenuItem
              icon="person-outline"
              label="Nome"
              sublabel={state.user.name}
              color={theme.colors.primary}
              onPress={() => Alert.alert('Informação', 'Esta informação é sincronizada com seu perfil.')}
            />
            <View style={styles.menuDivider} />
            <MenuItem
              icon="call-outline"
              label="Telefone"
              sublabel={state.user.phone}
              color={theme.colors.primary}
              onPress={() => Alert.alert('Informação', 'Esta informação é sincronizada com seu perfil.')}
            />
            <View style={styles.menuDivider} />
            <MenuItem
              icon="location-outline"
              label="Endereço"
              sublabel={state.user.address}
              color={theme.colors.primary}
              onPress={() => Alert.alert('Informação', 'Esta informação é sincronizada com seu perfil.')}
            />
          </View>
        </View>

        {/* Preferences */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>PREFERÊNCIAS</Text>
          <View style={styles.menuCard}>
            <MenuItem
              icon="notifications-outline"
              label="Notificações"
              color="#FFD60A"
              onPress={() => {}}
              rightElement={
                <Switch
                  value={notificationsEnabled}
                  onValueChange={setNotificationsEnabled}
                  trackColor={{ false: theme.colors.border, true: theme.colors.primary }}
                  thumbColor="#fff"
                />
              }
            />
            <View style={styles.menuDivider} />
            <MenuItem
              icon="location"
              label="Localização"
              color={theme.colors.info}
              onPress={() => {}}
              rightElement={
                <Switch
                  value={locationEnabled}
                  onValueChange={setLocationEnabled}
                  trackColor={{ false: theme.colors.border, true: theme.colors.primary }}
                  thumbColor="#fff"
                />
              }
            />
            <View style={styles.menuDivider} />
            <MenuItem
              icon="moon-outline"
              label="Tema Escuro"
              color="#6C63FF"
              onPress={() => {}}
              rightElement={
                <Switch
                  value={true}
                  trackColor={{ false: theme.colors.border, true: theme.colors.primary }}
                  thumbColor="#fff"
                />
              }
            />
          </View>
        </View>

        {/* More */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>MAIS</Text>
          <View style={styles.menuCard}>
            <MenuItem
              icon="help-circle-outline"
              label="Central de Ajuda"
              sublabel="Tire suas dúvidas"
              color={theme.colors.success}
              onPress={() => Alert.alert('Ajuda', 'Nossos canais de atendimento estarão disponíveis em breve.')}
            />
            <View style={styles.menuDivider} />
            <MenuItem
              icon="star-outline"
              label="Avalie o App"
              sublabel="Nos ajude a melhorar"
              color={theme.colors.star}
              onPress={() => Alert.alert('Avaliar', 'Obrigado por querer avaliar o BarberGo!')}
            />
            <View style={styles.menuDivider} />
            <MenuItem
              icon="share-social-outline"
              label="Indicar para Amigos"
              sublabel="Ganhe R$10 de crédito"
              color={theme.colors.primary}
              onPress={() => Alert.alert('Indicação', 'Seu código de indicação é: BRBGO2026')}
            />
            <View style={styles.menuDivider} />
            <MenuItem
              icon="document-text-outline"
              label="Termos de Uso"
              color={theme.colors.textMuted}
              onPress={() => Alert.alert('Termos', 'Termos de Uso e Política de Privacidade.')}
            />
          </View>
        </View>

        {/* Logout */}
        <View style={styles.section}>
          <View style={styles.menuCard}>
            <MenuItem
              icon="log-out-outline"
              label="Sair da conta"
              danger
              onPress={() => Alert.alert('Sair', 'Deseja sair da sua conta?', [
                { text: 'Cancelar', style: 'cancel' },
                { text: 'Sair', style: 'destructive', onPress: () => logout() },
              ])}
            />
          </View>
        </View>

        {/* Version */}
        <Text style={styles.version}>BarberGo v1.0.0 • Feito com ❤️</Text>

        <GlobalFooter />
        <View style={{ height: 100 }} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  hero: {
    paddingBottom: 32,
  },
  heroContent: {
    alignItems: 'center',
    paddingTop: 16,
    paddingHorizontal: 20,
  },
  avatarContainer: {
    position: 'relative',
    marginBottom: 16,
    marginTop: 8,
  },
  avatarRing: {
    padding: 3,
    borderRadius: 60,
  },
  avatar: {
    width: 90,
    height: 90,
    borderRadius: 45,
    borderWidth: 3,
    borderColor: theme.colors.background,
  },
  editAvatar: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    backgroundColor: theme.colors.primary,
    width: 28,
    height: 28,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: theme.colors.background,
  },
  userName: {
    color: theme.colors.text,
    fontSize: 24,
    fontWeight: theme.fontWeight.black,
    marginBottom: 4,
  },
  userEmail: {
    color: theme.colors.textMuted,
    fontSize: 14,
    marginBottom: 8,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    backgroundColor: 'rgba(0,0,0,0.2)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  ratingValue: {
    color: theme.colors.text,
    fontSize: 15,
    fontWeight: theme.fontWeight.bold,
    marginLeft: 6,
  },
  ratingCount: {
    color: theme.colors.textMuted,
    fontSize: 13,
    marginLeft: 4,
  },
  memberBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: theme.colors.primaryTransparent,
    borderRadius: theme.borderRadius.full,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderWidth: 1,
    borderColor: 'rgba(245,166,35,0.2)',
    marginBottom: 16,
  },
  memberText: {
    color: theme.colors.primary,
    fontSize: 13,
    fontWeight: theme.fontWeight.medium,
  },
  editBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: theme.colors.card,
    borderRadius: theme.borderRadius.full,
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  editBtnText: {
    color: theme.colors.text,
    fontSize: 14,
    fontWeight: theme.fontWeight.semibold,
  },
  stats: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    paddingVertical: 8,
    gap: 12,
    marginTop: -16,
  },
  statCard: {
    flex: 1,
    borderRadius: theme.borderRadius.xl,
    overflow: 'hidden',
  },
  statCardBg: {
    alignItems: 'center',
    paddingVertical: 16,
    borderRadius: theme.borderRadius.xl,
    gap: 4,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.05)',
  },
  statValue: {
    fontSize: 22,
    fontWeight: theme.fontWeight.black,
  },
  statLabel: {
    color: theme.colors.textMuted,
    fontSize: 11,
  },
  section: {
    paddingHorizontal: 20,
    marginTop: 24,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  sectionTitle: {
    color: theme.colors.textDisabled,
    fontSize: 11,
    fontWeight: theme.fontWeight.bold,
    letterSpacing: 1.5,
    marginBottom: 12,
  },
  seeAllText: {
    color: theme.colors.primary,
    fontSize: 12,
    fontWeight: theme.fontWeight.bold,
  },
  achievementsList: {
    gap: 12,
    paddingRight: 20,
  },
  achievementCard: {
    backgroundColor: theme.colors.card,
    borderRadius: theme.borderRadius.xl,
    padding: 16,
    width: 140,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.05)',
  },
  achievementImage: {
    width: 60,
    height: 60,
    marginBottom: 12,
    borderRadius: 30,
  },
  achievementTitle: {
    color: theme.colors.text,
    fontSize: 14,
    fontWeight: theme.fontWeight.bold,
    textAlign: 'center',
    marginBottom: 4,
  },
  achievementDesc: {
    color: theme.colors.textMuted,
    fontSize: 11,
    textAlign: 'center',
    lineHeight: 14,
  },
  menuCard: {
    backgroundColor: theme.colors.card,
    borderRadius: theme.borderRadius.xl,
    overflow: 'hidden',
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    gap: 14,
  },
  menuIcon: {
    width: 40,
    height: 40,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  menuContent: {
    flex: 1,
  },
  menuLabel: {
    color: theme.colors.text,
    fontSize: 15,
    fontWeight: theme.fontWeight.medium,
  },
  menuSublabel: {
    color: theme.colors.textMuted,
    fontSize: 12,
    marginTop: 2,
  },
  menuDivider: {
    height: 1,
    backgroundColor: theme.colors.border,
    marginLeft: 70,
  },
  version: {
    textAlign: 'center',
    color: theme.colors.textDisabled,
    fontSize: 12,
    marginTop: 32,
  },
});
