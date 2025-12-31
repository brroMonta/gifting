// HistoryCard Component - Display a gift history entry
import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Linking } from 'react-native';
import { GiftHistory } from '../../types/giftHistory';
import { formatDate } from '../../utils/date';
import { theme } from '../../styles/theme';

interface HistoryCardProps {
  history: GiftHistory;
  onPress?: () => void;
}

export const HistoryCard: React.FC<HistoryCardProps> = ({ history, onPress }) => {
  const isGave = history.direction === 'gave';

  const handleLinkPress = () => {
    if (history.link) {
      Linking.openURL(history.link);
    }
  };

  return (
    <TouchableOpacity
      style={styles.card}
      onPress={onPress}
      disabled={!onPress}
    >
      <View style={styles.header}>
        <View style={styles.titleRow}>
          <Text style={styles.emoji}>{isGave ? '🎁' : '🎉'}</Text>
          <View style={styles.titleContent}>
            <Text style={styles.giftName}>{history.giftName}</Text>
            <Text style={styles.personName}>{history.personName}</Text>
          </View>
        </View>
        <View style={[styles.directionBadge, isGave ? styles.gaveBadge : styles.receivedBadge]}>
          <Text style={styles.directionText}>{isGave ? 'Gave' : 'Received'}</Text>
        </View>
      </View>

      <View style={styles.dateRow}>
        <Text style={styles.date}>{formatDate(history.date)}</Text>
      </View>

      {history.notes && (
        <Text style={styles.notes} numberOfLines={2}>
          {history.notes}
        </Text>
      )}

      {history.link && (
        <TouchableOpacity onPress={handleLinkPress}>
          <Text style={styles.link} numberOfLines={1}>
            🔗 {history.link}
          </Text>
        </TouchableOpacity>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: theme.colors.surface,
    borderRadius: theme.borderRadius.xl,
    padding: theme.spacing.lg,
    marginBottom: theme.spacing.md,
    ...theme.shadows.md,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: theme.spacing.md,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  emoji: {
    fontSize: 36,
    marginRight: theme.spacing.md,
  },
  titleContent: {
    flex: 1,
  },
  giftName: {
    fontSize: 17,
    fontWeight: '600',
    color: theme.colors.text.primary,
    marginBottom: 2,
  },
  personName: {
    fontSize: 14,
    color: theme.colors.text.secondary,
    fontWeight: '500',
  },
  directionBadge: {
    paddingHorizontal: theme.spacing.sm,
    paddingVertical: 4,
    borderRadius: theme.borderRadius.lg,
  },
  gaveBadge: {
    backgroundColor: theme.colors.primary[100],
  },
  receivedBadge: {
    backgroundColor: theme.colors.accent[100],
  },
  directionText: {
    fontSize: 12,
    fontWeight: '700',
    color: theme.colors.text.primary,
  },
  dateRow: {
    marginBottom: theme.spacing.sm,
  },
  date: {
    fontSize: 14,
    color: theme.colors.text.secondary,
    fontWeight: '500',
  },
  notes: {
    fontSize: 14,
    color: theme.colors.text.secondary,
    lineHeight: 20,
    marginBottom: theme.spacing.sm,
  },
  link: {
    fontSize: 14,
    color: theme.colors.primary[600],
    textDecorationLine: 'underline',
    fontWeight: '500',
  },
});
