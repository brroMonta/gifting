// GiftItemCard Component - Display a gift item
import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Linking, Image } from 'react-native';
import { GiftMapItem } from '../../types/giftMap';
import { theme } from '../../styles/theme';

interface GiftItemCardProps {
  item: GiftMapItem;
  isOwner: boolean;
  onEdit?: () => void;
  onDelete?: () => void;
  onReserve?: () => void;
  onUnreserve?: () => void;
}

export const GiftItemCard: React.FC<GiftItemCardProps> = ({
  item,
  isOwner,
  onEdit,
  onDelete,
  onReserve,
  onUnreserve,
}) => {
  const handleUrlPress = () => {
    if (item.url) {
      Linking.openURL(item.url);
    }
  };

  return (
    <View style={[styles.card, item.isReserved && styles.reservedCard]}>
      {/* Image Preview */}
      {item.imageUrl && (
        <Image
          source={{ uri: item.imageUrl }}
          style={styles.itemImage}
          resizeMode="cover"
        />
      )}

      <View style={styles.content}>
        <View style={styles.header}>
          <Text style={[styles.name, item.isReserved && styles.reservedText]}>
            {item.name}
          </Text>
          {item.isReserved && (
            <View style={styles.badge}>
              <Text style={styles.badgeText}>Reserved</Text>
            </View>
          )}
        </View>

        {item.url && (
          <TouchableOpacity onPress={handleUrlPress}>
            <Text style={styles.link} numberOfLines={1}>
              🔗 {item.url}
            </Text>
          </TouchableOpacity>
        )}

        {item.notes && (
          <Text style={styles.notes} numberOfLines={2}>
            {item.notes}
          </Text>
        )}

        {/* Actions */}
        <View style={styles.actions}>
          {isOwner ? (
            <>
              {onEdit && (
                <TouchableOpacity style={styles.actionButton} onPress={onEdit}>
                  <Text style={styles.actionButtonText}>Edit</Text>
                </TouchableOpacity>
              )}
              {onDelete && (
                <TouchableOpacity style={[styles.actionButton, styles.deleteButton]} onPress={onDelete}>
                  <Text style={[styles.actionButtonText, styles.deleteButtonText]}>Delete</Text>
                </TouchableOpacity>
              )}
            </>
          ) : (
            <>
              {!item.isReserved && onReserve && (
                <TouchableOpacity style={styles.reserveButton} onPress={onReserve}>
                  <Text style={styles.reserveButtonText}>Reserve This</Text>
                </TouchableOpacity>
              )}
              {item.isReserved && onUnreserve && (
                <TouchableOpacity style={[styles.actionButton, styles.unreserveButton]} onPress={onUnreserve}>
                  <Text style={styles.actionButtonText}>Unreserve</Text>
                </TouchableOpacity>
              )}
            </>
          )}
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: theme.colors.surface,
    borderRadius: theme.borderRadius.xl,
    marginBottom: theme.spacing.md,
    ...theme.shadows.md,
    borderWidth: 1,
    borderColor: theme.colors.border,
    overflow: 'hidden',
  },
  reservedCard: {
    backgroundColor: theme.colors.neutral[50],
    borderColor: theme.colors.neutral[200],
  },
  itemImage: {
    width: '100%',
    height: 160,
    backgroundColor: theme.colors.neutral[100],
  },
  content: {
    flex: 1,
    padding: theme.spacing.lg,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: theme.spacing.sm,
  },
  name: {
    fontSize: 17,
    fontWeight: '600',
    color: theme.colors.text.primary,
    flex: 1,
  },
  reservedText: {
    color: theme.colors.text.secondary,
    textDecorationLine: 'line-through',
  },
  badge: {
    backgroundColor: theme.colors.accent[100],
    borderRadius: theme.borderRadius.lg,
    paddingHorizontal: theme.spacing.sm,
    paddingVertical: 4,
  },
  badgeText: {
    fontSize: 12,
    fontWeight: '700',
    color: theme.colors.accent[700],
  },
  link: {
    fontSize: 14,
    color: theme.colors.primary[600],
    marginBottom: theme.spacing.sm,
    fontWeight: '500',
  },
  notes: {
    fontSize: 14,
    color: theme.colors.text.secondary,
    marginBottom: theme.spacing.md,
  },
  actions: {
    flexDirection: 'row',
    gap: theme.spacing.sm,
  },
  actionButton: {
    paddingVertical: theme.spacing.sm,
    paddingHorizontal: theme.spacing.lg,
    borderRadius: theme.borderRadius.md,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  actionButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: theme.colors.text.secondary,
  },
  deleteButton: {
    borderColor: theme.colors.error[200],
  },
  deleteButtonText: {
    color: theme.colors.error[500],
  },
  reserveButton: {
    flex: 1,
    backgroundColor: theme.colors.primary[600],
    paddingVertical: theme.spacing.sm,
    borderRadius: theme.borderRadius.md,
    alignItems: 'center',
  },
  reserveButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: theme.colors.surface,
  },
  unreserveButton: {
    flex: 1,
    borderColor: theme.colors.neutral[300],
  },
});
