// GiftItemForm Component - Form for adding/editing gift items
import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Text, Image, ActivityIndicator } from 'react-native';
import { useForm, Controller } from 'react-hook-form';
import { Input } from '../ui/Input';
import { Button } from '../ui/Button';
import { getUrlError } from '../../utils/validation';
import { fetchUrlMetadata, isValidUrl } from '../../services/urlMetadata.service';
import { theme } from '../../styles/theme';

interface GiftItemFormData {
  name: string;
  url?: string;
  imageUrl?: string;
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
  const [urlMetadata, setUrlMetadata] = useState<{ imageUrl?: string; title?: string } | null>(
    initialData?.imageUrl ? { imageUrl: initialData.imageUrl } : null
  );
  const [fetchingMetadata, setFetchingMetadata] = useState(false);

  const {
    control,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<GiftItemFormData>({
    defaultValues: initialData || {
      name: '',
      url: '',
      imageUrl: '',
      notes: '',
    },
  });

  const urlValue = watch('url');

  // Fetch URL metadata when URL changes (with debounce)
  useEffect(() => {
    const fetchMetadata = async () => {
      if (!urlValue || !isValidUrl(urlValue)) {
        setUrlMetadata(null);
        setValue('imageUrl', '');
        return;
      }

      setFetchingMetadata(true);
      try {
        const metadata = await fetchUrlMetadata(urlValue);
        if (metadata?.image) {
          setUrlMetadata({ imageUrl: metadata.image, title: metadata.title });
          setValue('imageUrl', metadata.image);

          // Auto-fill name if empty and title is available
          const currentName = watch('name');
          if (!currentName && metadata.title) {
            setValue('name', metadata.title);
          }
        } else {
          setUrlMetadata(null);
          setValue('imageUrl', '');
        }
      } catch (error) {
        console.error('Failed to fetch URL metadata:', error);
        setUrlMetadata(null);
        setValue('imageUrl', '');
      } finally {
        setFetchingMetadata(false);
      }
    };

    // Debounce the fetch
    const timeoutId = setTimeout(fetchMetadata, 800);
    return () => clearTimeout(timeoutId);
  }, [urlValue]);

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
          <View>
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
            {fetchingMetadata && (
              <View style={styles.metadataLoading}>
                <ActivityIndicator size="small" color={theme.colors.primary[600]} />
                <Text style={styles.metadataLoadingText}>Fetching preview...</Text>
              </View>
            )}
            {urlMetadata?.imageUrl && !fetchingMetadata && (
              <View style={styles.imagePreview}>
                <Image
                  source={{ uri: urlMetadata.imageUrl }}
                  style={styles.previewImage}
                  resizeMode="cover"
                />
                <Text style={styles.imagePreviewLabel}>Preview</Text>
              </View>
            )}
          </View>
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
  metadataLoading: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.sm,
    marginTop: theme.spacing.sm,
    paddingHorizontal: theme.spacing.md,
  },
  metadataLoadingText: {
    fontSize: 13,
    color: theme.colors.text.secondary,
    fontStyle: 'italic',
  },
  imagePreview: {
    marginTop: theme.spacing.md,
    borderRadius: theme.borderRadius.lg,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: theme.colors.accent[300],
    ...theme.shadows.sm,
  },
  previewImage: {
    width: '100%',
    height: 180,
    backgroundColor: theme.colors.neutral[100],
  },
  imagePreviewLabel: {
    position: 'absolute',
    top: theme.spacing.sm,
    right: theme.spacing.sm,
    backgroundColor: theme.colors.accent[500],
    color: theme.colors.text.inverse,
    paddingHorizontal: theme.spacing.sm,
    paddingVertical: 4,
    borderRadius: theme.borderRadius.sm,
    fontSize: 11,
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
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
