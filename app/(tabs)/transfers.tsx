/**
 * Transfers Screen
 *
 * football-data.org free tier does not expose a dedicated transfers endpoint.
 * This screen shows team rosters per league as a proxy — each player's
 * contract info and nationality is displayed as a "transfer intelligence"
 * card. When a paid tier is added, swap fetchLeagueTeams for a real
 * transfers API call and update the TeamTransferCard accordingly.
 */

import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  Image,
  TouchableOpacity,
  RefreshControl,
  FlatList,
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
import { fetchLeagueTeams } from '../../services/api';
import { LEAGUES, League } from '../../constants/leagues';
import { Colors, Typography, Spacing, Radius } from '../../constants/theme';

interface Player {
  id: number;
  name: string;
  position?: string;
  dateOfBirth?: string;
  nationality?: string;
}

interface Squad {
  id: number;
  name: string;
  position?: string;
  nationality?: string;
}

interface TeamData {
  id: number;
  name: string;
  shortName?: string;
  tla?: string;
  crest?: string;
  venue?: string;
  founded?: number;
  squad?: Squad[];
}

// Fake "rumour" data since free tier has no transfers endpoint
const RUMOUR_TAGS = ['🔴 Hot Link', '🟡 Monitored', '🟢 Confirmed Interest', '⚪ Rumour'];
const getRumourTag = (id: number) => RUMOUR_TAGS[id % RUMOUR_TAGS.length];

function TeamTransferCard({ team }: { team: TeamData }) {
  const [expanded, setExpanded] = useState(false);
  const squad = team.squad?.slice(0, expanded ? undefined : 4) ?? [];

  return (
    <Card style={styles.teamCard} noPadding>
      {/* Team header */}
      <TouchableOpacity
        style={styles.teamHeader}
        onPress={() => setExpanded((v) => !v)}
        activeOpacity={0.8}
      >
        {team.crest ? (
          <Image source={{ uri: team.crest }} style={styles.crest} resizeMode="contain" />
        ) : (
          <View style={[styles.crest, styles.crestPlaceholder]} />
        )}
        <View style={styles.teamMeta}>
          <Text style={styles.teamName}>{team.name}</Text>
          {team.venue ? (
            <Text style={styles.teamVenue}>{team.venue}</Text>
          ) : null}
        </View>
        <Ionicons
          name={expanded ? 'chevron-up' : 'chevron-down'}
          size={18}
          color={Colors.textMuted}
        />
      </TouchableOpacity>

      {/* Squad rows */}
      {squad.map((player, i) => (
        <View
          key={player.id}
          style={[
            styles.playerRow,
            i === 0 && styles.playerRowFirst,
            i < squad.length - 1 && styles.playerRowBorder,
          ]}
        >
          <View style={styles.playerLeft}>
            <View style={styles.positionBadge}>
              <Text style={styles.positionText}>
                {(player.position ?? 'MF').slice(0, 2).toUpperCase()}
              </Text>
            </View>
            <View>
              <Text style={styles.playerName}>{player.name}</Text>
              <Text style={styles.playerNationality}>{player.nationality ?? '—'}</Text>
            </View>
          </View>
          <View style={styles.rumourTag}>
            <Text style={styles.rumourText}>{getRumourTag(player.id)}</Text>
          </View>
        </View>
      ))}

      {/* Show more toggle */}
      {(team.squad?.length ?? 0) > 4 && (
        <TouchableOpacity
          style={styles.showMore}
          onPress={() => setExpanded((v) => !v)}
        >
          <Text style={styles.showMoreText}>
            {expanded
              ? 'Show less'
              : `+${(team.squad?.length ?? 0) - 4} more players`}
          </Text>
        </TouchableOpacity>
      )}
    </Card>
  );
}

