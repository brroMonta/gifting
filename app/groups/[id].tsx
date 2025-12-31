// Group Detail Screen
import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Alert } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { useGroups } from '../../src/hooks/useGroups';
import { usePeople } from '../../src/hooks/usePeople';
import { PersonCard } from '../../src/components/people/PersonCard';
import { EmptyState } from '../../src/components/ui/EmptyState';
import { Loading } from '../../src/components/ui/Loading';
import { theme } from '../../src/styles/theme';

export default function GroupDetailScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const { selectedGroup, fetchGroup, addMember, removeMember, deleteGroup } = useGroups();
  const { people } = usePeople();
  const [showAddMember, setShowAddMember] = useState(false);

  useEffect(() => {
    if (id) {
      fetchGroup(id);
    }
  }, [id]);

  const groupMembers = people.filter((person) =>
    selectedGroup?.memberIds?.includes(person.id)
  );

  const availablePeople = people.filter(
    (person) => !selectedGroup?.memberIds?.includes(person.id)
  );

  const handleAddMember = async (personId: string) => {
    if (!id) return;

    try {
      await addMember(id, personId);
      setShowAddMember(false);
      Alert.alert('Success', 'Member added to group');
    } catch (error: any) {
      Alert.alert('Error', error.message || 'Failed to add member');
    }
  };

  const handleRemoveMember = (personId: string, personName: string) => {
    if (!id) return;

    Alert.alert(
      'Remove Member',
      `Remove ${personName} from this group?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Remove',
          style: 'destructive',
          onPress: async () => {
            try {
              await removeMember(id, personId);
              Alert.alert('Success', 'Member removed from group');
            } catch (error: any) {
              Alert.alert('Error', error.message || 'Failed to remove member');
            }
          },
        },
      ]
    );
  };

  const handleDeleteGroup = () => {
    if (!id || !selectedGroup) return;

    Alert.alert(
      'Delete Group',
      `Are you sure you want to delete "${selectedGroup.name}"?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              await deleteGroup(id);
              router.push('/groups' as any);
            } catch (error: any) {
              Alert.alert('Error', error.message || 'Failed to delete group');
            }
          },
        },
      ]
    );
  };

  if (!selectedGroup) {
    return <Loading message="Loading group..." />;
  }

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.push('/groups' as any)} style={styles.backButton}>
          <Text style={styles.backButtonText}>‹ Back</Text>
        </TouchableOpacity>
        <Text style={styles.title}>{selectedGroup.name}</Text>
        <View style={styles.placeholder} />
      </View>

      {showAddMember ? (
        <View style={styles.content}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Add Member</Text>
            <TouchableOpacity onPress={() => setShowAddMember(false)}>
              <Text style={styles.cancelText}>Cancel</Text>
            </TouchableOpacity>
          </View>

          {availablePeople.length > 0 ? (
            <FlatList
              data={availablePeople}
              keyExtractor={(item) => item.id}
              renderItem={({ item }) => (
                <PersonCard person={item} onPress={() => handleAddMember(item.id)} />
              )}
              contentContainerStyle={styles.listContent}
            />
          ) : (
            <EmptyState
              title="All People Added"
              message="Everyone is already in this group!"
            />
          )}
        </View>
      ) : (
        <View style={styles.content}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>
              Members ({groupMembers.length})
            </Text>
            <TouchableOpacity onPress={() => setShowAddMember(true)}>
              <Text style={styles.addMemberText}>+ Add</Text>
            </TouchableOpacity>
          </View>

          {groupMembers.length > 0 ? (
            <FlatList
              data={groupMembers}
              keyExtractor={(item) => item.id}
              renderItem={({ item }) => (
                <View>
                  <PersonCard
                    person={item}
                    onPress={() => router.push(`/(tabs)/people/${item.id}` as any)}
                  />
                  <TouchableOpacity
                    style={styles.removeButton}
                    onPress={() => handleRemoveMember(item.id, item.name)}
                  >
                    <Text style={styles.removeButtonText}>Remove from Group</Text>
                  </TouchableOpacity>
                </View>
              )}
              contentContainerStyle={styles.listContent}
            />
          ) : (
            <EmptyState
              title="No Members Yet"
              message="Add people to this group to organize them"
              actionLabel="Add Member"
              onAction={() => setShowAddMember(true)}
            />
          )}

          <TouchableOpacity style={styles.deleteButton} onPress={handleDeleteGroup}>
            <Text style={styles.deleteButtonText}>Delete Group</Text>
          </TouchableOpacity>
        </View>
      )}
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
  placeholder: {
    width: 60,
  },
  content: {
    flex: 1,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: theme.spacing.xl,
    paddingVertical: theme.spacing.lg,
    backgroundColor: theme.colors.surface,
    ...theme.shadows.sm,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: theme.colors.text.primary,
  },
  addMemberText: {
    fontSize: 14,
    fontWeight: '600',
    color: theme.colors.primary[600],
  },
  cancelText: {
    fontSize: 14,
    fontWeight: '600',
    color: theme.colors.text.secondary,
  },
  listContent: {
    padding: theme.spacing.xl,
  },
  removeButton: {
    marginTop: -theme.spacing.sm,
    marginBottom: theme.spacing.md,
    marginHorizontal: theme.spacing.xl,
    paddingVertical: theme.spacing.sm,
    paddingHorizontal: theme.spacing.lg,
    backgroundColor: theme.colors.surface,
    borderWidth: 1,
    borderColor: theme.colors.error[200],
    borderRadius: theme.borderRadius.md,
  },
  removeButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: theme.colors.error[500],
    textAlign: 'center',
  },
  deleteButton: {
    margin: theme.spacing.xl,
    padding: theme.spacing.lg,
    backgroundColor: theme.colors.surface,
    borderWidth: 2,
    borderColor: theme.colors.error[500],
    borderRadius: theme.borderRadius.lg,
    alignItems: 'center',
  },
  deleteButtonText: {
    color: theme.colors.error[500],
    fontSize: 16,
    fontWeight: '600',
  },
});
