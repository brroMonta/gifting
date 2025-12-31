// EventForm Component - Form for adding/editing gift events
import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Platform, KeyboardAvoidingView, ScrollView } from 'react-native';
import { useForm, Controller } from 'react-hook-form';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Input } from '../ui/Input';
import { Button } from '../ui/Button';
import { CreateGiftEventInput } from '../../types/giftEvent';
import { EVENT_TYPES, EVENT_STATUSES } from '../../utils/constants';
import { theme } from '../../styles/theme';

interface EventFormData {
  personId: string;
  personName: string;
  eventType: 'birthday' | 'holiday' | 'anniversary' | 'custom';
  eventDate: Date;
  status: 'idea' | 'shopping' | 'bought' | 'delivered';
  remindersEnabled: boolean;
  notes?: string;
}

interface EventFormProps {
  initialData?: Partial<EventFormData>;
  onSubmit: (data: EventFormData) => Promise<void>;
  loading?: boolean;
  onCancel?: () => void;
  personId?: string;
  personName?: string;
}

export const EventForm: React.FC<EventFormProps> = ({
  initialData,
  onSubmit,
  loading = false,
  onCancel,
  personId,
  personName,
}) => {
  const {
    control,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<EventFormData>({
    defaultValues: {
      personId: initialData?.personId || personId || '',
      personName: initialData?.personName || personName || '',
      eventType: initialData?.eventType || 'birthday',
      eventDate: initialData?.eventDate || new Date(),
      status: initialData?.status || 'idea',
      remindersEnabled: initialData?.remindersEnabled !== undefined ? initialData.remindersEnabled : true,
      notes: initialData?.notes || '',
    },
  });

  const [selectedEventType, setSelectedEventType] = useState(initialData?.eventType || 'birthday');
  const [selectedStatus, setSelectedStatus] = useState(initialData?.status || 'idea');
  const [showDatePicker, setShowDatePicker] = useState(false);

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <ScrollView style={styles.scrollView} keyboardShouldPersistTaps="handled">
        <View style={styles.form}>
      {/* Person Name (if not pre-filled) */}
      {!personId && (
        <Controller
          control={control}
          name="personName"
          rules={{ required: 'Person name is required' }}
          render={({ field: { onChange, onBlur, value } }) => (
            <Input
              label="Person Name *"
              placeholder="Who is this event for?"
              value={value}
              onChangeText={onChange}
              onBlur={onBlur}
              error={errors.personName?.message}
            />
          )}
        />
      )}

      {/* Event Type */}
      <View style={styles.fieldContainer}>
        <Text style={styles.label}>Event Type *</Text>
        <View style={styles.optionsRow}>
          {EVENT_TYPES.map((type) => (
            <Controller
              key={type}
              control={control}
              name="eventType"
              render={({ field: { onChange } }) => (
                <TouchableOpacity
                  style={[
                    styles.optionButton,
                    selectedEventType === type && styles.optionButtonSelected,
                  ]}
                  onPress={() => {
                    setSelectedEventType(type);
                    onChange(type);
                  }}
                >
                  <Text
                    style={[
                      styles.optionText,
                      selectedEventType === type && styles.optionTextSelected,
                    ]}
                  >
                    {type}
                  </Text>
                </TouchableOpacity>
              )}
            />
          ))}
        </View>
      </View>

      {/* Event Date - Calendar Picker */}
      <Controller
        control={control}
        name="eventDate"
        rules={{ required: 'Event date is required' }}
        render={({ field: { onChange, value } }) => (
          <View style={styles.datePickerContainer}>
            <Text style={styles.label}>Event Date *</Text>
            <TouchableOpacity
              style={styles.datePickerButton}
              onPress={() => setShowDatePicker(true)}
            >
              <Text style={styles.datePickerText}>
                {value instanceof Date ? value.toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                }) : 'Select Date'}
              </Text>
              <Text style={styles.datePickerIcon}>📅</Text>
            </TouchableOpacity>
            {(showDatePicker || Platform.OS === 'android') && (
              <DateTimePicker
                value={value instanceof Date ? value : new Date()}
                mode="date"
                display={Platform.OS === 'ios' ? 'spinner' : 'default'}
                onChange={(event, selectedDate) => {
                  if (Platform.OS === 'android') {
                    setShowDatePicker(false);
                  }
                  if (selectedDate) {
                    onChange(selectedDate);
                  }
                }}
                minimumDate={new Date()}
              />
            )}
            {showDatePicker && Platform.OS === 'ios' && (
              <TouchableOpacity
                style={styles.datePickerDone}
                onPress={() => setShowDatePicker(false)}
              >
                <Text style={styles.datePickerDoneText}>Done</Text>
              </TouchableOpacity>
            )}
            {errors.eventDate && (
              <Text style={styles.errorText}>{errors.eventDate.message}</Text>
            )}
          </View>
        )}
      />

      {/* Status */}
      <View style={styles.fieldContainer}>
        <Text style={styles.label}>Status *</Text>
        <View style={styles.optionsRow}>
          {EVENT_STATUSES.map((status) => (
            <Controller
              key={status}
              control={control}
              name="status"
              render={({ field: { onChange } }) => (
                <TouchableOpacity
                  style={[
                    styles.optionButton,
                    selectedStatus === status && styles.optionButtonSelected,
                  ]}
                  onPress={() => {
                    setSelectedStatus(status);
                    onChange(status);
                  }}
                >
                  <Text
                    style={[
                      styles.optionText,
                      selectedStatus === status && styles.optionTextSelected,
                    ]}
                  >
                    {status}
                  </Text>
                </TouchableOpacity>
              )}
            />
          ))}
        </View>
      </View>

      {/* Notes */}
      <Controller
        control={control}
        name="notes"
        render={({ field: { onChange, onBlur, value } }) => (
          <Input
            label="Notes (Optional)"
            placeholder="Gift ideas, preferences, etc."
            value={value}
            onChangeText={onChange}
            onBlur={onBlur}
            multiline
            numberOfLines={3}
            style={styles.notesInput}
          />
        )}
      />

      {/* Reminders Toggle */}
      <Controller
        control={control}
        name="remindersEnabled"
        render={({ field: { onChange, value } }) => (
          <TouchableOpacity
            style={styles.toggleRow}
            onPress={() => onChange(!value)}
          >
            <View style={styles.toggleInfo}>
              <Text style={styles.toggleLabel}>Enable Reminders</Text>
              <Text style={styles.toggleDescription}>
                Get notified 30, 7, and 1 day before
              </Text>
            </View>
            <View style={[styles.toggle, value && styles.toggleActive]}>
              <View style={[styles.toggleThumb, value && styles.toggleThumbActive]} />
            </View>
          </TouchableOpacity>
        )}
      />

      {/* Buttons */}
      <View style={styles.buttons}>
        {onCancel && (
          <Button
            title="Cancel"
            onPress={onCancel}
            variant="outline"
            style={styles.button}
          />
        )}
        <Button
          title={initialData ? 'Update' : 'Create Event'}
          onPress={handleSubmit(onSubmit)}
          loading={loading}
          style={styles.button}
        />
      </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  form: {
    padding: 20,
  },
  fieldContainer: {
    marginBottom: 20,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: theme.colors.text.primary,
    marginBottom: 8,
  },
  datePickerContainer: {
    marginBottom: 20,
  },
  datePickerButton: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: theme.colors.surface,
    borderWidth: 1,
    borderColor: theme.colors.border,
    borderRadius: theme.borderRadius.md,
    paddingHorizontal: theme.spacing.lg,
    paddingVertical: theme.spacing.lg,
    minHeight: 56,
  },
  datePickerText: {
    fontSize: 16,
    color: theme.colors.text.primary,
    fontWeight: '400',
  },
  datePickerIcon: {
    fontSize: 20,
  },
  datePickerDone: {
    alignSelf: 'flex-end',
    backgroundColor: theme.colors.primary[600],
    paddingHorizontal: theme.spacing.xl,
    paddingVertical: theme.spacing.sm,
    borderRadius: theme.borderRadius.md,
    marginTop: theme.spacing.md,
  },
  datePickerDoneText: {
    color: theme.colors.text.inverse,
    fontSize: 16,
    fontWeight: '600',
  },
  errorText: {
    color: theme.colors.error[500],
    fontSize: 13,
    marginTop: theme.spacing.xs,
  },
  optionsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  optionButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: theme.borderRadius.md,
    borderWidth: 1,
    borderColor: theme.colors.border,
    backgroundColor: theme.colors.surface,
  },
  optionButtonSelected: {
    backgroundColor: theme.colors.primary[600],
    borderColor: theme.colors.primary[600],
  },
  optionText: {
    fontSize: 14,
    fontWeight: '500',
    color: theme.colors.text.secondary,
    textTransform: 'capitalize',
  },
  optionTextSelected: {
    color: theme.colors.text.inverse,
  },
  notesInput: {
    height: 80,
    textAlignVertical: 'top',
  },
  toggleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
    marginBottom: 20,
  },
  toggleInfo: {
    flex: 1,
  },
  toggleLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: theme.colors.text.primary,
    marginBottom: 4,
  },
  toggleDescription: {
    fontSize: 13,
    color: theme.colors.text.secondary,
  },
  toggle: {
    width: 51,
    height: 31,
    borderRadius: 16,
    backgroundColor: theme.colors.neutral[200],
    justifyContent: 'center',
    paddingHorizontal: 2,
  },
  toggleActive: {
    backgroundColor: theme.colors.primary[600],
  },
  toggleThumb: {
    width: 27,
    height: 27,
    borderRadius: 14,
    backgroundColor: theme.colors.surface,
  },
  toggleThumbActive: {
    marginLeft: 'auto',
  },
  buttons: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 8,
  },
  button: {
    flex: 1,
  },
});
