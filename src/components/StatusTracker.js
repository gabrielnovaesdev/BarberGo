import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Animated, Easing } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { theme } from '../theme';

const STEPS = [
  { id: 1, icon: 'checkmark-circle', label: 'Confirmado', sublabel: 'Agendamento aceito' },
  { id: 2, icon: 'bicycle', label: 'A Caminho', sublabel: 'Barbeiro em deslocamento' },
  { id: 3, icon: 'home', label: 'Chegou!', sublabel: 'Barbeiro na porta' },
  { id: 4, icon: 'cut', label: 'Em Atendimento', sublabel: 'Corte em andamento' },
  { id: 5, icon: 'star', label: 'Concluído!', sublabel: 'Serviço finalizado' },
];

export const StatusTracker = ({ currentStep = 1 }) => {
  const pulseAnim = useRef(new Animated.Value(1)).current;
  const progressAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Pulse animation for active step
    const pulse = Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, { toValue: 1.3, duration: 800, easing: Easing.ease, useNativeDriver: true }),
        Animated.timing(pulseAnim, { toValue: 1, duration: 800, easing: Easing.ease, useNativeDriver: true }),
      ])
    );
    pulse.start();

    // Progress animation
    Animated.timing(progressAnim, {
      toValue: (currentStep - 1) / (STEPS.length - 1),
      duration: 600,
      easing: Easing.out(Easing.cubic),
      useNativeDriver: false,
    }).start();

    return () => pulse.stop();
  }, [currentStep]);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Rastreamento ao Vivo</Text>
      
      {/* Progress Bar */}
      <View style={styles.progressContainer}>
        <View style={styles.progressTrack} />
        <Animated.View
          style={[
            styles.progressFill,
            {
              width: progressAnim.interpolate({
                inputRange: [0, 1],
                outputRange: ['0%', '100%'],
              }),
            },
          ]}
        />
      </View>

      {/* Steps */}
      <View style={styles.steps}>
        {STEPS.map((step, index) => {
          const isCompleted = step.id < currentStep;
          const isActive = step.id === currentStep;
          const isPending = step.id > currentStep;

          return (
            <View key={step.id} style={styles.step}>
              <Animated.View
                style={[
                  styles.stepIcon,
                  isCompleted && styles.stepCompleted,
                  isActive && styles.stepActive,
                  isPending && styles.stepPending,
                  isActive && { transform: [{ scale: pulseAnim }] },
                ]}
              >
                {isCompleted ? (
                  <Ionicons name="checkmark" size={16} color={theme.colors.background} />
                ) : (
                  <Ionicons
                    name={step.icon}
                    size={16}
                    color={isActive ? theme.colors.background : theme.colors.textDisabled}
                  />
                )}
              </Animated.View>
              <Text
                style={[
                  styles.stepLabel,
                  isActive && styles.stepLabelActive,
                  isCompleted && styles.stepLabelCompleted,
                ]}
                numberOfLines={1}
              >
                {step.label}
              </Text>
            </View>
          );
        })}
      </View>

      {/* Current Status */}
      {currentStep <= STEPS.length && (
        <LinearGradient
          colors={['rgba(245,166,35,0.1)', 'rgba(245,166,35,0.05)']}
          style={styles.currentStatus}
        >
          <Ionicons name={STEPS[currentStep - 1].icon} size={20} color={theme.colors.primary} />
          <View style={styles.currentStatusText}>
            <Text style={styles.currentStatusTitle}>{STEPS[currentStep - 1].label}</Text>
            <Text style={styles.currentStatusSub}>{STEPS[currentStep - 1].sublabel}</Text>
          </View>
          {isActive(currentStep) && (
            <View style={styles.liveDot}>
              <View style={styles.liveDotInner} />
              <Text style={styles.liveText}>AO VIVO</Text>
            </View>
          )}
        </LinearGradient>
      )}
    </View>
  );
};

const isActive = (step) => step > 1 && step < 5;

const styles = StyleSheet.create({
  container: {
    backgroundColor: theme.colors.card,
    borderRadius: theme.borderRadius.xl,
    padding: 20,
    ...theme.shadows.md,
  },
  title: {
    color: theme.colors.text,
    fontSize: 16,
    fontWeight: theme.fontWeight.bold,
    marginBottom: 16,
  },
  progressContainer: {
    height: 4,
    backgroundColor: theme.colors.border,
    borderRadius: 2,
    marginBottom: 16,
    position: 'relative',
    overflow: 'hidden',
  },
  progressTrack: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: theme.colors.border,
  },
  progressFill: {
    height: '100%',
    backgroundColor: theme.colors.primary,
    borderRadius: 2,
  },
  steps: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  step: {
    alignItems: 'center',
    flex: 1,
  },
  stepIcon: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 6,
  },
  stepCompleted: {
    backgroundColor: theme.colors.primary,
  },
  stepActive: {
    backgroundColor: theme.colors.primary,
  },
  stepPending: {
    backgroundColor: theme.colors.surface,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  stepLabel: {
    color: theme.colors.textDisabled,
    fontSize: 9,
    textAlign: 'center',
    fontWeight: theme.fontWeight.medium,
  },
  stepLabelActive: {
    color: theme.colors.primary,
    fontWeight: theme.fontWeight.bold,
  },
  stepLabelCompleted: {
    color: theme.colors.textMuted,
  },
  currentStatus: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderRadius: theme.borderRadius.lg,
    gap: 12,
    borderWidth: 1,
    borderColor: 'rgba(245,166,35,0.2)',
  },
  currentStatusText: {
    flex: 1,
  },
  currentStatusTitle: {
    color: theme.colors.text,
    fontSize: 14,
    fontWeight: theme.fontWeight.bold,
  },
  currentStatusSub: {
    color: theme.colors.textMuted,
    fontSize: 12,
    marginTop: 2,
  },
  liveDot: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  liveDotInner: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#FF453A',
  },
  liveText: {
    color: '#FF453A',
    fontSize: 10,
    fontWeight: theme.fontWeight.bold,
  },
});
