// People List Screen
import React, { useState } from 'react';
import { View, Text, FlatList, StyleSheet, TextInput, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { usePeople } from '../../../src/hooks/usePeople';
import { PersonCard } from '../../../src/components/people/PersonCard';
import { EmptyState } from '../../../src/components/ui/EmptyState';
import { Loading } from '../../../src/components/ui/Loading';
import { theme } from '../../../src/styles/theme';

export default function PeopleListScreen() {
  const router = useRouter();
  const { people, loading, searchPeople, fetchPeople } = usePeople();
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearch = (text: string) => {
    setSearchQuery(text);
    if (text.trim() === '') {
      fetchPeople();
    } else {
      searchPeople(text);
    }
  };

  const handlePersonPress = (personId: string) => {
    router.push(`/people/${personId}` as any);
  };

  const handleAddPerson = () => {
    router.push('/people/add' as any);
  };

  if (loading && people.length === 0) {
    return <Loading message="Loading people..." />;
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>People</Text>
        <TouchableOpacity style={styles.addButton} onPress={handleAddPerson}>
          <Text style={styles.addButtonText}>+ Add</Text>
        </TouchableOpacity>
      </View>

      {people.length > 0 && (
        <View style={styles.searchContainer}>
          <TextInput
            style={styles.searchInput}
            placeholder="Search people..."
            value={searchQuery}
            onChangeText={handleSearch}
            placeholderTextColor="#94a3b8"
          />
        </View>
      )}

      {people.length === 0 ? (
        <EmptyState
          icon="👥"
          title="No People Yet"
          message="Add people you buy gifts for to get started. Track birthdays, relationships, and notes."
          actionLabel="Add First Person"
          onAction={handleAddPerson}
        />
      ) : (
        <FlatList
          data={people}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <PersonCard person={item} onPress={() => handlePersonPress(item.id)} />
          )}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
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
  searchContainer: {
    paddingHorizontal: theme.spacing.xl,
    paddingVertical: theme.spacing.md,
    backgroundColor: theme.colors.surface,
  },
  searchInput: {
    backgroundColor: theme.colors.neutral[100],
    borderRadius: theme.borderRadius.lg,
    paddingHorizontal: theme.spacing.lg,
    paddingVertical: theme.spacing.md,
    fontSize: 16,
    color: theme.colors.text.primary,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  listContent: {
    padding: theme.spacing.xl,
  },
});
