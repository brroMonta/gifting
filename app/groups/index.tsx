// Groups List Screen
import React, { useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Modal, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { useGroups } from '../../src/hooks/useGroups';
import { GroupCard } from '../../src/components/groups/GroupCard';
import { GroupForm } from '../../src/components/groups/GroupForm';
import { EmptyState } from '../../src/components/ui/EmptyState';
import { Loading } from '../../src/components/ui/Loading';
import { theme } from '../../src/styles/theme';

export default function GroupsListScreen() {
  const router = useRouter();
  const { groups, loading, createGroup, updateGroup, deleteGroup } = useGroups();
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingGroup, setEditingGroup] = useState<any>(null);
  const [actionLoading, setActionLoading] = useState(false);

  const handleCreateGroup = async (data: any) => {
    setActionLoading(true);
    try {
      await createGroup({ name: data.name, memberIds: [] });
      setShowAddModal(false);
      Alert.alert('Success', 'Group created!');
    } catch (error: any) {
      Alert.alert('Error', error.message || 'Failed to create group');
    } finally {
      setActionLoading(false);
    }
  };

  const handleUpdateGroup = async (data: any) => {
    if (!editingGroup) return;

    setActionLoading(true);
    try {
      await updateGroup(editingGroup.id, { name: data.name });
      setEditingGroup(null);
      Alert.alert('Success', 'Group updated!');
    } catch (error: any) {
      Alert.alert('Error', error.message || 'Failed to update group');
    } finally {
      setActionLoading(false);
    }
  };

  const handleDeleteGroup = (group: any) => {
    Alert.alert(
      'Delete Group',
      `Are you sure you want to delete "${group.name}"?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              await deleteGroup(group.id);
              Alert.alert('Success', 'Group deleted');
            } catch (error: any) {
              Alert.alert('Error', error.message || 'Failed to delete group');
            }
          },
        },
      ]
    );
  };

  const handleGroupPress = (group: any) => {
    router.push(`/groups/${group.id}` as any);
  };

  const handleGroupLongPress = (group: any) => {
    Alert.alert(
      group.name,
      'What would you like to do?',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Edit', onPress: () => setEditingGroup(group) },
        { text: 'Delete', style: 'destructive', onPress: () => handleDeleteGroup(group) },
      ]
    );
  };

  if (loading && groups.length === 0) {
    return <Loading message="Loading groups..." />;
  }

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.push('/(tabs)' as any)} style={styles.backButton}>
          <Text style={styles.backButtonText}>‹ Back</Text>
        </TouchableOpacity>
        <Text style={styles.title}>Groups</Text>
        <TouchableOpacity style={styles.addButton} onPress={() => setShowAddModal(true)}>
          <Text style={styles.addButtonText}>+ Add</Text>
        </TouchableOpacity>
      </View>

      {/* Groups List */}
      {groups.length > 0 ? (
        <FlatList
          data={groups}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <GroupCard
              group={item}
              onPress={() => handleGroupPress(item)}
              onLongPress={() => handleGroupLongPress(item)}
            />
          )}
          contentContainerStyle={styles.listContent}
        />
      ) : (
        <View style={styles.emptyContainer}>
          <EmptyState
            title="No Groups Yet"
            message="Organize people into groups like Family, Friends, or Coworkers"
            actionLabel="Create Group"
            onAction={() => setShowAddModal(true)}
          />
        </View>
      )}

      {/* Add/Edit Group Modal */}
      <Modal
        visible={showAddModal || !!editingGroup}
        animationType="slide"
        presentationStyle="pageSheet"
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <TouchableOpacity
              onPress={() => {
                setShowAddModal(false);
                setEditingGroup(null);
              }}
              style={styles.cancelButton}
            >
              <Text style={styles.cancelText}>Cancel</Text>
            </TouchableOpacity>
            <Text style={styles.modalTitle}>
              {editingGroup ? 'Edit Group' : 'Create Group'}
            </Text>
            <View style={styles.placeholder} />
          </View>

          <GroupForm
            initialData={editingGroup || undefined}
            onSubmit={editingGroup ? handleUpdateGroup : handleCreateGroup}
            loading={actionLoading}
            onCancel={() => {
              setShowAddModal(false);
              setEditingGroup(null);
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
  backButton: {
    paddingVertical: theme.spacing.sm,
  },
  backButtonText: {
    fontSize: 18,
    color: theme.colors.primary[600],
    fontWeight: '600',
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
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
