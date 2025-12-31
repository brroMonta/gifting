// ShareLinkModal Component - Modal for sharing gift map
import React, { useState } from 'react';
import { View, Text, Modal, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { Button } from '../ui/Button';
import { formatShareUrl, copyToClipboard } from '../../services/shareLink.service';

interface ShareLinkModalProps {
  visible: boolean;
  shareToken: string | null;
  personName: string;
  onClose: () => void;
  onDisableSharing: () => Promise<void>;
}

export const ShareLinkModal: React.FC<ShareLinkModalProps> = ({
  visible,
  shareToken,
  personName,
  onClose,
  onDisableSharing,
}) => {
  const [copying, setCopying] = useState(false);
  const [disabling, setDisabling] = useState(false);

  const shareUrl = shareToken ? formatShareUrl(shareToken) : '';

  const handleCopy = async () => {
    setCopying(true);
    try {
      await copyToClipboard(shareUrl);
      Alert.alert('Copied!', 'Share link copied to clipboard');
    } catch (error) {
      Alert.alert('Error', 'Failed to copy link. Please copy manually.');
    } finally {
      setCopying(false);
    }
  };

  const handleDisableSharing = async () => {
    Alert.alert(
      'Disable Sharing',
      'Are you sure you want to stop sharing this gift map? The current link will stop working.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Disable',
          style: 'destructive',
          onPress: async () => {
            setDisabling(true);
            try {
              await onDisableSharing();
              onClose();
            } catch (error: any) {
              Alert.alert('Error', error.message || 'Failed to disable sharing');
            } finally {
              setDisabling(false);
            }
          },
        },
      ]
    );
  };

  return (
    <Modal visible={visible} animationType="slide" transparent presentationStyle="overFullScreen">
      <View style={styles.overlay}>
        <View style={styles.modal}>
          <View style={styles.header}>
            <Text style={styles.title}>Share Gift Map</Text>
            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
              <Text style={styles.closeButtonText}>✕</Text>
            </TouchableOpacity>
          </View>

          <Text style={styles.subtitle}>Gift map for {personName}</Text>

          <View style={styles.infoBox}>
            <Text style={styles.infoTitle}>How it works:</Text>
            <Text style={styles.infoText}>
              • Share this link with family and friends{'\n'}
              • They can view your gift ideas (no login required){'\n'}
              • They can "Reserve" items to avoid duplicates{'\n'}
              • You'll see items are reserved, but not who reserved them (surprise-safe!)
            </Text>
          </View>

          <View style={styles.linkContainer}>
            <Text style={styles.linkLabel}>Share Link:</Text>
            <View style={styles.linkBox}>
              <Text style={styles.link} numberOfLines={2}>
                {shareUrl}
              </Text>
            </View>
          </View>

          <View style={styles.actions}>
            <Button
              title={copying ? 'Copying...' : 'Copy Link'}
              onPress={handleCopy}
              loading={copying}
              style={styles.button}
            />
            <Button
              title="Disable Sharing"
              onPress={handleDisableSharing}
              loading={disabling}
              variant="outline"
              style={styles.button}
            />
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modal: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 24,
    paddingBottom: 40,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#1e293b',
  },
  closeButton: {
    padding: 4,
  },
  closeButtonText: {
    fontSize: 24,
    color: '#64748b',
  },
  subtitle: {
    fontSize: 14,
    color: '#64748b',
    marginBottom: 20,
  },
  infoBox: {
    backgroundColor: '#f0f9ff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
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
  linkContainer: {
    marginBottom: 20,
  },
  linkLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1e293b',
    marginBottom: 8,
  },
  linkBox: {
    backgroundColor: '#f1f5f9',
    borderRadius: 8,
    padding: 12,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  link: {
    fontSize: 13,
    color: '#6366f1',
    fontFamily: 'monospace',
  },
  actions: {
    gap: 12,
  },
  button: {
    width: '100%',
  },
});
