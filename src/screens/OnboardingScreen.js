import React, { useRef, useState } from 'react';
import {
  View, Text, StyleSheet, FlatList, TouchableOpacity,
  Animated, Dimensions, StatusBar
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { theme } from '../theme';

const { width, height } = Dimensions.get('window');

const slides = [
  {
    id: '1',
    icon: '📍',
    bigIcon: 'location',
    title: 'Barbeiro na\nsua Porta',
    subtitle: 'Encontre os melhores barbeiros do seu bairro e agende na comodidade da sua casa.',
    color1: '#F5A623',
    color2: '#FF6B35',
    accent: '#FFB84D',
  },
  {
    id: '2',
    icon: '⭐',
    bigIcon: 'star',
    title: 'Os Melhores\nAvaliam',
    subtitle: 'Compare barbeiros por avaliações reais, portfólio de trabalhos e especialidades.',
    color1: '#6C63FF',
    color2: '#3B3ABF',
    accent: '#8B85FF',
  },
  {
    id: '3',
    icon: '✂️',
    bigIcon: 'cut',
    title: 'Agende em\nSegundos',
    subtitle: 'Escolha o serviço, horário e pronto! Rastreie o barbeiro em tempo real até sua casa.',
    color1: '#30D158',
    color2: '#21A44A',
    accent: '#4AE36A',
  },
];

export default function OnboardingScreen({ navigation }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const flatListRef = useRef(null);
  const slideAnim = useRef(new Animated.Value(0)).current;

  const handleNext = () => {
    if (currentIndex < slides.length - 1) {
      flatListRef.current?.scrollToIndex({ index: currentIndex + 1 });
      setCurrentIndex(currentIndex + 1);
    } else {
      navigation.replace('Login');
    }
  };

  const handleSkip = () => navigation.replace('Login');

  const renderSlide = ({ item, index }) => (
    <View style={styles.slide}>
      {/* Gradient Background */}
      <LinearGradient
        colors={[`${item.color1}22`, 'transparent']}
        style={styles.slideGradient}
        start={{ x: 0.5, y: 0 }}
        end={{ x: 0.5, y: 1 }}
      />

      {/* Icon Visual */}
      <View style={styles.iconWrapper}>
        <View style={[styles.outerRing, { borderColor: `${item.color1}30` }]}>
          <View style={[styles.innerRing, { borderColor: `${item.color1}50` }]}>
            <LinearGradient
              colors={[item.color1, item.color2]}
              style={styles.iconBg}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
            >
              <Ionicons name={item.bigIcon} size={72} color="#fff" />
            </LinearGradient>
          </View>
        </View>
        <Text style={styles.emoji}>{item.icon}</Text>
      </View>

      {/* Floating decorative elements */}
      <View style={[styles.floatBubble, styles.bubble1, { backgroundColor: `${item.color1}20` }]} />
      <View style={[styles.floatBubble, styles.bubble2, { backgroundColor: `${item.color1}15` }]} />

      {/* Text */}
      <View style={styles.textContainer}>
        <Text style={styles.title}>{item.title}</Text>
        <Text style={styles.subtitle}>{item.subtitle}</Text>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />
      <LinearGradient
        colors={[theme.colors.background, '#0D0D0D']}
        style={StyleSheet.absoluteFill}
      />

      {/* Skip button */}
      <TouchableOpacity style={styles.skipBtn} onPress={handleSkip}>
        <Text style={styles.skipText}>Pular</Text>
      </TouchableOpacity>

      {/* Slides */}
      <FlatList
        ref={flatListRef}
        data={slides}
        renderItem={renderSlide}
        keyExtractor={item => item.id}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onMomentumScrollEnd={(e) => {
          const index = Math.round(e.nativeEvent.contentOffset.x / width);
          setCurrentIndex(index);
        }}
        scrollEnabled={true}
      />

      {/* Bottom section */}
      <View style={styles.bottom}>
        {/* Dots */}
        <View style={styles.dots}>
          {slides.map((_, index) => {
            const isActive = index === currentIndex;
            const dotColor = slides[currentIndex].color1;
            return (
              <Animated.View
                key={index}
                style={[
                  styles.dot,
                  isActive && [styles.dotActive, { backgroundColor: dotColor, width: 24 }],
                  !isActive && styles.dotInactive,
                ]}
              />
            );
          })}
        </View>

        {/* Button */}
        <TouchableOpacity onPress={handleNext} activeOpacity={0.85} style={styles.btnWrapper}>
          <LinearGradient
            colors={[slides[currentIndex].color1, slides[currentIndex].color2]}
            style={styles.btn}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
          >
            <Text style={styles.btnText}>
              {currentIndex === slides.length - 1 ? 'Começar Agora' : 'Continuar'}
            </Text>
            <Ionicons
              name={currentIndex === slides.length - 1 ? 'checkmark' : 'arrow-forward'}
              size={20}
              color="#fff"
            />
          </LinearGradient>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  skipBtn: {
    position: 'absolute',
    top: 56,
    right: 24,
    zIndex: 10,
    backgroundColor: 'rgba(255,255,255,0.08)',
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  skipText: {
    color: theme.colors.textMuted,
    fontSize: 14,
    fontWeight: theme.fontWeight.medium,
  },
  slide: {
    width,
    height: height * 0.75,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 32,
    position: 'relative',
  },
  slideGradient: {
    ...StyleSheet.absoluteFillObject,
  },
  iconWrapper: {
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 48,
    position: 'relative',
  },
  outerRing: {
    width: 220,
    height: 220,
    borderRadius: 110,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  innerRing: {
    width: 180,
    height: 180,
    borderRadius: 90,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconBg: {
    width: 150,
    height: 150,
    borderRadius: 75,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emoji: {
    position: 'absolute',
    bottom: -10,
    right: 10,
    fontSize: 36,
  },
  floatBubble: {
    position: 'absolute',
    borderRadius: 999,
  },
  bubble1: {
    width: 80,
    height: 80,
    top: 20,
    left: 20,
  },
  bubble2: {
    width: 50,
    height: 50,
    bottom: 30,
    right: 30,
  },
  textContainer: {
    alignItems: 'center',
  },
  title: {
    color: theme.colors.text,
    fontSize: 36,
    fontWeight: theme.fontWeight.black,
    textAlign: 'center',
    marginBottom: 16,
    lineHeight: 42,
  },
  subtitle: {
    color: theme.colors.textMuted,
    fontSize: 16,
    textAlign: 'center',
    lineHeight: 24,
    maxWidth: 300,
  },
  bottom: {
    paddingHorizontal: 24,
    paddingBottom: 48,
    alignItems: 'center',
    gap: 24,
  },
  dots: {
    flexDirection: 'row',
    gap: 8,
    alignItems: 'center',
  },
  dot: {
    height: 8,
    borderRadius: 4,
    transition: 'width 0.3s',
  },
  dotActive: {
    height: 8,
  },
  dotInactive: {
    width: 8,
    backgroundColor: theme.colors.border,
  },
  btnWrapper: {
    width: '100%',
  },
  btn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    height: 58,
    borderRadius: 29,
    ...theme.shadows.primary,
  },
  btnText: {
    color: theme.colors.text,
    fontSize: 17,
    fontWeight: theme.fontWeight.bold,
  },
});
