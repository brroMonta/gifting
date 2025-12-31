// People List Screen
import React, { useState } from 'react';
import { View, Text, FlatList, StyleSheet, TextInput, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { usePeople } from '../../src/hooks/usePeople';
import { PersonCard } from '../../src/components/people/PersonCard';
import { EmptyState } from '../../src/components/ui/EmptyState';
import { Loading } from '../../src/components/ui/Loading';

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
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#1e293b',
  },
  addButton: {
    backgroundColor: '#6366f1',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
  },
  addButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  searchContainer: {
    paddingHorizontal: 20,
    paddingVertical: 12,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e2e8f0',
  },
  searchInput: {
    backgroundColor: '#f1f5f9',
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 10,
    fontSize: 16,
    color: '#1e293b',
  },
  listContent: {
    padding: 20,
  },
});
