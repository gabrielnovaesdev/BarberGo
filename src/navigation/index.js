import React from 'react';
import { View, Text, StyleSheet, Platform } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { theme } from '../theme';

import SplashScreen from '../screens/SplashScreen';
import OnboardingScreen from '../screens/OnboardingScreen';
import HomeScreen from '../screens/HomeScreen';
import BarbersListScreen from '../screens/BarbersListScreen';
import BarberProfileScreen from '../screens/BarberProfileScreen';
import BookingScreen from '../screens/BookingScreen';
import AppointmentsScreen from '../screens/AppointmentsScreen';
import ProfileScreen from '../screens/ProfileScreen';
import LoginScreen from '../screens/LoginScreen';
import RegisterScreen from '../screens/RegisterScreen';
import { useApp } from '../context/AppContext';

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

const TabIcon = ({ name, focused, label, badge }) => (
  <View style={tabStyles.iconWrapper}>
    {focused ? (
      <LinearGradient
        colors={[theme.colors.primary, '#FF6B35']}
        style={tabStyles.iconBg}
      >
        <Ionicons name={name} size={22} color="#000" />
      </LinearGradient>
    ) : (
      <View style={tabStyles.iconBgInactive}>
        <Ionicons name={`${name}-outline`} size={22} color={theme.colors.textMuted} />
      </View>
    )}
    {badge && badge > 0 && (
      <View style={tabStyles.badge}>
        <Text style={tabStyles.badgeText}>{badge}</Text>
      </View>
    )}
  </View>
);

function MainTabs() {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarStyle: tabStyles.tabBar,
        tabBarShowLabel: true,
        tabBarLabelStyle: tabStyles.tabLabel,
        tabBarActiveTintColor: theme.colors.primary,
        tabBarInactiveTintColor: theme.colors.textMuted,
        tabBarBackground: () => (
          <View style={{ flex: 1, backgroundColor: theme.colors.surface, borderTopColor: theme.colors.border, borderTopWidth: 1 }} />
        ),
      }}
    >
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        options={{
          tabBarLabel: 'Início',
          tabBarIcon: ({ focused }) => <TabIcon name="home" focused={focused} />,
        }}
      />
      <Tab.Screen
        name="BarbersList"
        component={BarbersListScreen}
        options={{
          tabBarLabel: 'Barbeiros',
          tabBarIcon: ({ focused }) => <TabIcon name="cut" focused={focused} />,
        }}
      />
      <Tab.Screen
        name="Appointments"
        component={AppointmentsScreen}
        options={{
          tabBarLabel: 'Agenda',
          tabBarIcon: ({ focused }) => <TabIcon name="calendar" focused={focused} />,
        }}
      />
      <Tab.Screen
        name="Profile"
        component={ProfileScreen}
        options={{
          tabBarLabel: 'Perfil',
          tabBarIcon: ({ focused }) => <TabIcon name="person" focused={focused} />,
        }}
      />
    </Tab.Navigator>
  );
}

const tabStyles = StyleSheet.create({
  tabBar: {
    position: 'absolute',
    borderTopWidth: 1,
    borderTopColor: theme.colors.border,
    height: 84,
    paddingBottom: 24,
    paddingTop: 8,
    backgroundColor: theme.colors.surface,
    elevation: 0,
  },
  tabLabel: {
    fontSize: 11,
    fontWeight: '600',
    marginTop: 4,
  },
  iconWrapper: {
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconBg: {
    width: 44,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconBgInactive: {
    width: 44,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  badge: {
    position: 'absolute',
    top: -4,
    right: -4,
    backgroundColor: '#FF453A',
    borderRadius: 8,
    width: 16,
    height: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  badgeText: {
    color: '#fff',
    fontSize: 9,
    fontWeight: '800',
  },
});

export default function Navigation() {
  const { state } = useApp();

  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{ headerShown: false, animation: 'fade' }}
      >
        {!state.isAuthenticated ? (
          <>
            <Stack.Screen name="Splash" component={SplashScreen} />
            <Stack.Screen name="Onboarding" component={OnboardingScreen} />
            <Stack.Screen name="Login" component={LoginScreen} />
            <Stack.Screen 
              name="Register" 
              component={RegisterScreen} 
              options={{ animation: 'slide_from_right' }} 
            />
          </>
        ) : (
          <>
            <Stack.Screen name="Main" component={MainTabs} />
            <Stack.Screen
              name="BarberProfile"
              component={BarberProfileScreen}
              options={{ animation: 'slide_from_right' }}
            />
            <Stack.Screen
              name="Booking"
              component={BookingScreen}
              options={{ animation: 'slide_from_bottom' }}
            />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}
