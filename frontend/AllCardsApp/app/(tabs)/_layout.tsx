import { Tabs } from 'expo-router';
import React from 'react';
import { HapticTab } from '@/components/HapticTab';
import { IconSymbol } from '@/components/ui/IconSymbol';
import { Colors } from '@/constants/Colors';

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Colors.mainTheme,
        headerShown: true,
        headerStyle:{
          backgroundColor: Colors.mainTheme
        },
        headerTintColor: "#FFFFFF",
        tabBarButton: HapticTab
      }}>
      <Tabs.Screen
        name="cards"
        options={{
          title: 'My Cards',
          tabBarIcon: ({ color }) => <IconSymbol size={28} name="cards.fill" color={color} />,
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          title: 'Settings',
          tabBarIcon: ({ color }) => <IconSymbol size={28} name="settings.fill" color={color} />,
        }}
      />
    </Tabs>
  );
}
