// GroupCard Component - Display a group
import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Group } from '../../types/group';
import { theme } from '../../styles/theme';

interface GroupCardProps {
  group: Group;
  onPress?: () => void;
  onLongPress?: () => void;
}

export const GroupCard: React.FC<GroupCardProps> = ({ group, onPress, onLongPress }) => {
  const memberCount = group.memberIds?.length || 0;

  return (
    <TouchableOpacity
      style={styles.card}
      onPress={onPress}
      onLongPress={onLongPress}
      disabled={!onPress}
    >
      <View style={styles.content}>
        <View style={styles.iconContainer}>
          <Text style={styles.icon}>👥</Text>
        </View>
        <View style={styles.info}>
          <Text style={styles.name}>{group.name}</Text>
          <Text style={styles.memberCount}>
            {memberCount} {memberCount === 1 ? 'member' : 'members'}
          </Text>
        </View>
        <Text style={styles.arrow}>›</Text>
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
    ...theme.shadows.md,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconContainer: {
    width: 56,
    height: 56,
    borderRadius: theme.borderRadius.xl,
    backgroundColor: theme.colors.primary[50],
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: theme.spacing.md,
  },
  icon: {
    fontSize: 28,
  },
  info: {
    flex: 1,
  },
  name: {
    fontSize: 17,
    fontWeight: '600',
    color: theme.colors.text.primary,
    marginBottom: 4,
  },
  memberCount: {
    fontSize: 14,
    color: theme.colors.text.secondary,
    fontWeight: '500',
  },
  arrow: {
    fontSize: 28,
    color: theme.colors.neutral[300],
    fontWeight: '300',
  },
});
