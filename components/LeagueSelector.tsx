import React from 'react';
import {
  ScrollView,
  TouchableOpacity,
  Text,
  StyleSheet,
  View,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { LEAGUES, League } from '../constants/leagues';
import { Colors, Typography, Spacing, Radius } from '../constants/theme';

interface LeagueSelectorProps {
  selectedId: number;
  onSelect: (league: League) => void;
}

export function LeagueSelector({ selectedId, onSelect }: LeagueSelectorProps) {
  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.container}
    >
      {LEAGUES.map((league) => {
        const isSelected = league.id === selectedId;
        return (
          <TouchableOpacity
            key={league.id}
            onPress={() => onSelect(league)}
            activeOpacity={0.75}
            style={styles.pillWrapper}
          >
            {isSelected ? (
              <LinearGradient
                colors={[Colors.accentGreen + '30', Colors.accentBlue + '20']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={[styles.pill, styles.pillActive]}
              >
                <Text style={styles.flag}>{league.flag}</Text>
                <Text style={[styles.label, styles.labelActive]}>
                  {league.shortName}
                </Text>
              </LinearGradient>
            ) : (
              <View style={[styles.pill, styles.pillInactive]}>
                <Text style={styles.flag}>{league.flag}</Text>
                <Text style={[styles.label, styles.labelInactive]}>
                  {league.shortName}
                </Text>
              </View>
            )}
          </TouchableOpacity>
        );
      })}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: Spacing.base,
    paddingVertical: Spacing.sm,
    gap: Spacing.sm,
    flexDirection: 'row',
  },
  pillWrapper: {
    marginRight: Spacing.sm,
  },
  pill: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.xs + 2,
    borderRadius: Radius.full,
    gap: Spacing.xs,
  },
  pillActive: {
    borderWidth: 1,
    borderColor: Colors.accentGreen + '60',
  },
  pillInactive: {
    backgroundColor: Colors.bgElevated,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  flag: {
    fontSize: 14,
  },
  label: {
    fontSize: Typography.sm,
    fontWeight: Typography.semibold,
    letterSpacing: Typography.wide,
  },
  labelActive: {
    color: Colors.accentGreen,
  },
  labelInactive: {
    color: Colors.textSecondary,
  },
});
