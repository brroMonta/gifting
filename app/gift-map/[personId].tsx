// Gift Map Screen - Owner's view for managing gift ideas
import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useGiftMaps } from '../../src/hooks/useGiftMaps';
import { usePeople } from '../../src/hooks/usePeople';
import { GiftItemCard } from '../../src/components/gift-maps/GiftItemCard';
import { GiftItemForm } from '../../src/components/gift-maps/GiftItemForm';
import { ShareLinkModal } from '../../src/components/gift-maps/ShareLinkModal';
import { Button } from '../../src/components/ui/Button';
import { EmptyState } from '../../src/components/ui/EmptyState';
import { GiftMapItem, CreateGiftMapItemInput } from '../../src/types/giftMap';
import { theme } from '../../src/styles/theme';

export default function GiftMapScreen() {
  const { personId } = useLocalSearchParams<{ personId: string }>();
  const router = useRouter();
  const { people } = usePeople();
  const {
    giftMaps,
    loading,
    fetchGiftMap,
    createGiftMap,
    addItem,
    updateItem,
    deleteItem,
    generateShareLink,
    disableSharing,
  } = useGiftMaps();

  const [showAddForm, setShowAddForm] = useState(false);
  const [editingItem, setEditingItem] = useState<GiftMapItem | null>(null);
  const [showShareModal, setShowShareModal] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);

  const person = people.find((p) => p.id === personId);
  const giftMap = giftMaps[personId];

  useEffect(() => {
    if (personId) {
      loadGiftMap();
    }
  }, [personId]);

  const loadGiftMap = async () => {
    try {
      await fetchGiftMap(personId);
    } catch (error: any) {
      // If gift map doesn't exist, create it
      if (person) {
        try {
          await createGiftMap(personId, person.name);
          await fetchGiftMap(personId);
        } catch (createError: any) {
          Alert.alert('Error', createError.message || 'Failed to load gift map');
        }
      }
    }
  };

  const handleAddItem = async (data: CreateGiftMapItemInput) => {
    setActionLoading(true);
    try {
      await addItem(personId, data);
      setShowAddForm(false);
      Alert.alert('Success', 'Gift item added!');
    } catch (error: any) {
      Alert.alert('Error', error.message || 'Failed to add item');
    } finally {
      setActionLoading(false);
    }
  };

  const handleUpdateItem = async (data: CreateGiftMapItemInput) => {
    if (!editingItem) return;

    setActionLoading(true);
    try {
      await updateItem(personId, editingItem.id, data);
      setEditingItem(null);
      Alert.alert('Success', 'Gift item updated!');
    } catch (error: any) {
      Alert.alert('Error', error.message || 'Failed to update item');
    } finally {
      setActionLoading(false);
    }
  };

  const handleDeleteItem = (item: GiftMapItem) => {
    Alert.alert(
      'Delete Item',
      `Are you sure you want to delete "${item.name}"?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              await deleteItem(personId, item.id);
              Alert.alert('Success', 'Gift item deleted');
            } catch (error: any) {
              Alert.alert('Error', error.message || 'Failed to delete item');
            }
          },
        },
      ]
    );
  };

  const handleShare = async () => {
    if (!giftMap?.items || giftMap.items.length === 0) {
      Alert.alert('No Items', 'Add some gift ideas before sharing!');
      return;
    }

    if (giftMap.shareToken) {
      setShowShareModal(true);
    } else {
      setActionLoading(true);
      try {
        await generateShareLink(personId);
        setShowShareModal(true);
      } catch (error: any) {
        Alert.alert('Error', error.message || 'Failed to generate share link');
      } finally {
        setActionLoading(false);
      }
    }
  };

  const handleDisableSharing = async () => {
    setActionLoading(true);
    try {
      await disableSharing(personId);
      setShowShareModal(false);
      Alert.alert('Success', 'Sharing disabled');
    } catch (error: any) {
      Alert.alert('Error', error.message || 'Failed to disable sharing');
    } finally {
      setActionLoading(false);
    }
  };

  if (loading && !giftMap) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={theme.colors.primary[600]} />
        <Text style={styles.loadingText}>Loading gift map...</Text>
      </View>
    );
  }

  if (!person) {
    return (
      <View style={styles.container}>
        <EmptyState
          title="Person Not Found"
          message="This person doesn't exist"
          actionLabel="Go Back"
          onAction={() => router.back()}
        />
      </View>
    );
  }

  const items = giftMap?.items || [];
  const hasItems = items.length > 0;

  return (
    <View style={styles.container}>
      <ScrollView style={styles.scrollView} contentContainerStyle={styles.content}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>Gift Map for {person.name}</Text>
          <Text style={styles.subtitle}>
            Track gift ideas and share with family and friends
          </Text>
        </View>

        {/* Share Button */}
        {hasItems && (
          <Button
            title={giftMap?.shareToken ? '🔗 Sharing Enabled' : 'Share Gift Map'}
            onPress={handleShare}
            loading={actionLoading}
            variant={giftMap?.shareToken ? 'secondary' : 'primary'}
            style={styles.shareButton}
          />
        )}

        {/* Add Item Form */}
        {(showAddForm || editingItem) && (
          <View style={styles.formContainer}>
            <View style={styles.formHeader}>
              <Text style={styles.formTitle}>
                {editingItem ? 'Edit Gift Item' : 'Add Gift Item'}
              </Text>
              <TouchableOpacity
                onPress={() => {
                  setShowAddForm(false);
                  setEditingItem(null);
                }}
              >
                <Text style={styles.closeButton}>✕</Text>
              </TouchableOpacity>
            </View>
            <GiftItemForm
              initialData={
                editingItem
                  ? { name: editingItem.name, url: editingItem.url, notes: editingItem.notes }
                  : undefined
              }
              onSubmit={editingItem ? handleUpdateItem : handleAddItem}
              loading={actionLoading}
              onCancel={() => {
                setShowAddForm(false);
                setEditingItem(null);
              }}
            />
          </View>
        )}

        {/* Add Item Button */}
        {!showAddForm && !editingItem && (
          <Button
            title="+ Add Gift Item"
            onPress={() => setShowAddForm(true)}
            variant="outline"
            style={styles.addButton}
          />
        )}

        {/* Gift Items List */}
        {hasItems ? (
          <View style={styles.itemsList}>
            <Text style={styles.sectionTitle}>
              Gift Ideas ({items.length})
            </Text>
            {items.map((item) => (
              <GiftItemCard
                key={item.id}
                item={item}
                isOwner={true}
                onEdit={() => setEditingItem(item)}
                onDelete={() => handleDeleteItem(item)}
              />
            ))}
          </View>
        ) : (
          !showAddForm && (
            <EmptyState
              title="No Gift Ideas Yet"
              message="Start adding gift ideas for this person. You can share the list later!"
              actionLabel="Add First Item"
              onAction={() => setShowAddForm(true)}
            />
          )
        )}
      </ScrollView>

      {/* Share Link Modal */}
      {giftMap?.shareToken && (
        <ShareLinkModal
          visible={showShareModal}
          shareToken={giftMap.shareToken}
          personName={person.name}
          onClose={() => setShowShareModal(false)}
          onDisableSharing={handleDisableSharing}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: theme.colors.background,
  },
  loadingText: {
    marginTop: theme.spacing.md,
    fontSize: 16,
    color: theme.colors.text.secondary,
  },
  scrollView: {
    flex: 1,
  },
  content: {
    padding: theme.spacing.xl,
  },
  header: {
    marginBottom: theme.spacing.xl,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: theme.colors.text.primary,
    marginBottom: theme.spacing.sm,
  },
  subtitle: {
    fontSize: 14,
    color: theme.colors.text.secondary,
  },
  shareButton: {
    marginBottom: theme.spacing.xl,
  },
  formContainer: {
    backgroundColor: theme.colors.surface,
    borderRadius: theme.borderRadius.xl,
    padding: theme.spacing.lg,
    marginBottom: theme.spacing.xl,
    ...theme.shadows.lg,
  },
  formHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: theme.spacing.md,
  },
  formTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: theme.colors.text.primary,
  },
  closeButton: {
    fontSize: 24,
    color: theme.colors.text.secondary,
    paddingHorizontal: theme.spacing.sm,
  },
  addButton: {
    marginBottom: theme.spacing.xl,
  },
  itemsList: {
    marginTop: theme.spacing.sm,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: theme.colors.text.primary,
    marginBottom: theme.spacing.md,
  },
});
