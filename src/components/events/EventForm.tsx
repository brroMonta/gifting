// EventForm Component - Form for adding/editing gift events
import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Platform } from 'react-native';
import { useForm, Controller } from 'react-hook-form';
import { Input } from '../ui/Input';
import { Button } from '../ui/Button';
import { CreateGiftEventInput } from '../../types/giftEvent';
import { EVENT_TYPES, EVENT_STATUSES } from '../../utils/constants';

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

  return (
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

      {/* Event Date - Simple text input for now */}
      <Controller
        control={control}
        name="eventDate"
        rules={{ required: 'Event date is required' }}
        render={({ field: { onChange, onBlur, value } }) => (
          <Input
            label="Event Date *"
            placeholder="YYYY-MM-DD"
            value={value instanceof Date ? value.toISOString().split('T')[0] : value}
            onChangeText={(text) => {
              try {
                const date = new Date(text);
                if (!isNaN(date.getTime())) {
                  onChange(date);
                }
              } catch (e) {
                // Invalid date, ignore
              }
            }}
            onBlur={onBlur}
            error={errors.eventDate?.message}
          />
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
  );
};

const styles = StyleSheet.create({
  form: {
    padding: 20,
  },
  fieldContainer: {
    marginBottom: 20,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1e293b',
    marginBottom: 8,
  },
  optionsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  optionButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    backgroundColor: '#fff',
  },
  optionButtonSelected: {
    backgroundColor: '#6366f1',
    borderColor: '#6366f1',
  },
  optionText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#64748b',
    textTransform: 'capitalize',
  },
  optionTextSelected: {
    color: '#fff',
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
    color: '#1e293b',
    marginBottom: 4,
  },
  toggleDescription: {
    fontSize: 13,
    color: '#64748b',
  },
  toggle: {
    width: 51,
    height: 31,
    borderRadius: 16,
    backgroundColor: '#e2e8f0',
    justifyContent: 'center',
    paddingHorizontal: 2,
  },
  toggleActive: {
    backgroundColor: '#6366f1',
  },
  toggleThumb: {
    width: 27,
    height: 27,
    borderRadius: 14,
    backgroundColor: '#fff',
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
