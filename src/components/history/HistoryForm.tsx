// HistoryForm Component - Form for adding/editing gift history
import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useForm, Controller } from 'react-hook-form';
import { Input } from '../ui/Input';
import { Button } from '../ui/Button';
import { getUrlError } from '../../utils/validation';

interface HistoryFormData {
  personId: string;
  personName: string;
  giftName: string;
  direction: 'gave' | 'received';
  date: Date;
  notes?: string;
  link?: string;
}

interface HistoryFormProps {
  initialData?: Partial<HistoryFormData>;
  onSubmit: (data: HistoryFormData) => Promise<void>;
  loading?: boolean;
  onCancel?: () => void;
  personId?: string;
  personName?: string;
}

export const HistoryForm: React.FC<HistoryFormProps> = ({
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
    formState: { errors },
  } = useForm<HistoryFormData>({
    defaultValues: {
      personId: initialData?.personId || personId || '',
      personName: initialData?.personName || personName || '',
      giftName: initialData?.giftName || '',
      direction: initialData?.direction || 'gave',
      date: initialData?.date || new Date(),
      notes: initialData?.notes || '',
      link: initialData?.link || '',
    },
  });

  const [selectedDirection, setSelectedDirection] = useState<'gave' | 'received'>(
    initialData?.direction || 'gave'
  );

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
              placeholder="Who is this gift for/from?"
              value={value}
              onChangeText={onChange}
              onBlur={onBlur}
              error={errors.personName?.message}
            />
          )}
        />
      )}

      {/* Gift Name */}
      <Controller
        control={control}
        name="giftName"
        rules={{ required: 'Gift name is required' }}
        render={({ field: { onChange, onBlur, value } }) => (
          <Input
            label="Gift Name *"
            placeholder="e.g., Blue sweater, Cookbook, etc."
            value={value}
            onChangeText={onChange}
            onBlur={onBlur}
            error={errors.giftName?.message}
          />
        )}
      />

      {/* Direction (Gave/Received) */}
      <View style={styles.fieldContainer}>
        <Text style={styles.label}>Direction *</Text>
        <View style={styles.optionsRow}>
          <Controller
            control={control}
            name="direction"
            render={({ field: { onChange } }) => (
              <>
                <TouchableOpacity
                  style={[
                    styles.optionButton,
                    selectedDirection === 'gave' && styles.optionButtonSelected,
                  ]}
                  onPress={() => {
                    setSelectedDirection('gave');
                    onChange('gave');
                  }}
                >
                  <Text
                    style={[
                      styles.optionText,
                      selectedDirection === 'gave' && styles.optionTextSelected,
                    ]}
                  >
                    Gave (I gave this)
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[
                    styles.optionButton,
                    selectedDirection === 'received' && styles.optionButtonSelected,
                  ]}
                  onPress={() => {
                    setSelectedDirection('received');
                    onChange('received');
                  }}
                >
                  <Text
                    style={[
                      styles.optionText,
                      selectedDirection === 'received' && styles.optionTextSelected,
                    ]}
                  >
                    Received (They gave me this)
                  </Text>
                </TouchableOpacity>
              </>
            )}
          />
        </View>
      </View>

      {/* Date */}
      <Controller
        control={control}
        name="date"
        rules={{ required: 'Date is required' }}
        render={({ field: { onChange, onBlur, value } }) => (
          <Input
            label="Date *"
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
            error={errors.date?.message}
          />
        )}
      />

      {/* Product Link */}
      <Controller
        control={control}
        name="link"
        rules={{ validate: (value) => !value || getUrlError(value) || true }}
        render={({ field: { onChange, onBlur, value } }) => (
          <Input
            label="Product Link (Optional)"
            placeholder="https://example.com/product"
            value={value}
            onChangeText={onChange}
            onBlur={onBlur}
            error={errors.link?.message}
            keyboardType="url"
            autoCapitalize="none"
          />
        )}
      />

      {/* Notes */}
      <Controller
        control={control}
        name="notes"
        render={({ field: { onChange, onBlur, value } }) => (
          <Input
            label="Notes (Optional)"
            placeholder="Any additional details..."
            value={value}
            onChangeText={onChange}
            onBlur={onBlur}
            multiline
            numberOfLines={3}
            style={styles.notesInput}
          />
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
          title={initialData ? 'Update' : 'Add to History'}
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
  },
  optionTextSelected: {
    color: '#fff',
  },
  notesInput: {
    height: 80,
    textAlignVertical: 'top',
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
