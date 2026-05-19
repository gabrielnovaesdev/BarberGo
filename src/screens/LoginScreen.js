import React, { useState } from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity, TextInput,
  KeyboardAvoidingView, Platform, Dimensions, StatusBar
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';
import { Ionicons } from '@expo/vector-icons';
import { theme } from '../theme';
import { useApp } from '../context/AppContext';

const { width, height } = Dimensions.get('window');

export default function LoginScreen({ navigation }) {
  const { login, state } = useApp();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const handleLogin = () => {
    // Simulando login
    login({ email: email || state.user?.email || 'joao.silva@email.com' });
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />
      
      {/* Background Graphic */}
      <View style={styles.bgGraphicTop} />
      <View style={styles.bgGraphicBottom} />

      <KeyboardAvoidingView 
        style={styles.keyboardView}
        behavior={Platform.OS === 'ios' ? 'padding' : null}
      >
        <BlurView intensity={20} tint="dark" style={styles.glassContainer}>
          <View style={styles.header}>
            <LinearGradient colors={[theme.colors.primary, '#FF6B35']} style={styles.logoIcon}>
              <Ionicons name="cut" size={32} color="#fff" />
            </LinearGradient>
            <Text style={styles.title}>BarberGo</Text>
            <Text style={styles.subtitle}>Sua aparência, nossa prioridade.</Text>
          </View>

          <View style={styles.form}>
            <View style={styles.inputGroup}>
              <Ionicons name="mail-outline" size={20} color={theme.colors.textMuted} style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                placeholder="Seu e-mail"
                placeholderTextColor={theme.colors.textDisabled}
                keyboardType="email-address"
                autoCapitalize="none"
                value={email}
                onChangeText={setEmail}
              />
            </View>

            <View style={styles.inputGroup}>
              <Ionicons name="lock-closed-outline" size={20} color={theme.colors.textMuted} style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                placeholder="Sua senha"
                placeholderTextColor={theme.colors.textDisabled}
                secureTextEntry={!showPassword}
                value={password}
                onChangeText={setPassword}
              />
              <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
                <Ionicons 
                  name={showPassword ? "eye-off-outline" : "eye-outline"} 
                  size={20} 
                  color={theme.colors.textMuted} 
                />
              </TouchableOpacity>
            </View>

            <TouchableOpacity style={styles.forgotPassword}>
              <Text style={styles.forgotPasswordText}>Esqueceu a senha?</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.loginBtn} onPress={handleLogin} activeOpacity={0.8}>
              <LinearGradient
                colors={[theme.colors.primary, '#FF6B35']}
                style={styles.loginBtnGradient}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
              >
                <Text style={styles.loginBtnText}>Entrar</Text>
                <Ionicons name="arrow-forward" size={20} color="#fff" />
              </LinearGradient>
            </TouchableOpacity>

            <View style={styles.footer}>
              <Text style={styles.footerText}>Ainda não tem conta?</Text>
              <TouchableOpacity onPress={() => navigation.navigate('Register')}>
                <Text style={styles.footerLink}>Cadastre-se</Text>
              </TouchableOpacity>
            </View>
          </View>
        </BlurView>
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
    justifyContent: 'center',
    alignItems: 'center',
  },
  bgGraphicTop: {
    position: 'absolute',
    top: -height * 0.1,
    left: -width * 0.2,
    width: width,
    height: width,
    borderRadius: width / 2,
    backgroundColor: theme.colors.primaryTransparent,
    opacity: 0.5,
    filter: 'blur(50px)',
  },
  bgGraphicBottom: {
    position: 'absolute',
    bottom: -height * 0.1,
    right: -width * 0.2,
    width: width * 1.2,
    height: width * 1.2,
    borderRadius: width * 0.6,
    backgroundColor: 'rgba(255, 107, 53, 0.1)',
    opacity: 0.4,
    filter: 'blur(60px)',
  },
  keyboardView: {
    width: '100%',
    alignItems: 'center',
  },
  glassContainer: {
    width: '90%',
    padding: 32,
    borderRadius: theme.borderRadius.xl,
    borderWidth: 1,
    borderColor: theme.colors.glassBorder,
    backgroundColor: 'rgba(20, 20, 20, 0.6)',
    overflow: 'hidden',
  },
  header: {
    alignItems: 'center',
    marginBottom: 40,
  },
  logoIcon: {
    width: 64,
    height: 64,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
    shadowColor: theme.colors.primary,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.5,
    shadowRadius: 16,
    elevation: 10,
  },
  title: {
    fontSize: 28,
    fontWeight: theme.fontWeight.black,
    color: theme.colors.text,
    letterSpacing: 1,
  },
  subtitle: {
    fontSize: 14,
    color: theme.colors.textMuted,
    marginTop: 6,
  },
  form: {
    gap: 16,
  },
  inputGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.03)',
    borderWidth: 1,
    borderColor: theme.colors.border,
    borderRadius: theme.borderRadius.lg,
    paddingHorizontal: 16,
    height: 56,
  },
  inputIcon: {
    marginRight: 12,
  },
  input: {
    flex: 1,
    color: theme.colors.text,
    fontSize: 16,
  },
  forgotPassword: {
    alignSelf: 'flex-end',
  },
  forgotPasswordText: {
    color: theme.colors.primary,
    fontSize: 13,
    fontWeight: theme.fontWeight.medium,
  },
  loginBtn: {
    marginTop: 16,
    shadowColor: theme.colors.primary,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 8,
  },
  loginBtnGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    height: 56,
    borderRadius: theme.borderRadius.lg,
    gap: 8,
  },
  loginBtnText: {
    color: '#fff',
    fontSize: 17,
    fontWeight: theme.fontWeight.bold,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 24,
    gap: 6,
  },
  footerText: {
    color: theme.colors.textMuted,
    fontSize: 14,
  },
  footerLink: {
    color: theme.colors.primary,
    fontSize: 14,
    fontWeight: theme.fontWeight.bold,
  },
});
