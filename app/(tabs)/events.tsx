// Events Screen - Track when gifts are needed
import React, { useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Modal, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { useEvents } from '../../src/hooks/useEvents';
import { usePeople } from '../../src/hooks/usePeople';
import { EventCard } from '../../src/components/events/EventCard';
import { EventForm } from '../../src/components/events/EventForm';
import { EmptyState } from '../../src/components/ui/EmptyState';
import { Loading } from '../../src/components/ui/Loading';
import { theme } from '../../src/styles/theme';

export default function EventsScreen() {
  const router = useRouter();
  const { events, loading, createEvent, updateEvent, deleteEvent, updateEventStatus } = useEvents();
  const { people } = usePeople();
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingEvent, setEditingEvent] = useState<any>(null);
  const [actionLoading, setActionLoading] = useState(false);

  const handleCreateEvent = async (data: any) => {
    setActionLoading(true);
    try {
      await createEvent(data);
      setShowAddModal(false);
      Alert.alert('Success', 'Event created!');
    } catch (error: any) {
      Alert.alert('Error', error.message || 'Failed to create event');
    } finally {
      setActionLoading(false);
    }
  };

  const handleUpdateEvent = async (data: any) => {
    if (!editingEvent) return;

    setActionLoading(true);
    try {
      await updateEvent(editingEvent.id, data);
      setEditingEvent(null);
      Alert.alert('Success', 'Event updated!');
    } catch (error: any) {
      Alert.alert('Error', error.message || 'Failed to update event');
    } finally {
      setActionLoading(false);
    }
  };

  const handleDeleteEvent = (event: any) => {
    Alert.alert(
      'Delete Event',
      `Are you sure you want to delete this event for ${event.personName}?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              await deleteEvent(event.id);
              Alert.alert('Success', 'Event deleted');
            } catch (error: any) {
              Alert.alert('Error', error.message || 'Failed to delete event');
            }
          },
        },
      ]
    );
  };

  const handleEventPress = (event: any) => {
    Alert.alert(
      event.personName,
      `${event.eventType} on ${event.eventDate.toLocaleDateString()}`,
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Edit', onPress: () => setEditingEvent(event) },
        { text: 'Delete', style: 'destructive', onPress: () => handleDeleteEvent(event) },
      ]
    );
  };

  if (loading && events.length === 0) {
    return <Loading message="Loading events..." />;
  }

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>Events</Text>
        <TouchableOpacity style={styles.addButton} onPress={() => setShowAddModal(true)}>
          <Text style={styles.addButtonText}>+ Add</Text>
        </TouchableOpacity>
      </View>

      {/* Events List */}
      {events.length > 0 ? (
        <FlatList
          data={events}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <EventCard event={item} onPress={() => handleEventPress(item)} />
          )}
          contentContainerStyle={styles.listContent}
        />
      ) : (
        <View style={styles.emptyContainer}>
          <EmptyState
            title="No Events Yet"
            message="Create events to track birthdays, holidays, and special occasions"
            actionLabel="Create Event"
            onAction={() => setShowAddModal(true)}
          />
        </View>
      )}

      {/* Add/Edit Event Modal */}
      <Modal
        visible={showAddModal || !!editingEvent}
        animationType="slide"
        presentationStyle="pageSheet"
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <TouchableOpacity
              onPress={() => {
                setShowAddModal(false);
                setEditingEvent(null);
              }}
              style={styles.cancelButton}
            >
              <Text style={styles.cancelText}>Cancel</Text>
            </TouchableOpacity>
            <Text style={styles.modalTitle}>
              {editingEvent ? 'Edit Event' : 'Create Event'}
            </Text>
            <View style={styles.placeholder} />
          </View>

          <EventForm
            initialData={editingEvent || undefined}
            onSubmit={editingEvent ? handleUpdateEvent : handleCreateEvent}
            loading={actionLoading}
            onCancel={() => {
              setShowAddModal(false);
              setEditingEvent(null);
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
    borderColor: theme.colors.border,
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
