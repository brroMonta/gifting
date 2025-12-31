// PersonCard Component - Display person in a list
import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Person } from '../../types/person';
import { formatBirthday, getDaysUntil, createBirthdayDate } from '../../utils/date';
import { theme } from '../../styles/theme';

interface PersonCardProps {
  person: Person;
  onPress: () => void;
}

export const PersonCard: React.FC<PersonCardProps> = ({ person, onPress }) => {
  const hasBirthday = person.birthdayMonth && person.birthdayDay;

  let birthdayInfo = '';
  let daysUntil = 0;

  if (hasBirthday) {
    birthdayInfo = formatBirthday(person.birthdayMonth!, person.birthdayDay!, person.birthdayYear);
    const birthdayDate = createBirthdayDate(person.birthdayMonth!, person.birthdayDay!, person.birthdayYear);
    daysUntil = getDaysUntil(birthdayDate);
  }

  return (
    <TouchableOpacity
      style={styles.card}
      onPress={onPress}
      activeOpacity={0.7}
    >
      <View style={styles.content}>
        <View style={styles.header}>
          <Text style={styles.name}>{person.name}</Text>
          {daysUntil > 0 && daysUntil <= 30 && (
            <View style={styles.badge}>
              <Text style={styles.badgeText}>{daysUntil}d</Text>
            </View>
          )}
        </View>

        {person.relationship && (
          <Text style={styles.relationship}>{person.relationship}</Text>
        )}

        {hasBirthday && (
          <Text style={styles.birthday}>🎂 {birthdayInfo}</Text>
        )}

        {person.notes && (
          <Text style={styles.notes} numberOfLines={2}>
            {person.notes}
          </Text>
        )}
      </View>

      <View style={styles.chevron}>
        <Text style={styles.chevronIcon}>›</Text>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: theme.colors.surface,
    borderRadius: theme.borderRadius.xl,
    padding: theme.spacing.lg,
    marginBottom: theme.spacing.md,
    flexDirection: 'row',
    alignItems: 'center',
    ...theme.shadows.md,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  content: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  name: {
    fontSize: 18,
    fontWeight: '600',
    color: theme.colors.text.primary,
    flex: 1,
  },
  badge: {
    backgroundColor: theme.colors.accent[50],
    borderRadius: theme.borderRadius.lg,
    paddingHorizontal: theme.spacing.sm,
    paddingVertical: 4,
  },
  badgeText: {
    fontSize: 12,
    fontWeight: '700',
    color: theme.colors.accent[600],
  },
  relationship: {
    fontSize: 14,
    color: theme.colors.text.secondary,
    marginBottom: 4,
  },
  birthday: {
    fontSize: 14,
    color: theme.colors.primary[600],
    marginBottom: 4,
    fontWeight: '500',
  },
  notes: {
    fontSize: 12,
    color: theme.colors.text.tertiary,
    marginTop: 4,
  },
  chevron: {
    marginLeft: theme.spacing.md,
  },
  chevronIcon: {
    fontSize: 24,
    color: theme.colors.neutral[300],
  },
});
