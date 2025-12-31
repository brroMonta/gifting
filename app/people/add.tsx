// Add Person Screen
import React, { useState } from 'react';
import { View, Text, StyleSheet, Alert, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { PersonForm } from '../../src/components/people/PersonForm';
import { usePeople } from '../../src/hooks/usePeople';

export default function AddPersonScreen() {
  const router = useRouter();
  const { createPerson } = usePeople();
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (data: any) => {
    setLoading(true);
    try {
      const personData = {
        name: data.name,
        relationship: data.relationship,
        birthdayMonth: data.birthdayMonth ? parseInt(data.birthdayMonth) : undefined,
        birthdayDay: data.birthdayDay ? parseInt(data.birthdayDay) : undefined,
        birthdayYear: data.birthdayYear ? parseInt(data.birthdayYear) : undefined,
        notes: data.notes || '',
        groupIds: [],
      };

      await createPerson(personData);
      router.back();
    } catch (error: any) {
      Alert.alert('Error', error.message || 'Failed to add person');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Text style={styles.backButtonText}>‹ Back</Text>
        </TouchableOpacity>
        <Text style={styles.title}>Add Person</Text>
        <View style={styles.placeholder} />
      </View>

      <PersonForm onSubmit={handleSubmit} loading={loading} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 16,
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
  placeholder: {
    width: 60,
  },
});
