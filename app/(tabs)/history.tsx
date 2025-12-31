// History Screen - Track past gifts
import React, { useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Modal, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { useHistory } from '../../src/hooks/useHistory';
import { usePeople } from '../../src/hooks/usePeople';
import { HistoryCard } from '../../src/components/history/HistoryCard';
import { HistoryForm } from '../../src/components/history/HistoryForm';
import { EmptyState } from '../../src/components/ui/EmptyState';
import { Loading } from '../../src/components/ui/Loading';
import { theme } from '../../src/styles/theme';

export default function HistoryScreen() {
  const router = useRouter();
  const { history, loading, createHistoryEntry, updateHistoryEntry, deleteHistoryEntry } = useHistory();
  const { people } = usePeople();
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingHistory, setEditingHistory] = useState<any>(null);
  const [actionLoading, setActionLoading] = useState(false);
  const [filter, setFilter] = useState<'all' | 'gave' | 'received'>('all');

  const handleCreateHistory = async (data: any) => {
    setActionLoading(true);
    try {
      await createHistoryEntry(data);
      setShowAddModal(false);
      Alert.alert('Success', 'Gift history added!');
    } catch (error: any) {
      Alert.alert('Error', error.message || 'Failed to add history');
    } finally {
      setActionLoading(false);
    }
  };

  const handleUpdateHistory = async (data: any) => {
    if (!editingHistory) return;

    setActionLoading(true);
    try {
      await updateHistoryEntry(editingHistory.id, data);
      setEditingHistory(null);
      Alert.alert('Success', 'Gift history updated!');
    } catch (error: any) {
      Alert.alert('Error', error.message || 'Failed to update history');
    } finally {
      setActionLoading(false);
    }
  };

  const handleDeleteHistory = (entry: any) => {
    Alert.alert(
      'Delete History Entry',
      `Are you sure you want to delete "${entry.giftName}" for ${entry.personName}?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              await deleteHistoryEntry(entry.id);
              Alert.alert('Success', 'History entry deleted');
            } catch (error: any) {
              Alert.alert('Error', error.message || 'Failed to delete history');
            }
          },
        },
      ]
    );
  };

  const handleHistoryPress = (entry: any) => {
    Alert.alert(
      entry.giftName,
      `${entry.direction === 'gave' ? 'Gave to' : 'Received from'} ${entry.personName} on ${entry.date.toLocaleDateString()}`,
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Edit', onPress: () => setEditingHistory(entry) },
        { text: 'Delete', style: 'destructive', onPress: () => handleDeleteHistory(entry) },
      ]
    );
  };

  const filteredHistory = history.filter((entry) => {
    if (filter === 'all') return true;
    return entry.direction === filter;
  });

  if (loading && history.length === 0) {
    return <Loading message="Loading history..." />;
  }

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>Gift History</Text>
        <TouchableOpacity style={styles.addButton} onPress={() => setShowAddModal(true)}>
          <Text style={styles.addButtonText}>+ Add</Text>
        </TouchableOpacity>
      </View>

      {/* Filter Tabs */}
      {history.length > 0 && (
        <View style={styles.filterTabs}>
          <TouchableOpacity
            style={[styles.filterTab, filter === 'all' && styles.filterTabActive]}
            onPress={() => setFilter('all')}
          >
            <Text style={[styles.filterTabText, filter === 'all' && styles.filterTabTextActive]}>
              All ({history.length})
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.filterTab, filter === 'gave' && styles.filterTabActive]}
            onPress={() => setFilter('gave')}
          >
            <Text style={[styles.filterTabText, filter === 'gave' && styles.filterTabTextActive]}>
              Gave ({history.filter((h) => h.direction === 'gave').length})
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.filterTab, filter === 'received' && styles.filterTabActive]}
            onPress={() => setFilter('received')}
          >
            <Text style={[styles.filterTabText, filter === 'received' && styles.filterTabTextActive]}>
              Received ({history.filter((h) => h.direction === 'received').length})
            </Text>
          </TouchableOpacity>
        </View>
      )}

      {/* History List */}
      {filteredHistory.length > 0 ? (
        <FlatList
          data={filteredHistory}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <HistoryCard history={item} onPress={() => handleHistoryPress(item)} />
          )}
          contentContainerStyle={styles.listContent}
        />
      ) : (
        <View style={styles.emptyContainer}>
          <EmptyState
            title={filter === 'all' ? 'No History Yet' : `No ${filter === 'gave' ? 'Gave' : 'Received'} Gifts`}
            message={
              filter === 'all'
                ? 'Track past gifts to avoid duplicates and remember what worked!'
                : `You haven't ${filter === 'gave' ? 'given any gifts' : 'received any gifts'} yet.`
            }
            actionLabel="Add Gift History"
            onAction={() => setShowAddModal(true)}
          />
        </View>
      )}

      {/* Add/Edit History Modal */}
      <Modal
        visible={showAddModal || !!editingHistory}
        animationType="slide"
        presentationStyle="pageSheet"
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <TouchableOpacity
              onPress={() => {
                setShowAddModal(false);
                setEditingHistory(null);
              }}
              style={styles.cancelButton}
            >
              <Text style={styles.cancelText}>Cancel</Text>
            </TouchableOpacity>
            <Text style={styles.modalTitle}>
              {editingHistory ? 'Edit History' : 'Add Gift History'}
            </Text>
            <View style={styles.placeholder} />
          </View>

          <HistoryForm
            initialData={editingHistory || undefined}
            onSubmit={editingHistory ? handleUpdateHistory : handleCreateHistory}
            loading={actionLoading}
            onCancel={() => {
              setShowAddModal(false);
              setEditingHistory(null);
            }}
          />
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: theme.spacing.xl,
    paddingTop: 60,
    paddingBottom: theme.spacing.lg,
    backgroundColor: theme.colors.surface,
    ...theme.shadows.sm,
  },
  title: {
    ...theme.typography.h1,
    color: theme.colors.text.primary,
  },
  addButton: {
    backgroundColor: theme.colors.primary[600],
    paddingHorizontal: theme.spacing.lg,
    paddingVertical: theme.spacing.sm,
    borderRadius: theme.borderRadius.md,
    ...theme.shadows.sm,
  },
  addButtonText: {
    color: theme.colors.surface,
    fontSize: 16,
    fontWeight: '600',
  },
  filterTabs: {
    flexDirection: 'row',
    backgroundColor: theme.colors.surface,
    paddingHorizontal: theme.spacing.xl,
    paddingVertical: theme.spacing.md,
    gap: theme.spacing.sm,
    ...theme.shadows.sm,
  },
  filterTab: {
    paddingVertical: theme.spacing.sm,
    paddingHorizontal: theme.spacing.lg,
    borderRadius: theme.borderRadius.lg,
    backgroundColor: theme.colors.neutral[100],
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  filterTabActive: {
    backgroundColor: theme.colors.primary[600],
    borderColor: theme.colors.primary[600],
  },
  filterTabText: {
    fontSize: 14,
    fontWeight: '600',
    color: theme.colors.text.secondary,
  },
  filterTabTextActive: {
    color: theme.colors.surface,
  },
  listContent: {
    padding: theme.spacing.xl,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    padding: theme.spacing.xl,
  },
  modalContainer: {
    flex: 1,
    backgroundColor: theme.colors.surface,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: theme.spacing.xl,
    paddingTop: 60,
    paddingBottom: theme.spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
  },
  cancelButton: {
    paddingVertical: theme.spacing.sm,
  },
  cancelText: {
    fontSize: 16,
    color: theme.colors.primary[600],
    fontWeight: '600',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: theme.colors.text.primary,
  },
  placeholder: {
    width: 60,
  },
});
