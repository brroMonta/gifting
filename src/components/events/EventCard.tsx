// EventCard Component - Display a gift event
import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { GiftEvent } from '../../types/giftEvent';
import { formatDate, getDaysUntil } from '../../utils/date';
import { theme } from '../../styles/theme';

interface EventCardProps {
  event: GiftEvent;
  onPress?: () => void;
  onStatusChange?: (status: 'idea' | 'shopping' | 'bought' | 'delivered') => void;
}

export const EventCard: React.FC<EventCardProps> = ({ event, onPress, onStatusChange }) => {
  const daysUntil = getDaysUntil(event.eventDate);
  const isUpcoming = daysUntil >= 0 && daysUntil <= 30;
  const isPast = daysUntil < 0;

  const getStatusColor = () => {
    switch (event.status) {
      case 'idea':
        return '#94a3b8';
      case 'shopping':
        return '#f59e0b';
      case 'bought':
        return '#10b981';
      case 'delivered':
        return '#6366f1';
      default:
        return '#94a3b8';
    }
  };

  const getStatusLabel = () => {
    switch (event.status) {
      case 'idea':
        return 'Idea';
      case 'shopping':
        return 'Shopping';
      case 'bought':
        return 'Bought';
      case 'delivered':
        return 'Delivered';
      default:
        return 'Idea';
    }
  };

  const getEventTypeEmoji = () => {
    switch (event.eventType) {
      case 'birthday':
        return '🎂';
      case 'holiday':
        return '🎄';
      case 'anniversary':
        return '💝';
      case 'custom':
        return '📅';
      default:
        return '🎁';
    }
  };

  return (
    <TouchableOpacity
      style={[styles.card, isPast && styles.pastCard]}
      onPress={onPress}
      disabled={!onPress}
    >
      <View style={styles.header}>
        <View style={styles.titleRow}>
          <Text style={styles.emoji}>{getEventTypeEmoji()}</Text>
          <View style={styles.titleContent}>
            <Text style={styles.personName}>{event.personName}</Text>
            <Text style={styles.eventType}>{event.eventType}</Text>
          </View>
        </View>
        <View style={[styles.statusBadge, { backgroundColor: getStatusColor() }]}>
          <Text style={styles.statusText}>{getStatusLabel()}</Text>
        </View>
      </View>

      <View style={styles.dateRow}>
        <Text style={styles.date}>{formatDate(event.eventDate)}</Text>
        {daysUntil >= 0 && (
          <View style={[styles.daysUntilBadge, isUpcoming && styles.upcomingBadge]}>
            <Text style={[styles.daysUntilText, isUpcoming && styles.upcomingText]}>
              {daysUntil === 0 ? 'Today!' : `${daysUntil}d`}
            </Text>
          </View>
        )}
        {isPast && (
          <View style={styles.pastBadge}>
            <Text style={styles.pastText}>Past</Text>
          </View>
        )}
      </View>

      {event.notes && (
        <Text style={styles.notes} numberOfLines={2}>
          {event.notes}
        </Text>
      )}

      {event.remindersEnabled && (
        <Text style={styles.reminderText}>🔔 Reminders enabled</Text>
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
  pastCard: {
    opacity: 0.6,
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
  personName: {
    fontSize: 17,
    fontWeight: '600',
    color: theme.colors.text.primary,
    marginBottom: 2,
  },
  eventType: {
    fontSize: 14,
    color: theme.colors.text.secondary,
    textTransform: 'capitalize',
    fontWeight: '500',
  },
  statusBadge: {
    paddingHorizontal: theme.spacing.sm,
    paddingVertical: 4,
    borderRadius: theme.borderRadius.lg,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '700',
    color: theme.colors.surface,
  },
  dateRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: theme.spacing.sm,
  },
  date: {
    fontSize: 14,
    color: theme.colors.text.secondary,
    fontWeight: '500',
  },
  daysUntilBadge: {
    backgroundColor: theme.colors.neutral[100],
    paddingHorizontal: theme.spacing.sm,
    paddingVertical: 4,
    borderRadius: theme.borderRadius.md,
  },
  upcomingBadge: {
    backgroundColor: theme.colors.accent[100],
  },
  daysUntilText: {
    fontSize: 12,
    fontWeight: '700',
    color: theme.colors.text.secondary,
  },
  upcomingText: {
    color: theme.colors.accent[600],
  },
  pastBadge: {
    backgroundColor: theme.colors.neutral[100],
    paddingHorizontal: theme.spacing.sm,
    paddingVertical: 4,
    borderRadius: theme.borderRadius.md,
  },
  pastText: {
    fontSize: 12,
    fontWeight: '600',
    color: theme.colors.text.secondary,
  },
  notes: {
    fontSize: 14,
    color: theme.colors.text.secondary,
    lineHeight: 20,
    marginBottom: theme.spacing.sm,
  },
  reminderText: {
    fontSize: 12,
    color: theme.colors.primary[600],
    fontWeight: '500',
  },
});
