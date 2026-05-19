import React, { useEffect, useRef } from 'react';
import {
  View, Text, StyleSheet, Animated, Dimensions, StatusBar
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { theme } from '../theme';

const { width, height } = Dimensions.get('window');

export default function SplashScreen({ navigation }) {
  const logoScale = useRef(new Animated.Value(0)).current;
  const logoOpacity = useRef(new Animated.Value(0)).current;
  const textOpacity = useRef(new Animated.Value(0)).current;
  const ring1Scale = useRef(new Animated.Value(0)).current;
  const ring2Scale = useRef(new Animated.Value(0)).current;
  const ring3Scale = useRef(new Animated.Value(0)).current;
  const ring1Opacity = useRef(new Animated.Value(0.4)).current;
  const ring2Opacity = useRef(new Animated.Value(0.3)).current;
  const ring3Opacity = useRef(new Animated.Value(0.2)).current;
  const taglineOpacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Rings animation
    const ringsAnim = Animated.loop(
      Animated.stagger(400, [
        Animated.sequence([
          Animated.timing(ring1Scale, { toValue: 1.5, duration: 2000, useNativeDriver: true }),
          Animated.timing(ring1Scale, { toValue: 1, duration: 0, useNativeDriver: true }),
        ]),
        Animated.sequence([
          Animated.timing(ring2Scale, { toValue: 1.5, duration: 2000, useNativeDriver: true }),
          Animated.timing(ring2Scale, { toValue: 1, duration: 0, useNativeDriver: true }),
        ]),
      ])
    );

    // Logo animation sequence
    Animated.sequence([
      Animated.delay(300),
      Animated.parallel([
        Animated.spring(logoScale, {
          toValue: 1,
          tension: 50,
          friction: 7,
          useNativeDriver: true,
        }),
        Animated.timing(logoOpacity, {
          toValue: 1,
          duration: 600,
          useNativeDriver: true,
        }),
        Animated.timing(ring1Scale, { toValue: 1, duration: 400, useNativeDriver: true }),
        Animated.timing(ring2Scale, { toValue: 1, duration: 600, useNativeDriver: true }),
        Animated.timing(ring3Scale, { toValue: 1, duration: 800, useNativeDriver: true }),
      ]),
      Animated.delay(200),
      Animated.timing(textOpacity, { toValue: 1, duration: 400, useNativeDriver: true }),
      Animated.delay(200),
      Animated.timing(taglineOpacity, { toValue: 1, duration: 400, useNativeDriver: true }),
      Animated.delay(1200),
      Animated.parallel([
        Animated.timing(logoOpacity, { toValue: 0, duration: 400, useNativeDriver: true }),
        Animated.timing(textOpacity, { toValue: 0, duration: 400, useNativeDriver: true }),
        Animated.timing(taglineOpacity, { toValue: 0, duration: 400, useNativeDriver: true }),
      ]),
    ]).start(() => {
      navigation.replace('Onboarding');
    });

    ringsAnim.start();
    return () => ringsAnim.stop();
  }, []);

  return (
    <View style={styles.container}>
      <StatusBar hidden />
      <LinearGradient
        colors={['#0A0A0A', '#1A0E00', '#0A0A0A']}
        style={StyleSheet.absoluteFill}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      />

      {/* Animated rings */}
      <Animated.View style={[styles.ring, styles.ring3, { transform: [{ scale: ring3Scale }], opacity: ring3Opacity }]} />
      <Animated.View style={[styles.ring, styles.ring2, { transform: [{ scale: ring2Scale }], opacity: ring2Opacity }]} />
      <Animated.View style={[styles.ring, styles.ring1, { transform: [{ scale: ring1Scale }], opacity: ring1Opacity }]} />

      {/* Logo */}
      <Animated.View style={[styles.logoContainer, { opacity: logoOpacity, transform: [{ scale: logoScale }] }]}>
        <LinearGradient
          colors={[theme.colors.primary, '#FF6B35']}
          style={styles.logoGradient}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
        >
          <Text style={styles.logoIcon}>✂</Text>
        </LinearGradient>
      </Animated.View>

      {/* Brand Name */}
      <Animated.View style={{ opacity: textOpacity, alignItems: 'center' }}>
        <Text style={styles.brandName}>
          <Text style={styles.brandPrimary}>Barber</Text>
          <Text style={styles.brandAccent}>Go</Text>
        </Text>
      </Animated.View>

      {/* Tagline */}
      <Animated.Text style={[styles.tagline, { opacity: taglineOpacity }]}>
        Seu barbeiro. Na sua casa.
      </Animated.Text>
    </View>
  );
}

const RING_SIZE = 180;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
    alignItems: 'center',
    justifyContent: 'center',
  },
  ring: {
    position: 'absolute',
    borderRadius: 999,
    borderWidth: 1,
    borderColor: theme.colors.primary,
  },
  ring1: {
    width: RING_SIZE,
    height: RING_SIZE,
  },
  ring2: {
    width: RING_SIZE * 1.6,
    height: RING_SIZE * 1.6,
  },
  ring3: {
    width: RING_SIZE * 2.2,
    height: RING_SIZE * 2.2,
  },
  logoContainer: {
    marginBottom: 20,
  },
  logoGradient: {
    width: 100,
    height: 100,
    borderRadius: 32,
    alignItems: 'center',
    justifyContent: 'center',
    ...theme.shadows.primary,
  },
  logoIcon: {
    fontSize: 52,
    color: '#fff',
  },
  brandName: {
    fontSize: 42,
    fontWeight: theme.fontWeight.black,
    letterSpacing: -1,
  },
  brandPrimary: {
    color: theme.colors.text,
  },
  brandAccent: {
    color: theme.colors.primary,
  },
  tagline: {
    color: theme.colors.textMuted,
    fontSize: 16,
    fontWeight: theme.fontWeight.medium,
    marginTop: 8,
    letterSpacing: 0.5,
  },
});
