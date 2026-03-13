import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Colors, Typography, Spacing, Radius } from '../constants/theme';

type BadgeVariant = 'live' | 'finished' | 'scheduled' | 'hot' | 'warm' | 'cold';

const VARIANT_MAP: Record<BadgeVariant, { bg: string; text: string; label?: string }> = {
  live: { bg: Colors.loss + '25', text: Colors.loss, label: '● LIVE' },
  finished: { bg: Colors.textMuted + '25', text: Colors.textSecondary },
  scheduled: { bg: Colors.accentBlue + '20', text: Colors.accentBlue },
  hot: { bg: Colors.win + '20', text: Colors.win, label: '🔥 Hot' },
  warm: { bg: Colors.draw + '20', text: Colors.draw, label: '~ Warm' },
  cold: { bg: Colors.accentBlue + '15', text: Colors.textSecondary, label: '❄ Cold' },
};

interface StatusBadgeProps {
  variant: BadgeVariant;
  label?: string;
}

export function StatusBadge({ variant, label }: StatusBadgeProps) {
  const config = VARIANT_MAP[variant];
  const displayLabel = label ?? config.label ?? variant.toUpperCase();

  return (
    <View style={[styles.badge, { backgroundColor: config.bg }]}>
      <Text style={[styles.text, { color: config.text }]}>{displayLabel}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    paddingHorizontal: Spacing.sm,
    paddingVertical: 3,
    borderRadius: Radius.sm,
  },
  text: {
    fontSize: Typography.xs,
    fontWeight: Typography.bold,
    letterSpacing: Typography.wide,
  },
});
