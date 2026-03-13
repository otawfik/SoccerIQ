import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  Image,
  TouchableOpacity,
  RefreshControl,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { Card } from '../../components/Card';
import { LeagueSelector } from '../../components/LeagueSelector';
import { ScreenHeader } from '../../components/ScreenHeader';
import { StatusBadge } from '../../components/StatusBadge';
import { LoadingSpinner } from '../../components/LoadingSpinner';
import { EmptyState } from '../../components/EmptyState';
import { useApi } from '../../hooks/useApi';
import { fetchPredictions, PredictionEntry } from '../../services/api';
import { LEAGUES, League } from '../../constants/leagues';
import { Colors, Typography, Spacing, Radius } from '../../constants/theme';

function FormBar({ score }: { score: number }) {
  const pct = Math.min(Math.max(score, 0), 1);
  const barColor =
    pct > 0.6 ? Colors.win : pct > 0.35 ? Colors.draw : Colors.accentBlue;

  return (
    <View style={styles.formBarBg}>
      <LinearGradient
        colors={[barColor, barColor + '60']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
        style={[styles.formBarFill, { width: `${Math.round(pct * 100)}%` }]}
      />
    </View>
  );
}

function FormPip({ result }: { result: string }) {
  const bg =
    result === 'W' ? Colors.win : result === 'L' ? Colors.loss : Colors.draw;
  return <View style={[styles.formPip, { backgroundColor: bg }]} />;
}

function PredictionCard({
  entry,
  rank,
}: {
  entry: PredictionEntry;
  rank: number;
}) {
  const labelVariant: 'hot' | 'warm' | 'cold' =
    entry.formLabel === 'Hot'
      ? 'hot'
      : entry.formLabel === 'Warm'
      ? 'warm'
      : 'cold';

  const form = entry.form
    ? entry.form.split(',').join('').split('').slice(-5)
    : [];

  return (
    <Card
      gradient
      gradientColors={
        rank === 1
          ? [Colors.accentGreen + '18', Colors.bgCard]
          : [Colors.bgCard, Colors.bgElevated]
      }
      style={styles.predCard}
    >
      {/* Header row */}
      <View style={styles.predHeader}>
        <View style={styles.rankCircle}>
          <Text style={styles.rankNum}>{rank}</Text>
        </View>

        {entry.team.crestUrl ? (
          <Image
            source={{ uri: entry.team.crestUrl }}
            style={styles.crest}
            resizeMode="contain"
          />
        ) : (
          <View style={[styles.crest, styles.crestPlaceholder]} />
        )}

        <View style={styles.teamInfo}>
          <Text style={styles.teamName} numberOfLines={1}>
            {entry.team.name}
          </Text>
          <Text style={styles.leaguePosition}>#{entry.position} in table · {entry.points} pts</Text>
        </View>

        <StatusBadge variant={labelVariant} />
      </View>

      {/* Form pips */}
      {form.length > 0 && (
        <View style={styles.formPipsRow}>
          <Text style={styles.formPipsLabel}>Last 5</Text>
          <View style={styles.formPips}>
            {form.map((r, i) => (
              <FormPip key={i} result={r} />
            ))}
          </View>
        </View>
      )}

      {/* Form confidence bar */}
      <View style={styles.barSection}>
        <View style={styles.barLabelRow}>
          <Text style={styles.barLabel}>Form Confidence</Text>
          <Text style={styles.barPct}>{Math.round(entry.formScore * 100)}%</Text>
        </View>
        <FormBar score={entry.formScore} />
      </View>

      {/* W / D / L mini stats */}
      <View style={styles.wdlRow}>
        <View style={styles.wdlItem}>
          <Text style={[styles.wdlVal, { color: Colors.win }]}>{entry.won}</Text>
          <Text style={styles.wdlLabel}>W</Text>
        </View>
        <View style={styles.wdlItem}>
          <Text style={[styles.wdlVal, { color: Colors.draw }]}>{entry.draw}</Text>
          <Text style={styles.wdlLabel}>D</Text>
        </View>
        <View style={styles.wdlItem}>
          <Text style={[styles.wdlVal, { color: Colors.loss }]}>{entry.lost}</Text>
          <Text style={styles.wdlLabel}>L</Text>
        </View>
        <View style={[styles.wdlItem, styles.wdlGd]}>
          <Text
            style={[
              styles.wdlVal,
              {
                color:
                  entry.goalDifference > 0
                    ? Colors.win
                    : entry.goalDifference < 0
                    ? Colors.loss
                    : Colors.textSecondary,
              },
            ]}
          >
            {entry.goalDifference > 0 ? '+' : ''}
            {entry.goalDifference}
          </Text>
          <Text style={styles.wdlLabel}>GD</Text>
        </View>
      </View>
    </Card>
  );
}

// ---------------------------------------------------------------------------

export default function PredictionsScreen() {
  const [selectedLeague, setSelectedLeague] = useState<League>(LEAGUES[0]);
  const [refreshing, setRefreshing] = useState(false);

  const { data, loading, error, refetch } = useApi(
    () => fetchPredictions(selectedLeague.id),
    [selectedLeague.id]
  );

  const predictions: PredictionEntry[] = (data as any)?.predictions ?? [];

  const onRefresh = async () => {
    setRefreshing(true);
    await refetch();
    setRefreshing(false);
  };

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <ScrollView
        style={styles.scroll}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor={Colors.accentGreen}
            colors={[Colors.accentGreen]}
          />
        }
      >
        <ScreenHeader
          title="Predictions"
          subtitle="AI form analysis · Top 5 leagues"
        />

        {/* Accent strip */}
        <LinearGradient
          colors={[Colors.accentPurple + '20', Colors.bg]}
          style={styles.accentStrip}
          start={{ x: 0, y: 0 }}
          end={{ x: 0, y: 1 }}
        />

        <LeagueSelector
          selectedId={selectedLeague.id}
          onSelect={setSelectedLeague}
        />

        {/* Explainer card */}
        <View style={styles.explainerWrap}>
          <Card
            gradient
            gradientColors={[Colors.accentPurple + '25', Colors.bgCard]}
            style={styles.explainerCard}
          >
            <View style={styles.explainerRow}>
              <Text style={styles.explainerIcon}>🧠</Text>
              <View style={styles.explainerText}>
                <Text style={styles.explainerTitle}>How predictions work</Text>
                <Text style={styles.explainerBody}>
                  Teams are ranked by recent form (last 5 games), goal
                  difference, and points. Hot teams are on 3+ wins in 5.
                </Text>
              </View>
            </View>
          </Card>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>
            {selectedLeague.flag} {selectedLeague.name} — Form Rankings
          </Text>

          {loading ? (
            <LoadingSpinner label="Crunching form data..." />
          ) : error ? (
            <EmptyState icon="⚠️" title="Failed to load" subtitle={error} />
          ) : predictions.length === 0 ? (
            <EmptyState
              icon="📊"
              title="No prediction data"
              subtitle="Try pulling down to refresh or pick a different league."
            />
          ) : (
            predictions.map((entry, i) => (
              <PredictionCard key={entry.team.id} entry={entry} rank={i + 1} />
            ))
          )}
        </View>

        <View style={{ height: 100 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: Colors.bg },
  scroll: { flex: 1, backgroundColor: Colors.bg },
  accentStrip: {
    height: 6,
    marginHorizontal: Spacing.base,
    borderRadius: Radius.full,
    marginBottom: Spacing.sm,
  },
  explainerWrap: {
    paddingHorizontal: Spacing.base,
    marginBottom: Spacing.sm,
  },
  explainerCard: {
    padding: Spacing.md,
  },
  explainerRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: Spacing.md,
  },
  explainerIcon: { fontSize: 24 },
  explainerText: { flex: 1 },
  explainerTitle: {
    fontSize: Typography.sm,
    fontWeight: Typography.bold,
    color: Colors.textPrimary,
    marginBottom: 4,
  },
  explainerBody: {
    fontSize: Typography.xs,
    color: Colors.textSecondary,
    lineHeight: 18,
  },
  section: {
    paddingHorizontal: Spacing.base,
    gap: Spacing.sm,
  },
  sectionTitle: {
    fontSize: Typography.md,
    fontWeight: Typography.bold,
    color: Colors.textPrimary,
    letterSpacing: Typography.tight,
    marginBottom: Spacing.xs,
  },
  predCard: {
    gap: Spacing.md,
    marginBottom: Spacing.sm,
  },
  predHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
  },
  rankCircle: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: Colors.bgElevated,
    borderWidth: 1,
    borderColor: Colors.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  rankNum: {
    fontSize: Typography.sm,
    fontWeight: Typography.bold,
    color: Colors.textSecondary,
  },
  crest: { width: 34, height: 34 },
  crestPlaceholder: {
    backgroundColor: Colors.bgElevated,
    borderRadius: Radius.sm,
  },
  teamInfo: { flex: 1 },
  teamName: {
    fontSize: Typography.base,
    fontWeight: Typography.bold,
    color: Colors.textPrimary,
  },
  leaguePosition: {
    fontSize: Typography.xs,
    color: Colors.textMuted,
    marginTop: 2,
  },
  formPipsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
  },
  formPipsLabel: {
    fontSize: Typography.xs,
    color: Colors.textMuted,
    width: 38,
  },
  formPips: {
    flexDirection: 'row',
    gap: 5,
  },
  formPip: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  barSection: {
    gap: Spacing.xs,
  },
  barLabelRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  barLabel: {
    fontSize: Typography.xs,
    color: Colors.textMuted,
    textTransform: 'uppercase',
    letterSpacing: Typography.wide,
  },
  barPct: {
    fontSize: Typography.xs,
    fontWeight: Typography.bold,
    color: Colors.textSecondary,
  },
  formBarBg: {
    height: 6,
    backgroundColor: Colors.bgElevated,
    borderRadius: Radius.full,
    overflow: 'hidden',
  },
  formBarFill: {
    height: '100%',
    borderRadius: Radius.full,
  },
  wdlRow: {
    flexDirection: 'row',
    borderTopWidth: 1,
    borderTopColor: Colors.border,
    paddingTop: Spacing.md,
    gap: Spacing.base,
  },
  wdlItem: {
    alignItems: 'center',
    flex: 1,
  },
  wdlGd: {
    flex: 1.2,
  },
  wdlVal: {
    fontSize: Typography.lg,
    fontWeight: Typography.black,
  },
  wdlLabel: {
    fontSize: Typography.xs,
    color: Colors.textMuted,
    letterSpacing: Typography.wider,
    textTransform: 'uppercase',
    marginTop: 2,
  },
});
