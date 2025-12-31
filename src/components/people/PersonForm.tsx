// PersonForm Component - Form for creating/editing a person
import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { useForm, Controller } from 'react-hook-form';
import { Input } from '../ui/Input';
import { Button } from '../ui/Button';
import { Person } from '../../types/person';
import { isValidName, isValidBirthday } from '../../utils/validation';
import { theme } from '../../styles/theme';

interface PersonFormData {
  name: string;
  relationship: string;
  birthdayMonth?: string;
  birthdayDay?: string;
  birthdayYear?: string;
  notes?: string;
}

interface PersonFormProps {
  person?: Person;
  onSubmit: (data: PersonFormData) => Promise<void>;
  loading?: boolean;
}

export const PersonForm: React.FC<PersonFormProps> = ({
  person,
  onSubmit,
  loading = false,
}) => {
  const {
    control,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<PersonFormData>({
    defaultValues: {
      name: person?.name || '',
      relationship: person?.relationship || '',
      birthdayMonth: person?.birthdayMonth?.toString() || '',
      birthdayDay: person?.birthdayDay?.toString() || '',
      birthdayYear: person?.birthdayYear?.toString() || '',
      notes: person?.notes || '',
    },
  });

  const birthdayMonth = watch('birthdayMonth');
  const birthdayDay = watch('birthdayDay');

  const handleFormSubmit = async (data: PersonFormData) => {
    await onSubmit(data);
  };

  return (
    <ScrollView style={styles.container} keyboardShouldPersistTaps="handled">
      <View style={styles.form}>
        <Controller
          control={control}
          name="name"
          rules={{
            required: 'Name is required',
            validate: (value) => {
              if (!isValidName(value)) {
                return 'Please enter a valid name';
              }
              return true;
            },
          }}
          render={({ field: { onChange, onBlur, value } }) => (
            <Input
              label="Name *"
              placeholder="e.g., Mom, Best Friend, Nephew"
              value={value}
              onChangeText={onChange}
              onBlur={onBlur}
              error={errors.name?.message}
              autoCapitalize="words"
            />
          )}
        />

        <Controller
          control={control}
          name="relationship"
          rules={{
            required: 'Relationship is required',
          }}
          render={({ field: { onChange, onBlur, value } }) => (
            <Input
              label="Relationship *"
              placeholder="e.g., Mother, Friend, Colleague"
              value={value}
              onChangeText={onChange}
              onBlur={onBlur}
              error={errors.relationship?.message}
              autoCapitalize="words"
            />
          )}
        />

        <Text style={styles.sectionTitle}>Birthday (Optional)</Text>
        <Text style={styles.sectionSubtitle}>
          Year is optional - we'll use it to calculate age if provided
        </Text>

        <View style={styles.row}>
          <Controller
            control={control}
            name="birthdayMonth"
            rules={{
              validate: (value) => {
                if (!value) return true;
                const month = parseInt(value);
                if (isNaN(month) || month < 1 || month > 12) {
                  return 'Invalid month (1-12)';
                }
                return true;
              },
            }}
            render={({ field: { onChange, onBlur, value } }) => (
              <View style={styles.dateInput}>
                <Input
                  label="Month"
                  placeholder="MM"
                  value={value}
                  onChangeText={onChange}
                  onBlur={onBlur}
                  error={errors.birthdayMonth?.message}
                  keyboardType="number-pad"
                  maxLength={2}
                />
              </View>
            )}
          />

          <Controller
            control={control}
            name="birthdayDay"
            rules={{
              validate: (value) => {
                if (!value) return true;
                const day = parseInt(value);
                const month = parseInt(birthdayMonth || '1');
                if (isNaN(day)) {
                  return 'Invalid day';
                }
                if (!isValidBirthday(month, day)) {
                  return 'Invalid date';
                }
                return true;
              },
            }}
            render={({ field: { onChange, onBlur, value } }) => (
              <View style={styles.dateInput}>
                <Input
                  label="Day"
                  placeholder="DD"
                  value={value}
                  onChangeText={onChange}
                  onBlur={onBlur}
                  error={errors.birthdayDay?.message}
                  keyboardType="number-pad"
                  maxLength={2}
                />
              </View>
            )}
          />

          <Controller
            control={control}
            name="birthdayYear"
            rules={{
              validate: (value) => {
                if (!value) return true;
                const year = parseInt(value);
                if (isNaN(year) || year < 1900 || year > new Date().getFullYear()) {
                  return 'Invalid year';
                }
                return true;
              },
            }}
            render={({ field: { onChange, onBlur, value } }) => (
              <View style={styles.yearInput}>
                <Input
                  label="Year (Optional)"
                  placeholder="YYYY"
                  value={value}
                  onChangeText={onChange}
                  onBlur={onBlur}
                  error={errors.birthdayYear?.message}
                  keyboardType="number-pad"
                  maxLength={4}
                />
              </View>
            )}
          />
        </View>

        <Controller
          control={control}
          name="notes"
          render={({ field: { onChange, onBlur, value } }) => (
            <Input
              label="Notes (Optional)"
              placeholder="Clothing size, favorite colors, interests..."
              value={value}
              onChangeText={onChange}
              onBlur={onBlur}
              multiline
              numberOfLines={4}
              style={styles.notesInput}
            />
          )}
        />

        <Button
          title={person ? 'Update Person' : 'Add Person'}
          onPress={handleSubmit(handleFormSubmit)}
          loading={loading}
          style={styles.submitButton}
        />
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.surface,
  },
  form: {
    padding: theme.spacing.xl,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: theme.colors.text.primary,
    marginTop: theme.spacing.sm,
    marginBottom: theme.spacing.xs,
  },
  sectionSubtitle: {
    fontSize: 12,
    color: theme.colors.text.secondary,
    marginBottom: theme.spacing.md,
  },
  row: {
    flexDirection: 'row',
    gap: theme.spacing.sm,
  },
  dateInput: {
    flex: 1,
  },
  yearInput: {
    flex: 1.5,
  },
  notesInput: {
    height: 100,
    textAlignVertical: 'top',
  },
  submitButton: {
    marginTop: theme.spacing.sm,
  },
});
