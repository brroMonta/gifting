// GiftItemForm Component - Form for adding/editing gift items
import React from 'react';
import { View, StyleSheet } from 'react-native';
import { useForm, Controller } from 'react-hook-form';
import { Input } from '../ui/Input';
import { Button } from '../ui/Button';
import { getUrlError } from '../../utils/validation';

interface GiftItemFormData {
  name: string;
  url?: string;
  notes?: string;
}

interface GiftItemFormProps {
  initialData?: GiftItemFormData;
  onSubmit: (data: GiftItemFormData) => Promise<void>;
  loading?: boolean;
  onCancel?: () => void;
}

export const GiftItemForm: React.FC<GiftItemFormProps> = ({
  initialData,
  onSubmit,
  loading = false,
  onCancel,
}) => {
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<GiftItemFormData>({
    defaultValues: initialData || {
      name: '',
      url: '',
      notes: '',
    },
  });

  return (
    <View style={styles.form}>
      <Controller
        control={control}
        name="name"
        rules={{ required: 'Item name is required' }}
        render={({ field: { onChange, onBlur, value } }) => (
          <Input
            label="Item Name *"
            placeholder="e.g., Blue sweater, Book, etc."
            value={value}
            onChangeText={onChange}
            onBlur={onBlur}
            error={errors.name?.message}
          />
        )}
      />

      <Controller
        control={control}
        name="url"
        rules={{ validate: (value) => getUrlError(value || '') || true }}
        render={({ field: { onChange, onBlur, value } }) => (
          <Input
            label="URL (Optional)"
            placeholder="https://example.com/product"
            value={value}
            onChangeText={onChange}
            onBlur={onBlur}
            error={errors.url?.message}
            keyboardType="url"
            autoCapitalize="none"
          />
        )}
      />

      <Controller
        control={control}
        name="notes"
        render={({ field: { onChange, onBlur, value } }) => (
          <Input
            label="Notes (Optional)"
            placeholder="Size, color, preferences..."
            value={value}
            onChangeText={onChange}
            onBlur={onBlur}
            multiline
            numberOfLines={3}
            style={styles.notesInput}
          />
        )}
      />

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
          title={initialData ? 'Update' : 'Add Item'}
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
