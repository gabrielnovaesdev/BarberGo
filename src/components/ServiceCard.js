import React, { useRef, useEffect } from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity,
  Animated, Easing
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { theme } from '../theme';

export const ServiceCard = ({ service, selected, onPress }) => {
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const glowAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (selected) {
      Animated.parallel([
        Animated.spring(scaleAnim, { toValue: 1.02, useNativeDriver: true }),
        Animated.timing(glowAnim, { toValue: 1, duration: 200, useNativeDriver: false }),
      ]).start();
    } else {
      Animated.parallel([
        Animated.spring(scaleAnim, { toValue: 1, useNativeDriver: true }),
        Animated.timing(glowAnim, { toValue: 0, duration: 200, useNativeDriver: false }),
      ]).start();
    }
  }, [selected]);

  const serviceIcons = {
    'Corte Simples': 'cut',
    'Corte + Barba': 'man',
    'Degradê': 'layers',
    'Barba Completa': 'ellipse',
    'Pacote Premium': 'diamond',
    'Corte Clássico': 'cut',
    'Corte + Barba Clássica': 'man',
    'Penteado Social': 'trending-up',
    'Tratamento Capilar': 'leaf',
    'Pacote Executivo': 'briefcase',
    'Coloração': 'color-palette',
    'Descoloração': 'sunny',
    'Mechas': 'sparkles',
    'Corte + Cor': 'color-palette',
    'Corte Urbano': 'flash',
    'Barba Artística': 'brush',
    'Design Sobrancelha': 'eye',
    'Full Look': 'star',
    'VIP Experience': 'diamond',
    'Barboterapia': 'water',
    'Massagem Capilar': 'hand-left',
    'Pacote Black Tie': 'ribbon',
  };

  const icon = serviceIcons[service.name] || 'cut';

  const borderColor = glowAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [theme.colors.border, theme.colors.primary],
  });

  return (
    <Animated.View style={{ transform: [{ scale: scaleAnim }] }}>
      <TouchableOpacity onPress={onPress} activeOpacity={0.8}>
        <Animated.View style={[styles.card, { borderColor }]}>
          {selected && (
            <LinearGradient
              colors={['rgba(245,166,35,0.1)', 'rgba(245,166,35,0.05)']}
              style={StyleSheet.absoluteFill}
            />
          )}
          <View style={[styles.iconContainer, selected && styles.iconContainerSelected]}>
            <Ionicons
              name={icon}
              size={22}
              color={selected ? theme.colors.primary : theme.colors.textMuted}
            />
          </View>
          <Text style={[styles.name, selected && styles.nameSelected]}>
            {service.name}
          </Text>
          <View style={styles.meta}>
            <View style={styles.metaItem}>
              <Ionicons name="time-outline" size={11} color={theme.colors.textMuted} />
              <Text style={styles.metaText}>{service.duration}min</Text>
            </View>
          </View>
          <Text style={[styles.price, selected && styles.priceSelected]}>
            R${service.price}
          </Text>
          {selected && (
            <View style={styles.checkmark}>
              <Ionicons name="checkmark-circle" size={18} color={theme.colors.primary} />
            </View>
          )}
        </Animated.View>
      </TouchableOpacity>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: theme.colors.card,
    borderRadius: theme.borderRadius.lg,
    padding: 16,
    width: 140,
    marginRight: 12,
    borderWidth: 1,
    borderColor: theme.colors.border,
    position: 'relative',
    overflow: 'hidden',
    ...theme.shadows.sm,
  },
  iconContainer: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: theme.colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
  },
  iconContainerSelected: {
    backgroundColor: theme.colors.primaryTransparent,
  },
  name: {
    color: theme.colors.textSecondary,
    fontSize: 13,
    fontWeight: theme.fontWeight.semibold,
    marginBottom: 6,
    lineHeight: 18,
  },
  nameSelected: {
    color: theme.colors.text,
  },
  meta: {
    flexDirection: 'row',
    marginBottom: 8,
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
  },
  metaText: {
    color: theme.colors.textMuted,
    fontSize: 11,
  },
  price: {
    color: theme.colors.textMuted,
    fontSize: 16,
    fontWeight: theme.fontWeight.bold,
  },
  priceSelected: {
    color: theme.colors.primary,
  },
  checkmark: {
    position: 'absolute',
    top: 8,
    right: 8,
  },
});
