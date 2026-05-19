import React, { useRef } from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity,
  Image, Animated
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { theme } from '../theme';
import { StarRating } from './StarRating';
import { useApp } from '../context/AppContext';

export const BarberCard = ({ barber, onPress, style }) => {
  const { state, toggleFavorite } = useApp();
  const isFavorite = state.favorites.includes(barber.id);
  const scaleAnim = useRef(new Animated.Value(1)).current;

  const handlePressIn = () => {
    Animated.spring(scaleAnim, { toValue: 0.97, useNativeDriver: true, speed: 50 }).start();
  };
  const handlePressOut = () => {
    Animated.spring(scaleAnim, { toValue: 1, useNativeDriver: true, speed: 50 }).start();
  };

  return (
    <Animated.View style={[{ transform: [{ scale: scaleAnim }] }, style]}>
      <TouchableOpacity
        activeOpacity={1}
        onPress={onPress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        style={styles.card}
      >
        <View style={styles.imageContainer}>
          <Image source={{ uri: barber.coverImage }} style={styles.coverImage} />
          <LinearGradient
            colors={['transparent', 'rgba(0,0,0,0.85)']}
            style={styles.gradient}
          />
          
          {/* Badges */}
          <View style={styles.badges}>
            {barber.isVerified && (
              <View style={styles.badge}>
                <Ionicons name="checkmark-circle" size={12} color={theme.colors.primary} />
                <Text style={styles.badgeText}>Verificado</Text>
              </View>
            )}
            {!barber.isAvailable && (
              <View style={[styles.badge, styles.unavailableBadge]}>
                <Text style={styles.badgeText}>Indisponível</Text>
              </View>
            )}
          </View>

          {/* Favorite */}
          <TouchableOpacity
            style={styles.favoriteBtn}
            onPress={() => toggleFavorite(barber.id)}
          >
            <Ionicons
              name={isFavorite ? 'heart' : 'heart-outline'}
              size={20}
              color={isFavorite ? '#FF453A' : '#FFFFFF'}
            />
          </TouchableOpacity>

          {/* Rating on image */}
          <View style={styles.ratingBadge}>
            <Ionicons name="star" size={12} color={theme.colors.star} />
            <Text style={styles.ratingText}>{barber.rating.toFixed(1)}</Text>
          </View>
        </View>

        <View style={styles.content}>
          <View style={styles.header}>
            <View style={styles.avatarContainer}>
              <Image source={{ uri: barber.avatar }} style={styles.avatar} />
              {barber.isAvailable && <View style={styles.onlineIndicator} />}
            </View>
            <View style={styles.info}>
              <Text style={styles.name}>{barber.name}</Text>
              <View style={styles.ratingRow}>
                <StarRating rating={barber.rating} size={12} />
                <Text style={styles.reviewsCount}>({barber.reviewsCount})</Text>
              </View>
            </View>
            <View style={styles.priceContainer}>
              <Text style={styles.priceLabel}>a partir de</Text>
              <Text style={styles.price}>R${barber.price}</Text>
            </View>
          </View>

          <View style={styles.specialties}>
            {barber.specialties.slice(0, 3).map((spec, i) => (
              <View key={i} style={styles.tag}>
                <Text style={styles.tagText}>{spec}</Text>
              </View>
            ))}
          </View>

          <View style={styles.footer}>
            <View style={styles.stat}>
              <Ionicons name="location-outline" size={14} color={theme.colors.textMuted} />
              <Text style={styles.statText}>{barber.distance} km</Text>
            </View>
            <View style={styles.stat}>
              <Ionicons name="time-outline" size={14} color={theme.colors.textMuted} />
              <Text style={styles.statText}>{barber.experience} anos exp.</Text>
            </View>
            <View style={styles.stat}>
              <Ionicons name="cut-outline" size={14} color={theme.colors.textMuted} />
              <Text style={styles.statText}>{barber.totalCuts.toLocaleString()} cortes</Text>
            </View>
          </View>
        </View>
      </TouchableOpacity>
    </Animated.View>
  );
};

export const BarberCardHorizontal = ({ barber, onPress }) => {
  const { state, toggleFavorite } = useApp();
  const isFavorite = state.favorites.includes(barber.id);

  return (
    <TouchableOpacity style={styles.hCard} onPress={onPress} activeOpacity={0.85}>
      <View style={styles.hImageContainer}>
        <Image source={{ uri: barber.avatar }} style={styles.hAvatar} />
        {barber.isAvailable && <View style={styles.hOnlineIndicator} />}
      </View>
      <View style={styles.hContent}>
        <View style={styles.hHeader}>
          <Text style={styles.hName}>{barber.name}</Text>
          <TouchableOpacity onPress={() => toggleFavorite(barber.id)}>
            <Ionicons
              name={isFavorite ? 'heart' : 'heart-outline'}
              size={18}
              color={isFavorite ? '#FF453A' : theme.colors.textMuted}
            />
          </TouchableOpacity>
        </View>
        <StarRating rating={barber.rating} size={12} showCount count={barber.reviewsCount} />
        <View style={styles.hFooter}>
          <Text style={styles.hPrice}>R${barber.price}+</Text>
          <View style={styles.hDistance}>
            <Ionicons name="location-outline" size={12} color={theme.colors.primary} />
            <Text style={styles.hDistanceText}>{barber.distance} km</Text>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: theme.colors.card,
    borderRadius: theme.borderRadius.xl,
    overflow: 'hidden',
    ...theme.shadows.md,
  },
  imageContainer: {
    height: 180,
    position: 'relative',
  },
  coverImage: {
    width: '100%',
    height: '100%',
  },
  gradient: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 80,
  },
  badges: {
    position: 'absolute',
    top: 12,
    left: 12,
    flexDirection: 'row',
    gap: 6,
  },
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.6)',
    borderRadius: theme.borderRadius.full,
    paddingHorizontal: 8,
    paddingVertical: 4,
    gap: 4,
  },
  unavailableBadge: {
    backgroundColor: 'rgba(255, 69, 58, 0.8)',
  },
  badgeText: {
    color: theme.colors.text,
    fontSize: 10,
    fontWeight: theme.fontWeight.semibold,
  },
  favoriteBtn: {
    position: 'absolute',
    top: 12,
    right: 12,
    backgroundColor: 'rgba(0,0,0,0.5)',
    borderRadius: theme.borderRadius.full,
    padding: 8,
  },
  ratingBadge: {
    position: 'absolute',
    bottom: 12,
    right: 12,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.6)',
    borderRadius: theme.borderRadius.full,
    paddingHorizontal: 8,
    paddingVertical: 4,
    gap: 4,
  },
  ratingText: {
    color: theme.colors.text,
    fontSize: 12,
    fontWeight: theme.fontWeight.bold,
  },
  content: {
    padding: 16,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  avatarContainer: {
    position: 'relative',
    marginRight: 12,
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    borderWidth: 2,
    borderColor: theme.colors.primary,
  },
  onlineIndicator: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: theme.colors.success,
    borderWidth: 2,
    borderColor: theme.colors.card,
  },
  info: {
    flex: 1,
  },
  name: {
    color: theme.colors.text,
    fontSize: 16,
    fontWeight: theme.fontWeight.bold,
    marginBottom: 4,
  },
  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  reviewsCount: {
    color: theme.colors.textMuted,
    fontSize: 12,
  },
  priceContainer: {
    alignItems: 'flex-end',
  },
  priceLabel: {
    color: theme.colors.textMuted,
    fontSize: 10,
  },
  price: {
    color: theme.colors.primary,
    fontSize: 18,
    fontWeight: theme.fontWeight.bold,
  },
  specialties: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
    marginBottom: 12,
  },
  tag: {
    backgroundColor: theme.colors.primaryTransparent,
    borderRadius: theme.borderRadius.full,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderWidth: 1,
    borderColor: 'rgba(245, 166, 35, 0.2)',
  },
  tagText: {
    color: theme.colors.primary,
    fontSize: 11,
    fontWeight: theme.fontWeight.medium,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderTopWidth: 1,
    borderTopColor: theme.colors.border,
    paddingTop: 12,
  },
  stat: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  statText: {
    color: theme.colors.textMuted,
    fontSize: 12,
  },
  // Horizontal card
  hCard: {
    backgroundColor: theme.colors.card,
    borderRadius: theme.borderRadius.lg,
    padding: 12,
    flexDirection: 'row',
    alignItems: 'center',
    width: 200,
    marginRight: 12,
    ...theme.shadows.sm,
  },
  hImageContainer: {
    position: 'relative',
    marginRight: 12,
  },
  hAvatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    borderWidth: 2,
    borderColor: theme.colors.primary,
  },
  hOnlineIndicator: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: theme.colors.success,
    borderWidth: 2,
    borderColor: theme.colors.card,
  },
  hContent: {
    flex: 1,
  },
  hHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  hName: {
    color: theme.colors.text,
    fontSize: 13,
    fontWeight: theme.fontWeight.bold,
    flex: 1,
  },
  hFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 6,
  },
  hPrice: {
    color: theme.colors.primary,
    fontSize: 14,
    fontWeight: theme.fontWeight.bold,
  },
  hDistance: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
  },
  hDistanceText: {
    color: theme.colors.primary,
    fontSize: 11,
  },
});
