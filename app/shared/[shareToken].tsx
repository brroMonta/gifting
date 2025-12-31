// Shared Gift Map Screen - Public view (no authentication required)
import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { useGiftMapsStore } from '../../src/store/giftMapsStore';
import { GiftItemCard } from '../../src/components/gift-maps/GiftItemCard';
import { EmptyState } from '../../src/components/ui/EmptyState';
import { GiftMapItem } from '../../src/types/giftMap';

export default function SharedGiftMapScreen() {
  const { shareToken } = useLocalSearchParams<{ shareToken: string }>();
  const { sharedGiftMap, loading, fetchSharedGiftMap, reserveItem, unreserveItem } =
    useGiftMapsStore();

  const [actionLoading, setActionLoading] = useState<string | null>(null);

  useEffect(() => {
    if (shareToken) {
      loadSharedGiftMap();
    }
  }, [shareToken]);

  const loadSharedGiftMap = async () => {
    try {
      await fetchSharedGiftMap(shareToken);
    } catch (error: any) {
      Alert.alert(
        'Error',
        error.message || 'Failed to load gift map. The link may be invalid or disabled.'
      );
    }
  };

  const handleReserve = async (item: GiftMapItem) => {
    setActionLoading(item.id);
    try {
      await reserveItem(shareToken, item.id);
      Alert.alert(
        'Reserved!',
        `You've reserved "${item.name}". The owner will see it's reserved, but not who reserved it.`
      );
    } catch (error: any) {
      Alert.alert('Error', error.message || 'Failed to reserve item');
    } finally {
      setActionLoading(null);
    }
  };

  const handleUnreserve = async (item: GiftMapItem) => {
    Alert.alert(
      'Unreserve Item',
      `Are you sure you want to unreserve "${item.name}"?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Unreserve',
          onPress: async () => {
            setActionLoading(item.id);
            try {
              await unreserveItem(shareToken, item.id);
              Alert.alert('Unreserved', `"${item.name}" is now available again.`);
            } catch (error: any) {
              Alert.alert('Error', error.message || 'Failed to unreserve item');
            } finally {
              setActionLoading(null);
            }
          },
        },
      ]
    );
  };

  if (loading && !sharedGiftMap) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#6366f1" />
        <Text style={styles.loadingText}>Loading gift map...</Text>
      </View>
    );
  }

  if (!sharedGiftMap) {
    return (
      <View style={styles.container}>
        <EmptyState
          title="Gift Map Not Found"
          message="This gift map link may be invalid or has been disabled."
        />
      </View>
    );
  }

  const items = sharedGiftMap.items || [];
  const hasItems = items.length > 0;

  return (
    <View style={styles.container}>
      <ScrollView style={styles.scrollView} contentContainerStyle={styles.content}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>Gift Ideas for {sharedGiftMap.personName}</Text>
          <Text style={styles.subtitle}>
            Reserve items to let others know you're getting them (surprise-safe!)
          </Text>
        </View>

        {/* Info Box */}
        <View style={styles.infoBox}>
          <Text style={styles.infoTitle}>How it works:</Text>
          <Text style={styles.infoText}>
            • Tap "Reserve This" to claim an item{'\n'}
            • The owner will see it's reserved, but not who reserved it{'\n'}
            • You can unreserve if you change your mind{'\n'}
            • No login required!
          </Text>
        </View>

        {/* Gift Items List */}
        {hasItems ? (
          <View style={styles.itemsList}>
            <Text style={styles.sectionTitle}>Gift Ideas ({items.length})</Text>
            {items.map((item) => (
              <GiftItemCard
                key={item.id}
                item={item}
                isOwner={false}
                onReserve={() => handleReserve(item)}
                onUnreserve={() => handleUnreserve(item)}
              />
            ))}
          </View>
        ) : (
          <EmptyState
            title="No Gift Ideas Yet"
            message="The owner hasn't added any gift ideas yet. Check back later!"
          />
        )}

        {/* Footer Note */}
        <View style={styles.footer}>
          <Text style={styles.footerText}>
            💡 This is a private gift map. Only people with this link can see it.
          </Text>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f8fafc',
  },
  loadingText: {
    marginTop: 12,
    fontSize: 16,
    color: '#64748b',
  },
  scrollView: {
    flex: 1,
  },
  content: {
    padding: 20,
  },
  header: {
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1e293b',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
    color: '#64748b',
  },
  infoBox: {
    backgroundColor: '#f0f9ff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: '#bae6fd',
  },
  infoTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#0369a1',
    marginBottom: 8,
  },
  infoText: {
    fontSize: 13,
    color: '#075985',
    lineHeight: 20,
  },
  itemsList: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1e293b',
    marginBottom: 12,
  },
  footer: {
    padding: 16,
    backgroundColor: '#fff',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  footerText: {
    fontSize: 13,
    color: '#64748b',
    textAlign: 'center',
    lineHeight: 20,
  },
});
