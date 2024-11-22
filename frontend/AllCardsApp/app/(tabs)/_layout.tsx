import { Tabs } from 'expo-router';
import React from 'react';
import { Button } from 'react-native';

import { HapticTab } from '@/components/HapticTab';
import { IconSymbol } from '@/components/ui/IconSymbol';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';

export default function TabLayout() {
  const colorScheme = useColorScheme();

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Colors.mainTheme,//Colors[colorScheme ?? 'light'].tint,
        headerShown: true,
        headerRight: () => <Button title='+'/>,
        headerStyle:{
          backgroundColor: Colors.mainTheme
        },
        headerTintColor: "#FFFFFF",
        headerTitle: "",
        tabBarButton: HapticTab
      }}>
      <Tabs.Screen
        name="cards"
        options={{
          title: 'Cards',
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
