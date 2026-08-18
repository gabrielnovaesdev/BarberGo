import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, Platform, Dimensions } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { AppProvider } from './src/context/AppContext';
import Navigation from './src/navigation';
import { LinearGradient } from 'expo-linear-gradient';
import { theme } from './src/theme';

export default function App() {
  const [dims, setDims] = useState(Dimensions.get('window'));
  const isDesktop = Platform.OS === 'web' && dims.width > 768;

  useEffect(() => {
    if (Platform.OS !== 'web') return;
    const subscription = Dimensions.addEventListener('change', ({ window }) => {
      setDims(window);
    });
    return () => subscription?.remove();
  }, []);

  if (isDesktop) {
    const screenHeight = Math.min(880, dims.height * 0.9);
    const screenWidth = Math.min(430, screenHeight * 0.49);

    return (
      <GestureHandlerRootView style={desktopStyles.wrapper}>
        <AppProvider>
          <StatusBar style="light" />
          <View style={desktopStyles.container}>
            {/* Left Side: Branding / Landing Page */}
            <View style={desktopStyles.brandingSide}>
              <LinearGradient
                colors={['#141414', '#0A0A0A']}
                style={desktopStyles.brandingBg}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
              />
              <View style={desktopStyles.brandingContent}>
                <View style={desktopStyles.logoRow}>
                  <LinearGradient
                    colors={[theme.colors.primary, '#FF6B35']}
                    style={desktopStyles.logoGradient}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                  >
                    <Text style={desktopStyles.logoIcon}>✂</Text>
                  </LinearGradient>
                  <Text style={desktopStyles.brandTitle}>
                    Barber<Text style={{ color: theme.colors.primary }}>Go</Text>
                  </Text>
                </View>

                <Text style={desktopStyles.heroText}>
                  Seu barbeiro profissional,{'\n'}
                  <Text style={{ color: theme.colors.primary }}>no conforto da sua casa.</Text>
                </Text>
                
                <Text style={desktopStyles.subHeroText}>
                  Agende cortes, barba e tratamentos com os melhores profissionais da sua região. Atendimento personalizado com rastreamento em tempo real.
                </Text>

                <View style={desktopStyles.featuresList}>
                  <View style={desktopStyles.featureItem}>
                    <View style={desktopStyles.featureIconContainer}>
                      <Text style={desktopStyles.featureIcon}>📍</Text>
                    </View>
                    <View style={desktopStyles.featureTextContainer}>
                      <Text style={desktopStyles.featureTitle}>Rastreamento em Tempo Real</Text>
                      <Text style={desktopStyles.featureDesc}>Acompanhe o trajeto do barbeiro até o seu endereço de forma instantânea.</Text>
                    </View>
                  </View>
                  <View style={desktopStyles.featureItem}>
                    <View style={desktopStyles.featureIconContainer}>
                      <Text style={desktopStyles.featureIcon}>⭐</Text>
                    </View>
                    <View style={desktopStyles.featureTextContainer}>
                      <Text style={desktopStyles.featureTitle}>Profissionais Avaliados</Text>
                      <Text style={desktopStyles.featureDesc}>Escolha com base em avaliações reais, comentários e fotos do portfólio.</Text>
                    </View>
                  </View>
                  <View style={desktopStyles.featureItem}>
                    <View style={desktopStyles.featureIconContainer}>
                      <Text style={desktopStyles.featureIcon}>📅</Text>
                    </View>
                    <View style={desktopStyles.featureTextContainer}>
                      <Text style={desktopStyles.featureTitle}>Agendamento Flexível</Text>
                      <Text style={desktopStyles.featureDesc}>Escolha serviços combinados e o melhor horário em poucos segundos.</Text>
                    </View>
                  </View>
                </View>

                {/* Stats Panel */}
                <View style={desktopStyles.statsRow}>
                  <View style={desktopStyles.statItem}>
                    <Text style={desktopStyles.statVal}>4.9★</Text>
                    <Text style={desktopStyles.statLbl}>Avaliação Média</Text>
                  </View>
                  <View style={desktopStyles.statItem}>
                    <Text style={desktopStyles.statVal}>15k+</Text>
                    <Text style={desktopStyles.statLbl}>Cortes Feitos</Text>
                  </View>
                  <View style={desktopStyles.statItem}>
                    <Text style={desktopStyles.statVal}>200+</Text>
                    <Text style={desktopStyles.statLbl}>Barbeiros Ativos</Text>
                  </View>
                </View>
              </View>
            </View>

            {/* Right Side: Phone Mockup Frame */}
            <View style={desktopStyles.appSide}>
              <View style={[desktopStyles.phoneFrame, { width: screenWidth + 24, height: screenHeight + 24 }]}>
                <View style={desktopStyles.phoneSpeaker} />
                <View style={[desktopStyles.phoneScreen, { width: screenWidth, height: screenHeight }]}>
                  <SafeAreaProvider>
                    <Navigation />
                  </SafeAreaProvider>
                </View>
              </View>
            </View>
          </View>
        </AppProvider>
      </GestureHandlerRootView>
    );
  }

  // Mobile Render
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <AppProvider>
          <StatusBar style="light" backgroundColor="#0A0A0A" />
          <Navigation />
        </AppProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}

