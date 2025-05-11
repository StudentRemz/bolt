import React from 'react';
import { Tabs } from 'expo-router';
import { Bell, Chrome as Home, Plus, Settings, User } from 'lucide-react-native';
import { COLORS } from '@/constants/Colors';
import { Platform } from 'react-native';
import { useAuth } from '@/context/AuthContext';

function TabLayout() {
  const { user } = useAuth();

  // Redirect to auth if no user is logged in
  if (!user) {
    return null;
  }

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: COLORS.primary,
        tabBarInactiveTintColor: COLORS.textSecondary,
        tabBarStyle: {
          backgroundColor: COLORS.cardBackground,
          borderTopColor: COLORS.border,
          height: Platform.OS === 'ios' ? 90 : 70,
          paddingBottom: Platform.OS === 'ios' ? 30 : 10,
          paddingTop: 10,
        },
        tabBarLabelStyle: {
          fontFamily: 'Inter-Regular',
          fontSize: 12,
        },
        headerStyle: {
          backgroundColor: COLORS.cardBackground,
          borderBottomColor: COLORS.border,
          borderBottomWidth: 1,
        },
        headerTitleStyle: {
          fontFamily: 'Inter-SemiBold',
          color: COLORS.text,
        },
        headerTintColor: COLORS.text,
      }}>
      <Tabs.Screen
        name="index"
        options={{
          title: 'Ana Sayfa',
          tabBarIcon: ({ color, size }) => <Home size={size} color={color} />,
          headerTitle: 'Motivation Insults',
        }}
      />
      <Tabs.Screen
        name="notifications"
        options={{
          title: 'Bildirimler',
          tabBarIcon: ({ color, size }) => <Bell size={size} color={color} />,
          headerTitle: 'Bildirim Ayarları',
        }}
      />
      <Tabs.Screen
        name="add-insult"
        options={{
          title: 'Ekle',
          tabBarIcon: ({ color, size }) => <Plus size={size} color={color} />,
          headerTitle: 'Hakaret Ekle',
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Profil',
          tabBarIcon: ({ color, size }) => <User size={size} color={color} />,
          headerTitle: 'Profilim',
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          title: 'Ayarlar',
          tabBarIcon: ({ color, size }) => <Settings size={size} color={color} />,
          headerTitle: 'Ayarlar',
        }}
      />
    </Tabs>
  );
}

export default TabLayout;