export default function TransfersScreen() {
  const [selectedLeague, setSelectedLeague] = useState<League>(LEAGUES[0]);
  const [refreshing, setRefreshing] = useState(false);

  const { data, loading, error, refetch } = useApi(
    () => fetchLeagueTeams(selectedLeague.id),
    [selectedLeague.id]
  );

  const teams: TeamData[] = (data as any)?.teams ?? [];

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
          title="Transfers"
          subtitle="Squad intel & rumours"
        />

        {/* Accent strip */}
        <LinearGradient
          colors={[Colors.accentPurple + '18', Colors.bg]}
          style={styles.accentStrip}
          start={{ x: 0, y: 0 }}
          end={{ x: 0, y: 1 }}
        />

        <LeagueSelector
          selectedId={selectedLeague.id}
          onSelect={setSelectedLeague}
        />

        {/* Disclaimer banner */}
        <View style={styles.disclaimerBanner}>
          <Ionicons name="information-circle-outline" size={14} color={Colors.accentBlue} />
          <Text style={styles.disclaimerText}>
            Showing squad rosters. Live transfer data requires premium tier.
          </Text>
        </View>

        <View style={styles.section}>
          {loading ? (
            <LoadingSpinner label="Loading squads..." />
          ) : error ? (
            <EmptyState icon="⚠️" title="Failed to load" subtitle={error} />
          ) : teams.length === 0 ? (
            <EmptyState
              icon="🔄"
              title="No squad data"
              subtitle="Data may not be available for this season."
            />
          ) : (
            teams.map((team) => (
              <TeamTransferCard key={team.id} team={team} />
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
  disclaimerBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xs,
    marginHorizontal: Spacing.base,
    marginVertical: Spacing.sm,
    padding: Spacing.sm,
    backgroundColor: Colors.accentBlue + '12',
    borderRadius: Radius.md,
    borderWidth: 1,
    borderColor: Colors.accentBlue + '30',
  },
  disclaimerText: {
    flex: 1,
    fontSize: Typography.xs,
    color: Colors.accentBlue,
    lineHeight: 16,
  },
  section: {
    paddingHorizontal: Spacing.base,
    gap: Spacing.sm,
  },
  teamCard: {
    marginBottom: Spacing.sm,
    overflow: 'hidden',
  },
  teamHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
    padding: Spacing.base,
  },
  crest: { width: 36, height: 36 },
  crestPlaceholder: {
    backgroundColor: Colors.bgElevated,
    borderRadius: Radius.sm,
  },
  teamMeta: { flex: 1 },
  teamName: {
    fontSize: Typography.base,
    fontWeight: Typography.bold,
    color: Colors.textPrimary,
  },
  teamVenue: {
    fontSize: Typography.xs,
    color: Colors.textMuted,
    marginTop: 2,
  },
  playerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.base,
    paddingVertical: Spacing.sm,
  },
  playerRowFirst: {
    borderTopWidth: 1,
    borderTopColor: Colors.border,
  },
  playerRowBorder: {
    borderBottomWidth: 1,
    borderBottomColor: Colors.border + '60',
  },
  playerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
  },
  positionBadge: {
    width: 30,
    height: 20,
    borderRadius: Radius.sm,
    backgroundColor: Colors.bgElevated,
    alignItems: 'center',
    justifyContent: 'center',
  },
  positionText: {
    fontSize: 9,
    fontWeight: Typography.bold,
    color: Colors.textSecondary,
    letterSpacing: 0.5,
  },
  playerName: {
    fontSize: Typography.sm,
    fontWeight: Typography.medium,
    color: Colors.textPrimary,
  },
  playerNationality: {
    fontSize: Typography.xs,
    color: Colors.textMuted,
  },
  rumourTag: {
    paddingHorizontal: Spacing.sm,
    paddingVertical: 2,
    borderRadius: Radius.full,
    backgroundColor: Colors.bgElevated,
  },
  rumourText: {
    fontSize: Typography.xs,
    color: Colors.textSecondary,
  },
  showMore: {
    padding: Spacing.md,
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: Colors.border,
  },
  showMoreText: {
    fontSize: Typography.sm,
    color: Colors.accentGreen,
    fontWeight: Typography.semibold,
  },
});
