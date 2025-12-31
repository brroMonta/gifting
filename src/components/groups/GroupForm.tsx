// GroupForm Component - Form for adding/editing groups
import React from 'react';
import { View, StyleSheet } from 'react-native';
import { useForm, Controller } from 'react-hook-form';
import { Input } from '../ui/Input';
import { Button } from '../ui/Button';

interface GroupFormData {
  name: string;
}

interface GroupFormProps {
  initialData?: Partial<GroupFormData>;
  onSubmit: (data: GroupFormData) => Promise<void>;
  loading?: boolean;
  onCancel?: () => void;
}

export const GroupForm: React.FC<GroupFormProps> = ({
  initialData,
  onSubmit,
  loading = false,
  onCancel,
}) => {
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<GroupFormData>({
    defaultValues: initialData || {
      name: '',
    },
  });

  return (
    <View style={styles.form}>
      <Controller
        control={control}
        name="name"
        rules={{ required: 'Group name is required' }}
        render={({ field: { onChange, onBlur, value } }) => (
          <Input
            label="Group Name *"
            placeholder="e.g., Family, Friends, Coworkers"
            value={value}
            onChangeText={onChange}
            onBlur={onBlur}
            error={errors.name?.message}
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
          title={initialData ? 'Update' : 'Create Group'}
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
  buttons: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 8,
  },
  button: {
    flex: 1,
  },
});
