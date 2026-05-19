import React, { useRef, useState } from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity,
  Image, Animated, Dimensions, Share, Alert
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { theme } from '../theme';
import { StarRating } from '../components/StarRating';
import { useApp } from '../context/AppContext';

const { width, height } = Dimensions.get('window');
const HEADER_HEIGHT = 300;

export default function BarberProfileScreen({ route, navigation }) {
  const { barber } = route.params;
  const { state, toggleFavorite } = useApp();
  const isFavorite = state.favorites.includes(barber.id);
  const scrollY = useRef(new Animated.Value(0)).current;
  const [activeTab, setActiveTab] = useState('about');
  const [selectedPortfolio, setSelectedPortfolio] = useState(null);

  const headerOpacity = scrollY.interpolate({
    inputRange: [200, 280],
    outputRange: [0, 1],
    extrapolate: 'clamp',
  });

  const imageScale = scrollY.interpolate({
    inputRange: [-100, 0],
    outputRange: [1.3, 1],
    extrapolate: 'clamp',
  });

  const handleShare = async () => {
    await Share.share({
      message: `Confira este barbeiro incrível: ${barber.name} - ${barber.rating}⭐ no BarberGo!`,
    });
  };

  const TABS = [
    { id: 'about', label: 'Sobre' },
    { id: 'portfolio', label: 'Portfólio' },
    { id: 'reviews', label: `Avaliações (${barber.reviewsCount})` },
  ];

  return (
    <View style={styles.container}>
      {/* Sticky Header (for scroll) */}
      <Animated.View style={[styles.stickyHeader, { opacity: headerOpacity }]}>
        <LinearGradient
          colors={[theme.colors.background, theme.colors.background]}
          style={StyleSheet.absoluteFill}
        />
        <SafeAreaView edges={['top']}>
          <View style={styles.stickyHeaderContent}>
            <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
              <Ionicons name="chevron-back" size={22} color={theme.colors.text} />
            </TouchableOpacity>
            <Text style={styles.stickyTitle}>{barber.name}</Text>
            <TouchableOpacity onPress={handleShare}>
              <Ionicons name="share-outline" size={22} color={theme.colors.text} />
            </TouchableOpacity>
          </View>
        </SafeAreaView>
      </Animated.View>

      {/* Floating Back Button */}
      <SafeAreaView style={styles.floatingNav} edges={['top']} pointerEvents="box-none">
        <View style={styles.floatingNavContent}>
          <TouchableOpacity style={styles.floatBtn} onPress={() => navigation.goBack()}>
            <Ionicons name="chevron-back" size={22} color={theme.colors.text} />
          </TouchableOpacity>
          <View style={styles.floatActions}>
            <TouchableOpacity style={styles.floatBtn} onPress={handleShare}>
              <Ionicons name="share-outline" size={20} color={theme.colors.text} />
            </TouchableOpacity>
            <TouchableOpacity style={styles.floatBtn} onPress={() => toggleFavorite(barber.id)}>
              <Ionicons
                name={isFavorite ? 'heart' : 'heart-outline'}
                size={20}
                color={isFavorite ? '#FF453A' : theme.colors.text}
              />
            </TouchableOpacity>
          </View>
        </View>
      </SafeAreaView>

      <Animated.ScrollView
        style={styles.scroll}
        onScroll={Animated.event([{ nativeEvent: { contentOffset: { y: scrollY } } }], { useNativeDriver: false })}
        scrollEventThrottle={16}
        showsVerticalScrollIndicator={false}
      >
        {/* Cover Image with Parallax */}
        <Animated.View style={[styles.heroContainer, { transform: [{ scale: imageScale }] }]}>
          <Image source={{ uri: barber.coverImage }} style={styles.heroImage} />
          <LinearGradient
            colors={['transparent', 'rgba(10,10,10,0.7)', theme.colors.background]}
            style={styles.heroGradient}
            start={{ x: 0, y: 0.3 }}
            end={{ x: 0, y: 1 }}
          />
        </Animated.View>

        {/* Profile Section */}
        <View style={styles.profileSection}>
          <View style={styles.profileHeader}>
            <View style={styles.avatarWrapper}>
              <Image source={{ uri: barber.avatar }} style={styles.avatar} />
              {barber.isAvailable && <View style={styles.onlineIndicator} />}
            </View>
            <View style={styles.profileInfo}>
              <View style={styles.nameRow}>
                <Text style={styles.name}>{barber.name}</Text>
                {barber.isVerified && (
                  <Ionicons name="checkmark-circle" size={20} color={theme.colors.primary} />
                )}
              </View>
              <StarRating rating={barber.rating} size={14} showCount count={barber.reviewsCount} />
              <Text style={[styles.availabilityText, barber.isAvailable ? styles.available : styles.unavailable]}>
                {barber.isAvailable ? '● Disponível agora' : '● Indisponível'}
              </Text>
            </View>
          </View>

          {/* Quick Stats */}
          <View style={styles.stats}>
            <View style={styles.stat}>
              <LinearGradient colors={['rgba(245,166,35,0.2)', 'rgba(245,166,35,0.1)']} style={styles.statBg}>
                <Ionicons name="cut" size={20} color={theme.colors.primary} />
              </LinearGradient>
              <Text style={styles.statValue}>{barber.totalCuts.toLocaleString()}</Text>
              <Text style={styles.statLabel}>Cortes</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.stat}>
              <LinearGradient colors={['rgba(245,166,35,0.2)', 'rgba(245,166,35,0.1)']} style={styles.statBg}>
                <Ionicons name="trophy" size={20} color={theme.colors.primary} />
              </LinearGradient>
              <Text style={styles.statValue}>{barber.experience} anos</Text>
              <Text style={styles.statLabel}>Experiência</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.stat}>
              <LinearGradient colors={['rgba(245,166,35,0.2)', 'rgba(245,166,35,0.1)']} style={styles.statBg}>
                <Ionicons name="location" size={20} color={theme.colors.primary} />
              </LinearGradient>
              <Text style={styles.statValue}>{barber.distance} km</Text>
              <Text style={styles.statLabel}>Distância</Text>
            </View>
          </View>

          {/* Tabs */}
          <View style={styles.tabs}>
            {TABS.map(tab => (
              <TouchableOpacity
                key={tab.id}
                onPress={() => setActiveTab(tab.id)}
                style={[styles.tab, activeTab === tab.id && styles.tabActive]}
              >
                <Text style={[styles.tabText, activeTab === tab.id && styles.tabTextActive]}>
                  {tab.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          {/* Tab Content */}
          {activeTab === 'about' && (
            <View style={styles.tabContent}>
              <Text style={styles.bio}>{barber.bio}</Text>
              
              {/* Specialties */}
              <Text style={styles.sectionLabel}>Especialidades</Text>
              <View style={styles.specialties}>
                {barber.specialties.map((spec, i) => (
                  <View key={i} style={styles.specialtyTag}>
                    <Ionicons name="checkmark-circle" size={14} color={theme.colors.primary} />
                    <Text style={styles.specialtyText}>{spec}</Text>
                  </View>
                ))}
              </View>
            </View>
          )}

          {activeTab === 'portfolio' && (
            <View style={styles.tabContent}>
              <View style={styles.portfolio}>
                {barber.portfolio.map((img, i) => (
                  <TouchableOpacity
                    key={i}
                    style={styles.portfolioItem}
                    onPress={() => setSelectedPortfolio(img)}
                  >
                    <Image source={{ uri: img }} style={styles.portfolioImage} />
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          )}

          {activeTab === 'reviews' && (
            <View style={styles.tabContent}>
              {/* Rating Summary */}
              <View style={styles.ratingSummary}>
                <View style={styles.ratingBig}>
                  <Text style={styles.ratingBigNumber}>{barber.rating.toFixed(1)}</Text>
                  <StarRating rating={barber.rating} size={20} />
                  <Text style={styles.ratingBigCount}>{barber.reviewsCount} avaliações</Text>
                </View>
                <View style={styles.ratingBars}>
                  {[5, 4, 3, 2, 1].map(star => (
                    <View key={star} style={styles.ratingBar}>
                      <Text style={styles.ratingBarLabel}>{star}</Text>
                      <Ionicons name="star" size={12} color={theme.colors.star} />
                      <View style={styles.ratingBarTrack}>
                        <View
                          style={[
                            styles.ratingBarFill,
                            {
                              width: `${star === 5 ? 75 : star === 4 ? 20 : star === 3 ? 4 : 1}%`,
                            },
                          ]}
                        />
                      </View>
                    </View>
                  ))}
                </View>
              </View>

              {/* Individual Reviews */}
              {barber.reviews.map(review => (
                <View key={review.id} style={styles.review}>
                  <View style={styles.reviewHeader}>
                    <Image source={{ uri: review.avatar }} style={styles.reviewAvatar} />
                    <View style={styles.reviewInfo}>
                      <Text style={styles.reviewUser}>{review.user}</Text>
                      <StarRating rating={review.rating} size={12} />
                    </View>
                    <Text style={styles.reviewDate}>{review.date}</Text>
                  </View>
                  <Text style={styles.reviewComment}>{review.comment}</Text>
                </View>
              ))}
            </View>
          )}
        </View>

        <View style={{ height: 120 }} />
      </Animated.ScrollView>

      {/* Book Button */}
      <View style={styles.footer}>
        <LinearGradient
          colors={['transparent', theme.colors.background]}
          style={StyleSheet.absoluteFill}
          start={{ x: 0, y: 0 }}
        />
        <View style={styles.footerContent}>
          <View style={styles.footerPrice}>
            <Text style={styles.footerPriceLabel}>A partir de</Text>
            <Text style={styles.footerPriceValue}>R${barber.price}</Text>
          </View>
          <TouchableOpacity
            style={[styles.bookBtn, !barber.isAvailable && styles.bookBtnDisabled]}
            onPress={() => barber.isAvailable && navigation.navigate('Booking', { barber })}
            activeOpacity={0.85}
          >
            <LinearGradient
              colors={barber.isAvailable ? [theme.colors.primary, '#FF6B35'] : [theme.colors.textDisabled, theme.colors.textDisabled]}
              style={styles.bookBtnGradient}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
            >
              <Ionicons name="calendar" size={20} color="#fff" />
              <Text style={styles.bookBtnText}>
                {barber.isAvailable ? 'Agendar Agora' : 'Indisponível'}
              </Text>
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
  stickyHeader: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 20,
  },
  stickyHeaderContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 12,
  },
  stickyTitle: {
    color: theme.colors.text,
    fontSize: 16,
    fontWeight: theme.fontWeight.bold,
  },
  floatingNav: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 10,
  },
  floatingNavContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  floatBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(0,0,0,0.5)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  floatActions: {
    flexDirection: 'row',
    gap: 8,
  },
  scroll: {
    flex: 1,
  },
  heroContainer: {
    height: HEADER_HEIGHT,
    width: '100%',
    overflow: 'hidden',
  },
  heroImage: {
    width: '100%',
    height: '100%',
  },
  heroGradient: {
    ...StyleSheet.absoluteFillObject,
  },
  profileSection: {
    backgroundColor: theme.colors.background,
    marginTop: -32,
    borderTopLeftRadius: 32,
    borderTopRightRadius: 32,
    paddingTop: 24,
    paddingHorizontal: 20,
  },
  profileHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 20,
    gap: 16,
  },
  avatarWrapper: {
    position: 'relative',
    marginTop: -48,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    borderWidth: 3,
    borderColor: theme.colors.primary,
  },
  onlineIndicator: {
    position: 'absolute',
    bottom: 2,
    right: 2,
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: theme.colors.success,
    borderWidth: 2,
    borderColor: theme.colors.background,
  },
  profileInfo: {
    flex: 1,
    paddingTop: 8,
  },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 4,
  },
  name: {
    color: theme.colors.text,
    fontSize: 22,
    fontWeight: theme.fontWeight.black,
  },
  availabilityText: {
    fontSize: 13,
    fontWeight: theme.fontWeight.medium,
    marginTop: 4,
  },
  available: {
    color: theme.colors.success,
  },
  unavailable: {
    color: theme.colors.error,
  },
  stats: {
    flexDirection: 'row',
    backgroundColor: theme.colors.card,
    borderRadius: theme.borderRadius.xl,
    padding: 16,
    marginBottom: 24,
    alignItems: 'center',
  },
  stat: {
    flex: 1,
    alignItems: 'center',
    gap: 8,
  },
  statBg: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
  },
  statValue: {
    color: theme.colors.text,
    fontSize: 15,
    fontWeight: theme.fontWeight.bold,
  },
  statLabel: {
    color: theme.colors.textMuted,
    fontSize: 12,
  },
  statDivider: {
    width: 1,
    height: 50,
    backgroundColor: theme.colors.border,
  },
  tabs: {
    flexDirection: 'row',
    backgroundColor: theme.colors.card,
    borderRadius: theme.borderRadius.lg,
    padding: 4,
    marginBottom: 20,
  },
  tab: {
    flex: 1,
    paddingVertical: 10,
    alignItems: 'center',
    borderRadius: theme.borderRadius.md,
  },
  tabActive: {
    backgroundColor: theme.colors.primary,
  },
  tabText: {
    color: theme.colors.textMuted,
    fontSize: 13,
    fontWeight: theme.fontWeight.semibold,
  },
  tabTextActive: {
    color: theme.colors.background,
    fontWeight: theme.fontWeight.bold,
  },
  tabContent: {
    minHeight: 200,
  },
  bio: {
    color: theme.colors.textSecondary,
    fontSize: 15,
    lineHeight: 24,
    marginBottom: 20,
  },
  sectionLabel: {
    color: theme.colors.text,
    fontSize: 16,
    fontWeight: theme.fontWeight.bold,
    marginBottom: 12,
  },
  specialties: {
    gap: 10,
  },
  specialtyTag: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    backgroundColor: theme.colors.card,
    borderRadius: theme.borderRadius.md,
    padding: 12,
  },
  specialtyText: {
    color: theme.colors.textSecondary,
    fontSize: 14,
    fontWeight: theme.fontWeight.medium,
  },
  portfolio: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 4,
  },
  portfolioItem: {
    width: (width - 48) / 2,
    height: 160,
    borderRadius: theme.borderRadius.md,
    overflow: 'hidden',
  },
  portfolioImage: {
    width: '100%',
    height: '100%',
  },
  ratingSummary: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.card,
    borderRadius: theme.borderRadius.xl,
    padding: 16,
    marginBottom: 20,
    gap: 20,
  },
  ratingBig: {
    alignItems: 'center',
    gap: 4,
  },
  ratingBigNumber: {
    color: theme.colors.text,
    fontSize: 48,
    fontWeight: theme.fontWeight.black,
    lineHeight: 56,
  },
  ratingBigCount: {
    color: theme.colors.textMuted,
    fontSize: 12,
  },
  ratingBars: {
    flex: 1,
    gap: 6,
  },
  ratingBar: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  ratingBarLabel: {
    color: theme.colors.textMuted,
    fontSize: 12,
    width: 10,
    textAlign: 'right',
  },
  ratingBarTrack: {
    flex: 1,
    height: 6,
    backgroundColor: theme.colors.border,
    borderRadius: 3,
    overflow: 'hidden',
  },
  ratingBarFill: {
    height: '100%',
    backgroundColor: theme.colors.star,
    borderRadius: 3,
  },
  review: {
    backgroundColor: theme.colors.card,
    borderRadius: theme.borderRadius.lg,
    padding: 16,
    marginBottom: 12,
  },
  reviewHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    gap: 12,
  },
  reviewAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },
  reviewInfo: {
    flex: 1,
    gap: 4,
  },
  reviewUser: {
    color: theme.colors.text,
    fontSize: 14,
    fontWeight: theme.fontWeight.bold,
  },
  reviewDate: {
    color: theme.colors.textMuted,
    fontSize: 12,
  },
  reviewComment: {
    color: theme.colors.textSecondary,
    fontSize: 14,
    lineHeight: 20,
  },
  footer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    paddingTop: 16,
  },
  footerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingBottom: 34,
    paddingTop: 12,
    gap: 16,
    backgroundColor: theme.colors.background,
    borderTopWidth: 1,
    borderTopColor: theme.colors.border,
  },
  footerPrice: {
    alignItems: 'flex-start',
  },
  footerPriceLabel: {
    color: theme.colors.textMuted,
    fontSize: 12,
  },
  footerPriceValue: {
    color: theme.colors.text,
    fontSize: 22,
    fontWeight: theme.fontWeight.black,
  },
  bookBtn: {
    flex: 1,
    borderRadius: theme.borderRadius.full,
    overflow: 'hidden',
    ...theme.shadows.primary,
  },
  bookBtnDisabled: {
    opacity: 0.5,
  },
  bookBtnGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    height: 56,
    borderRadius: theme.borderRadius.full,
  },
  bookBtnText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: theme.fontWeight.bold,
  },
  backBtn: {},
});
