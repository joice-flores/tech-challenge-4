import { colors } from './colors';

export const tabBarOptions = {
  tabBarStyle: {
    backgroundColor: colors.surface,
    borderTopColor: colors.border,
    borderTopWidth: 1,
    height: 80,
    paddingBottom: 10,
    paddingTop: 10,
  },
  tabBarActiveTintColor: colors.accent,
  tabBarInactiveTintColor: colors.textMuted,
  tabBarLabelStyle: {
    fontSize: 10,
    fontWeight: '600' as const,
    letterSpacing: 0.5,
    textTransform: 'uppercase' as const,
  },
} as const;

export const stackScreenOptions = {
  headerStyle: {
    backgroundColor: colors.surface,
  },
  headerTintColor: colors.textPrimary,
  headerTitleStyle: {
    fontSize: 14,
    fontWeight: '700' as const,
    letterSpacing: 1,
    textTransform: 'uppercase' as const,
    color: colors.accent,
  },
  headerShadowVisible: false,
  contentStyle: {
    backgroundColor: colors.textPrimary,
  },
} as const;
