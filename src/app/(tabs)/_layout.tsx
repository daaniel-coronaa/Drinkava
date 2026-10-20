import { MaterialCommunityIcons } from '@expo/vector-icons';
import { router, Tabs } from 'expo-router';
import { useState } from 'react';
import { View } from 'react-native';

import { ActionSheet } from '@/components/ui/ActionSheet';

import { useTranslation } from '@/context/SettingsContext';
import { Fonts, useTheme } from '@/theme';

export default function TabsLayout() {
  const { colors, radius } = useTheme();
  const { t } = useTranslation();
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <>
      <Tabs
        screenOptions={{
          headerShown: false,
          animation: 'fade',
          tabBarActiveTintColor: colors.accentText,
          tabBarInactiveTintColor: colors.textSecondary,
          // DM Sans' default line box is taller than the bar's label slot, which clipped the text.
          tabBarLabelStyle: { fontFamily: Fonts.sansMedium, fontSize: 11, lineHeight: 13 },
          tabBarStyle: { backgroundColor: colors.surface, borderTopColor: colors.border },
        }}
      >
        <Tabs.Screen
          name="parties"
          options={{
            title: t('tabs.parties'),
            tabBarIcon: ({ color, size }) => (
              <MaterialCommunityIcons name="party-popper" size={size} color={color} />
            ),
          }}
        />
        <Tabs.Screen
          name="log"
          options={{
            title: '',
            tabBarIcon: ({ color }) => (
              <View
                style={{
                  width: 48,
                  height: 48,
                  borderRadius: radius.pill,
                  backgroundColor: colors.accentPrimary,
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginBottom: 12,
                }}
              >
                <MaterialCommunityIcons name="plus" size={26} color={colors.onAccent} />
              </View>
            ),
          }}
          listeners={{
            tabPress: (e) => {
              e.preventDefault();
              setMenuOpen(true);
            },
          }}
        />
        <Tabs.Screen
          name="profile"
          options={{
            title: t('tabs.profile'),
            tabBarIcon: ({ color, size }) => <MaterialCommunityIcons name="account" size={size} color={color} />,
          }}
        />
      </Tabs>
      <ActionSheet
        visible={menuOpen}
        onClose={() => setMenuOpen(false)}
        title={t('tabs.createMenuTitle')}
        actions={[
          { key: 'drink', label: t('tabs.addDrink'), icon: 'glass-cocktail', onPress: () => router.push('/drink-log/new') },
          { key: 'party', label: t('tabs.createParty'), icon: 'party-popper', onPress: () => router.push('/party/create') },
        ]}
      />
    </>
  );
}
