import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, FlatList } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { theme } from '../theme';
import { barbers, categories } from '../data/mockData';
import { BarberCard } from '../components/BarberCard';
import { useApp } from '../context/AppContext';

export default function BarbersListScreen({ navigation }) {
  const { state, setFilter } = useApp();

  const sortedBarbers = [...barbers].sort((a, b) => b.rating - a.rating);

  const filteredBarbers = sortedBarbers.filter(b => {
    const matchesFilter =
      state.activeFilter === 'Todos' ? true :
      state.activeFilter === 'Top Rated' ? b.rating >= 4.8 :
      state.activeFilter === 'Mais Próximos' ? b.distance < 1.5 :
      state.activeFilter === 'Disponíveis' ? b.isAvailable :
      state.activeFilter === 'Premium' ? b.price >= 80 :
      state.activeFilter === 'Econômico' ? b.price < 50 : true;
    return matchesFilter;
  });

  return (
    <View style={styles.container}>
      <SafeAreaView edges={['top']}>
        <View style={styles.header}>
          <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
            <Ionicons name="chevron-back" size={22} color={theme.colors.text} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Todos os Barbeiros</Text>
          <View style={styles.headerCount}>
            <Text style={styles.headerCountText}>{filteredBarbers.length}</Text>
          </View>
        </View>

        {/* Filters */}
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.filters}>
          {categories.map(cat => {
            const isActive = state.activeFilter === cat.name;
            return (
              <TouchableOpacity
                key={cat.id}
                onPress={() => setFilter(cat.name)}
                style={[styles.filter, isActive && styles.filterActive]}
              >
                {isActive && (
                  <LinearGradient
                    colors={[theme.colors.primary, '#FF6B35']}
                    style={StyleSheet.absoluteFill}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 0 }}
                  />
                )}
                <Ionicons
                  name={cat.icon}
                  size={14}
                  color={isActive ? '#000' : theme.colors.textMuted}
                />
                <Text style={[styles.filterText, isActive && styles.filterTextActive]}>
                  {cat.name}
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      </SafeAreaView>

      <FlatList
        data={filteredBarbers}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
        ListFooterComponent={<View style={{ height: 100 }} />}
        renderItem={({ item }) => (
          <BarberCard
            barber={item}
            style={styles.card}
            onPress={() => navigation.navigate('BarberProfile', { barber: item })}
          />
        )}
      />
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
    paddingVertical: 12,
    gap: 12,
  },
  backBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: theme.colors.card,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    color: theme.colors.text,
    fontSize: 20,
    fontWeight: theme.fontWeight.bold,
    flex: 1,
  },
  headerCount: {
    backgroundColor: theme.colors.primary,
    borderRadius: 12,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  headerCountText: {
    color: '#000',
    fontSize: 13,
    fontWeight: theme.fontWeight.bold,
  },
  filters: {
    paddingHorizontal: 20,
    paddingBottom: 16,
    gap: 10,
  },
  filter: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: theme.colors.card,
    borderRadius: theme.borderRadius.full,
    paddingHorizontal: 14,
    paddingVertical: 9,
    borderWidth: 1,
    borderColor: theme.colors.border,
    overflow: 'hidden',
    position: 'relative',
  },
  filterActive: {
    borderColor: theme.colors.primary,
  },
  filterText: {
    color: theme.colors.textMuted,
    fontSize: 13,
    fontWeight: theme.fontWeight.medium,
  },
  filterTextActive: {
    color: '#000',
    fontWeight: theme.fontWeight.bold,
  },
  list: {
    paddingHorizontal: 20,
    gap: 16,
  },
  card: {
    width: '100%',
  },
});