const desktopStyles = StyleSheet.create({
  wrapper: {
    flex: 1,
    backgroundColor: '#0F0F0F',
  },
  container: {
    flex: 1,
    flexDirection: 'row',
    backgroundColor: '#050505',
  },
  brandingSide: {
    flex: 1.2,
    backgroundColor: '#0A0A0A',
    justifyContent: 'center',
    paddingHorizontal: 60,
    paddingVertical: 40,
    position: 'relative',
    overflow: 'hidden',
  },
  brandingBg: {
    ...StyleSheet.absoluteFillObject,
    opacity: 0.8,
  },
  brandingContent: {
    maxWidth: 600,
    alignSelf: 'center',
    gap: 32,
  },
  logoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  logoGradient: {
    width: 60,
    height: 60,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoIcon: {
    fontSize: 32,
    color: '#fff',
  },
  brandTitle: {
    color: '#fff',
    fontSize: 36,
    fontWeight: '900',
  },
  heroText: {
    color: '#fff',
    fontSize: 48,
    fontWeight: '900',
    lineHeight: 56,
    letterSpacing: -1,
  },
  subHeroText: {
    color: '#A0A0A0',
    fontSize: 18,
    lineHeight: 28,
  },
  featuresList: {
    gap: 20,
    marginTop: 10,
  },
  featureItem: {
    flexDirection: 'row',
    gap: 16,
    alignItems: 'flex-start',
  },
  featureIconContainer: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
    marginTop: 2,
  },
  featureIcon: {
    fontSize: 20,
  },
  featureTextContainer: {
    flex: 1,
  },
  featureTitle: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700',
  },
  featureDesc: {
    color: '#707070',
    fontSize: 14,
    marginTop: 4,
    lineHeight: 20,
  },
  statsRow: {
    flexDirection: 'row',
    gap: 40,
    marginTop: 20,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.1)',
    paddingTop: 32,
  },
  statItem: {
    gap: 4,
  },
  statVal: {
    color: '#F5A623',
    fontSize: 28,
    fontWeight: '800',
  },
  statLbl: {
    color: '#707070',
    fontSize: 12,
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  appSide: {
    flex: 1,
    backgroundColor: '#0F0F0F',
    alignItems: 'center',
    justifyContent: 'center',
    borderLeftWidth: 1,
    borderLeftColor: 'rgba(255, 255, 255, 0.05)',
    padding: 20,
  },
  phoneFrame: {
    borderRadius: 48,
    borderWidth: 12,
    borderColor: '#2D2D2D',
    backgroundColor: '#000',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 24 },
    shadowOpacity: 0.6,
    shadowRadius: 32,
    elevation: 24,
    overflow: 'hidden',
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center',
  },
  phoneSpeaker: {
    position: 'absolute',
    top: 12,
    width: 120,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#2D2D2D',
    zIndex: 9999,
  },
  phoneScreen: {
    overflow: 'hidden',
    backgroundColor: '#0A0A0A',
    borderRadius: 36,
  },
});
