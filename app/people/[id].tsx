// Person Detail Screen
import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  ScrollView,
  Modal,
} from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { usePeople } from '../../src/hooks/usePeople';
import { Loading } from '../../src/components/ui/Loading';
import { PersonForm } from '../../src/components/people/PersonForm';
import { formatBirthday, calculateAge } from '../../src/utils/date';

export default function PersonDetailScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams();
  const { selectedPerson, fetchPerson, updatePerson, deletePerson } = usePeople();
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (id && typeof id === 'string') {
      fetchPerson(id);
    }
  }, [id]);

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
  };

  const handleUpdate = async (data: any) => {
    if (!selectedPerson) return;

    setLoading(true);
    try {
      const updates = {
        id: selectedPerson.id,
        name: data.name,
        relationship: data.relationship,
        birthdayMonth: data.birthdayMonth ? parseInt(data.birthdayMonth) : undefined,
        birthdayDay: data.birthdayDay ? parseInt(data.birthdayDay) : undefined,
        birthdayYear: data.birthdayYear ? parseInt(data.birthdayYear) : undefined,
        notes: data.notes || '',
      };

      await updatePerson(updates);
      setIsEditing(false);
      // Refetch to show updated data
      if (id && typeof id === 'string') {
        fetchPerson(id);
      }
    } catch (error: any) {
      Alert.alert('Error', error.message || 'Failed to update person');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = () => {
    if (!selectedPerson) return;

    Alert.alert(
      'Delete Person',
      `Are you sure you want to delete ${selectedPerson.name}? This will also delete all associated gift maps, events, and history.`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              await deletePerson(selectedPerson.id);
              router.back();
            } catch (error: any) {
              Alert.alert('Error', error.message || 'Failed to delete person');
            }
          },
        },
      ]
    );
  };

  if (!selectedPerson) {
    return <Loading message="Loading person..." />;
  }

  const hasBirthday = selectedPerson.birthdayMonth && selectedPerson.birthdayDay;
  let age: number | null = null;

  if (hasBirthday && selectedPerson.birthdayYear) {
    age = calculateAge(
      selectedPerson.birthdayMonth!,
      selectedPerson.birthdayDay!,
      selectedPerson.birthdayYear
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Text style={styles.backButtonText}>‹ Back</Text>
        </TouchableOpacity>
        <Text style={styles.title}>{selectedPerson.name}</Text>
        <TouchableOpacity onPress={handleEdit} style={styles.editButton}>
          <Text style={styles.editButtonText}>Edit</Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.card}>
          <View style={styles.infoRow}>
            <Text style={styles.label}>Name</Text>
            <Text style={styles.value}>{selectedPerson.name}</Text>
          </View>

          <View style={styles.infoRow}>
            <Text style={styles.label}>Relationship</Text>
            <Text style={styles.value}>{selectedPerson.relationship}</Text>
          </View>

          {hasBirthday && (
            <View style={styles.infoRow}>
              <Text style={styles.label}>Birthday</Text>
              <Text style={styles.value}>
                {formatBirthday(
                  selectedPerson.birthdayMonth!,
                  selectedPerson.birthdayDay!,
                  selectedPerson.birthdayYear
                )}
                {age !== null && ` (${age} years old)`}
              </Text>
            </View>
          )}

          {selectedPerson.notes && (
            <View style={styles.infoRow}>
              <Text style={styles.label}>Notes</Text>
              <Text style={styles.value}>{selectedPerson.notes}</Text>
            </View>
          )}
        </View>

        {/* Gift Map Section */}
        <View style={styles.actionSection}>
          <TouchableOpacity
            style={styles.actionCard}
            onPress={() => router.push(`/gift-map/${selectedPerson.id}` as any)}
          >
            <View style={styles.actionIcon}>
              <Text style={styles.actionIconText}>🎁</Text>
            </View>
            <View style={styles.actionContent}>
              <Text style={styles.actionTitle}>Gift Map</Text>
              <Text style={styles.actionDescription}>
                Track gift ideas and share with family
              </Text>
            </View>
            <Text style={styles.actionArrow}>›</Text>
          </TouchableOpacity>
        </View>

        {/* Upcoming Features */}
        <View style={styles.placeholderSection}>
          <Text style={styles.placeholderTitle}>Coming Soon</Text>
          <Text style={styles.placeholderText}>
            • Upcoming events{'\n'}
            • Gift history
          </Text>
        </View>

        <TouchableOpacity style={styles.deleteButton} onPress={handleDelete}>
          <Text style={styles.deleteButtonText}>Delete Person</Text>
        </TouchableOpacity>
      </ScrollView>

      {/* Edit Modal */}
      <Modal visible={isEditing} animationType="slide" presentationStyle="pageSheet">
        <View style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <TouchableOpacity onPress={handleCancelEdit} style={styles.backButton}>
              <Text style={styles.backButtonText}>Cancel</Text>
            </TouchableOpacity>
            <Text style={styles.title}>Edit Person</Text>
            <View style={styles.placeholder} />
          </View>

          <PersonForm person={selectedPerson} onSubmit={handleUpdate} loading={loading} />
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 16,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e2e8f0',
  },
  backButton: {
    paddingVertical: 8,
  },
  backButtonText: {
    fontSize: 18,
    color: '#6366f1',
    fontWeight: '600',
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1e293b',
  },
  editButton: {
    paddingVertical: 8,
  },
  editButtonText: {
    fontSize: 16,
    color: '#6366f1',
    fontWeight: '600',
  },
  placeholder: {
    width: 60,
  },
  content: {
    flex: 1,
    padding: 20,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 20,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  infoRow: {
    marginBottom: 16,
  },
  label: {
    fontSize: 12,
    fontWeight: '600',
    color: '#64748b',
    marginBottom: 4,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  value: {
    fontSize: 16,
    color: '#1e293b',
    lineHeight: 22,
  },
  actionSection: {
    marginBottom: 20,
  },
  actionCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  actionIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#f0f9ff',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  actionIconText: {
    fontSize: 24,
  },
  actionContent: {
    flex: 1,
  },
  actionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1e293b',
    marginBottom: 2,
  },
  actionDescription: {
    fontSize: 13,
    color: '#64748b',
  },
  actionArrow: {
    fontSize: 24,
    color: '#cbd5e1',
    fontWeight: '300',
  },
  placeholderSection: {
    backgroundColor: '#f0f9ff',
    borderRadius: 12,
    padding: 20,
    marginBottom: 20,
  },
  placeholderTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#0369a1',
    marginBottom: 8,
  },
  placeholderText: {
    fontSize: 14,
    color: '#075985',
    lineHeight: 22,
  },
  deleteButton: {
    backgroundColor: '#fff',
    borderWidth: 2,
    borderColor: '#ef4444',
    borderRadius: 8,
    padding: 16,
    alignItems: 'center',
    marginBottom: 40,
  },
  deleteButtonText: {
    color: '#ef4444',
    fontSize: 16,
    fontWeight: '600',
  },
  modalContainer: {
    flex: 1,
    backgroundColor: '#fff',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e2e8f0',
  },
});
