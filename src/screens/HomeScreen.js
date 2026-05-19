import React, { useState, useRef, useEffect } from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity,
  TextInput, FlatList, Animated, StatusBar, Dimensions, Image, Alert
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { theme } from '../theme';
import { barbers, categories } from '../data/mockData';
import { BarberCard, BarberCardHorizontal } from '../components/BarberCard';
import { useApp } from '../context/AppContext';
import GlobalFooter from '../components/GlobalFooter';

const { width } = Dimensions.get('window');

export default function HomeScreen({ navigation }) {
  const { state, setFilter, setSearch } = useApp();
  const [searchFocused, setSearchFocused] = useState(false);
  const headerOpacity = useRef(new Animated.Value(1)).current;
  const scrollY = useRef(new Animated.Value(0)).current;
  const searchScale = useRef(new Animated.Value(1)).current;

  const upcomingAppointment = state.appointments.find(a => a.status === 'upcoming');

  const handleSearchFocus = () => {
    setSearchFocused(true);
    Animated.spring(searchScale, { toValue: 1.02, useNativeDriver: true }).start();
  };
  const handleSearchBlur = () => {
    setSearchFocused(false);
    Animated.spring(searchScale, { toValue: 1, useNativeDriver: true }).start();
  };

  const filteredBarbers = barbers.filter(b => {
    const matchesSearch = !state.searchQuery ||
      b.name.toLowerCase().includes(state.searchQuery.toLowerCase()) ||
      b.specialties.some(s => s.toLowerCase().includes(state.searchQuery.toLowerCase()));
    const matchesFilter =
      state.activeFilter === 'Todos' ? true :
      state.activeFilter === 'Top Rated' ? b.rating >= 4.8 :
      state.activeFilter === 'Mais Próximos' ? b.distance < 1.5 :
      state.activeFilter === 'Disponíveis' ? b.isAvailable :
      state.activeFilter === 'Premium' ? b.price >= 80 :
      state.activeFilter === 'Econômico' ? b.price < 50 : true;
    return matchesSearch && matchesFilter;
  });

  const topBarbers = [...barbers].sort((a, b) => b.rating - a.rating).slice(0, 4);

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />
      
      {/* Header */}
      <LinearGradient
        colors={['#0A0A0A', 'rgba(10,10,10,0.95)', 'transparent']}
        style={styles.headerGradient}
        pointerEvents="box-none"
      >
        <SafeAreaView edges={['top']}>
          <View style={styles.header}>
            <View style={styles.headerLeft}>
              <View style={styles.locationRow}>
                <Ionicons name="location" size={16} color={theme.colors.primary} />
                <Text style={styles.locationText}>Sua localização</Text>
                <Ionicons name="chevron-down" size={14} color={theme.colors.primary} />
              </View>
              <Text style={styles.addressText}>Rua das Flores, 123</Text>
            </View>
            <View style={styles.headerRight}>
              <TouchableOpacity 
                style={styles.notifBtn} 
                onPress={() => Alert.alert('Notificações', 'Você não tem novas notificações no momento.')}
              >
                <Ionicons name="notifications-outline" size={22} color={theme.colors.text} />
                {state.notifications > 0 && (
                  <View style={styles.notifBadge}>
                    <Text style={styles.notifCount}>{state.notifications}</Text>
                  </View>
                )}
              </TouchableOpacity>
              <TouchableOpacity onPress={() => navigation.navigate('Profile')}>
                <Image
                  source={{ uri: state.user.avatar }}
                  style={styles.userAvatar}
                />
              </TouchableOpacity>
            </View>
          </View>
        </SafeAreaView>
      </LinearGradient>

      <Animated.ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        onScroll={Animated.event([{ nativeEvent: { contentOffset: { y: scrollY } } }], { useNativeDriver: false })}
        scrollEventThrottle={16}
      >
        {/* Top spacing for header */}
        <View style={{ height: 120 }} />

        {/* Greeting */}
        <View style={styles.greeting}>
          <Text style={styles.greetingText}>Olá, {state.user.name.split(' ')[0]}! 👋</Text>
          <Text style={styles.greetingSubtext}>Pronto para um novo visual?</Text>
        </View>

        {/* Search Bar */}
        <Animated.View style={[styles.searchContainer, { transform: [{ scale: searchScale }] }]}>
          <View style={[styles.searchBar, searchFocused && styles.searchBarFocused]}>
            <Ionicons name="search" size={20} color={searchFocused ? theme.colors.primary : theme.colors.textMuted} />
            <TextInput
              style={styles.searchInput}
              placeholder="Buscar barbeiros, cortes..."
              placeholderTextColor={theme.colors.textMuted}
              value={state.searchQuery}
              onChangeText={setSearch}
              onFocus={handleSearchFocus}
              onBlur={handleSearchBlur}
            />
            {state.searchQuery.length > 0 && (
              <TouchableOpacity onPress={() => setSearch('')}>
                <Ionicons name="close-circle" size={18} color={theme.colors.textMuted} />
              </TouchableOpacity>
            )}
          </View>
          <TouchableOpacity 
            style={styles.filterIconBtn}
            onPress={() => Alert.alert('Filtros', 'Opções avançadas de filtragem em breve.')}
          >
            <LinearGradient colors={[theme.colors.primary, '#FF6B35']} style={styles.filterIconBg}>
              <Ionicons name="options" size={20} color="#fff" />
            </LinearGradient>
          </TouchableOpacity>
        </Animated.View>

        {/* Upcoming Appointment Banner */}
        {upcomingAppointment && (
          <TouchableOpacity
            style={styles.upcomingBanner}
            onPress={() => navigation.navigate('Appointments')}
            activeOpacity={0.85}
          >
            <LinearGradient
              colors={['rgba(245,166,35,0.15)', 'rgba(245,166,35,0.05)']}
              style={styles.upcomingGradient}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
            >
              <View style={styles.upcomingIconContainer}>
                <LinearGradient colors={[theme.colors.primary, '#FF6B35']} style={styles.upcomingIcon}>
                  <Ionicons name="cut" size={20} color="#fff" />
                </LinearGradient>
              </View>
              <View style={styles.upcomingInfo}>
                <Text style={styles.upcomingLabel}>PRÓXIMO AGENDAMENTO</Text>
                <Text style={styles.upcomingBarber}>{upcomingAppointment.barberName}</Text>
                <Text style={styles.upcomingDetails}>
                  {upcomingAppointment.service} • {upcomingAppointment.time}
                </Text>
              </View>
              <Ionicons name="chevron-forward" size={20} color={theme.colors.primary} />
            </LinearGradient>
          </TouchableOpacity>
        )}

        {/* Categories */}
        <View style={styles.section}>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.categoriesScroll}
          >
            {categories.map(cat => {
              const isActive = state.activeFilter === cat.name;
              return (
                <TouchableOpacity
                  key={cat.id}
                  onPress={() => setFilter(cat.name)}
                  style={[styles.categoryChip, isActive && styles.categoryChipActive]}
                >
                  <Ionicons
                    name={cat.icon}
                    size={14}
                    color={isActive ? theme.colors.background : theme.colors.textMuted}
                  />
                  <Text style={[styles.categoryText, isActive && styles.categoryTextActive]}>
                    {cat.name}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </ScrollView>
        </View>

        {/* Top Rated Section */}
        {!state.searchQuery && state.activeFilter === 'Todos' && (
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>⭐ Mais Bem Avaliados</Text>
              <TouchableOpacity onPress={() => navigation.navigate('BarbersList')}>
                <Text style={styles.seeAll}>Ver todos</Text>
              </TouchableOpacity>
            </View>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={{ paddingHorizontal: 20, paddingRight: 20 }}
            >
              {topBarbers.map(barber => (
                <BarberCardHorizontal
                  key={barber.id}
                  barber={barber}
                  onPress={() => navigation.navigate('BarberProfile', { barber })}
                />
              ))}
            </ScrollView>
          </View>
        )}

        {/* All / Filtered Barbers */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>
              {state.searchQuery
                ? `Resultados para "${state.searchQuery}"`
                : state.activeFilter !== 'Todos'
                ? state.activeFilter
                : '🔥 Disponíveis Agora'}
            </Text>
            <Text style={styles.count}>{filteredBarbers.length} barbeiros</Text>
          </View>
          
          {filteredBarbers.length === 0 ? (
            <View style={styles.emptyState}>
              <Ionicons name="search" size={48} color={theme.colors.textDisabled} />
              <Text style={styles.emptyTitle}>Nenhum barbeiro encontrado</Text>
              <Text style={styles.emptySubtitle}>Tente ajustar sua busca ou filtros</Text>
            </View>
          ) : (
            <View style={styles.barbersList}>
              {filteredBarbers.map(barber => (
                <BarberCard
                  key={barber.id}
                  barber={barber}
                  style={styles.barberCard}
                  onPress={() => navigation.navigate('BarberProfile', { barber })}
                />
              ))}
            </View>
          )}
        </View>

        <GlobalFooter />
        <View style={{ height: 100 }} />
      </Animated.ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  headerGradient: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 10,
    paddingBottom: 20,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 8,
    paddingBottom: 8,
  },
  headerLeft: {},
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  locationText: {
    color: theme.colors.primary,
    fontSize: 12,
    fontWeight: theme.fontWeight.semibold,
  },
  addressText: {
    color: theme.colors.text,
    fontSize: 16,
    fontWeight: theme.fontWeight.bold,
    marginTop: 2,
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  notifBtn: {
    position: 'relative',
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: theme.colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
  },
  notifBadge: {
    position: 'absolute',
    top: 4,
    right: 4,
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: '#FF453A',
    alignItems: 'center',
    justifyContent: 'center',
  },
  notifCount: {
    color: '#fff',
    fontSize: 9,
    fontWeight: theme.fontWeight.bold,
  },
  userAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    borderWidth: 2,
    borderColor: theme.colors.primary,
  },
  scroll: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 0,
  },
  greeting: {
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  greetingText: {
    color: theme.colors.text,
    fontSize: 28,
    fontWeight: theme.fontWeight.black,
    lineHeight: 34,
  },
  greetingSubtext: {
    color: theme.colors.textMuted,
    fontSize: 15,
    marginTop: 4,
  },
  searchContainer: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    marginBottom: 24,
    gap: 12,
    alignItems: 'center',
  },
  searchBar: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.card,
    borderRadius: theme.borderRadius.xl,
    paddingHorizontal: 16,
    paddingVertical: 14,
    gap: 10,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  searchBarFocused: {
    borderColor: theme.colors.primary,
    backgroundColor: theme.colors.cardElevated,
  },
  searchInput: {
    flex: 1,
    color: theme.colors.text,
    fontSize: 15,
    padding: 0,
  },
  filterIconBtn: {
    borderRadius: 16,
    overflow: 'hidden',
  },
  filterIconBg: {
    width: 52,
    height: 52,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  upcomingBanner: {
    marginHorizontal: 20,
    marginBottom: 24,
    borderRadius: theme.borderRadius.xl,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(245,166,35,0.3)',
  },
  upcomingGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    gap: 12,
  },
  upcomingIconContainer: {},
  upcomingIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  upcomingInfo: {
    flex: 1,
  },
  upcomingLabel: {
    color: theme.colors.primary,
    fontSize: 10,
    fontWeight: theme.fontWeight.bold,
    letterSpacing: 1,
  },
  upcomingBarber: {
    color: theme.colors.text,
    fontSize: 15,
    fontWeight: theme.fontWeight.bold,
    marginTop: 2,
  },
  upcomingDetails: {
    color: theme.colors.textMuted,
    fontSize: 13,
    marginTop: 2,
  },
  section: {
    marginBottom: 32,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginBottom: 16,
  },
  sectionTitle: {
    color: theme.colors.text,
    fontSize: 18,
    fontWeight: theme.fontWeight.bold,
  },
  seeAll: {
    color: theme.colors.primary,
    fontSize: 14,
    fontWeight: theme.fontWeight.semibold,
  },
  count: {
    color: theme.colors.textMuted,
    fontSize: 13,
  },
  categoriesScroll: {
    paddingHorizontal: 20,
    gap: 10,
  },
  categoryChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: theme.colors.card,
    borderRadius: theme.borderRadius.full,
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  categoryChipActive: {
    backgroundColor: theme.colors.primary,
    borderColor: theme.colors.primary,
  },
  categoryText: {
    color: theme.colors.textMuted,
    fontSize: 13,
    fontWeight: theme.fontWeight.medium,
  },
  categoryTextActive: {
    color: theme.colors.background,
    fontWeight: theme.fontWeight.bold,
  },
  barbersList: {
    paddingHorizontal: 20,
    gap: 16,
  },
  barberCard: {
    width: '100%',
  },
  emptyState: {
    alignItems: 'center',
    padding: 48,
    gap: 12,
  },
  emptyTitle: {
    color: theme.colors.textSecondary,
    fontSize: 17,
    fontWeight: theme.fontWeight.semibold,
  },
  emptySubtitle: {
    color: theme.colors.textMuted,
    fontSize: 14,
    textAlign: 'center',
  },
});
