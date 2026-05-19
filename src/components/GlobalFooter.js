import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { theme } from '../theme';

export default function GlobalFooter() {
  const handleSupport = () => {
    Alert.alert('Suporte', 'Entre em contato com suporte@barbergo.app');
  };

  const handleContact = () => {
    Alert.alert('Contato', 'Nosso WhatsApp é (11) 99999-9999');
  };

  return (
    <View style={styles.container}>
      <View style={styles.linksContainer}>
        <TouchableOpacity onPress={handleSupport}>
          <Text style={styles.linkText}>Suporte</Text>
        </TouchableOpacity>
        <Text style={styles.separator}>•</Text>
        <TouchableOpacity onPress={handleContact}>
          <Text style={styles.linkText}>Contato</Text>
        </TouchableOpacity>
        <Text style={styles.separator}>•</Text>
        <TouchableOpacity onPress={() => Alert.alert('Termos', 'Termos e Privacidade')}>
          <Text style={styles.linkText}>Termos</Text>
        </TouchableOpacity>
      </View>
      <Text style={styles.credits}>Desenvolvido por Novaes</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingVertical: 24,
    paddingHorizontal: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 10,
    marginBottom: 30,
  },
  linksContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  linkText: {
    color: theme.colors.textMuted,
    fontSize: 13,
    fontWeight: theme.fontWeight.medium,
  },
  separator: {
    color: theme.colors.textDisabled,
    marginHorizontal: 10,
    fontSize: 13,
  },
  credits: {
    color: theme.colors.textDisabled,
    fontSize: 12,
    fontWeight: 'bold',
    letterSpacing: 0.5,
  }
});
