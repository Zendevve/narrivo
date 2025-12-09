/**
 * ProGate Component
 *
 * Wraps Pro-only features. Shows upgrade prompt for free users.
 */

import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Modal,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useProStore, ProFeature, PRO_FEATURES } from '../store/proStore';
import { colors, spacing, borderRadius, typography } from '../theme';

interface ProGateProps {
  feature: ProFeature;
  children: React.ReactNode;
  /** If true, shows inline upgrade prompt instead of modal */
  inline?: boolean;
  /** Custom message for the upgrade prompt */
  message?: string;
}

const FEATURE_NAMES: Record<ProFeature, string> = {
  [PRO_FEATURES.READ_ALONG]: 'Read-Along Mode',
  [PRO_FEATURES.UNLIMITED_BOOKMARKS]: 'Unlimited Bookmarks',
  [PRO_FEATURES.SLEEP_TIMER]: 'Sleep Timer',
  [PRO_FEATURES.PLAYBACK_SPEED]: 'Playback Speed Control',
  [PRO_FEATURES.CHAPTER_NAVIGATION]: 'Chapter Navigation',
};

export const ProGate: React.FC<ProGateProps> = ({
  feature,
  children,
  inline = false,
  message
}) => {
  const isPro = useProStore((s) => s.isPro);
  const [showUpgrade, setShowUpgrade] = React.useState(false);

  // Pro users get full access
  if (isPro) {
    return <>{children}</>;
  }

  const featureName = FEATURE_NAMES[feature] || 'This feature';
  const defaultMessage = `${featureName} is a Pro feature. Upgrade once to unlock all premium features forever!`;

  // Inline upgrade prompt
  if (inline) {
    return (
      <View style={styles.inlineContainer}>
        <Text style={styles.inlineIcon}>✨</Text>
        <Text style={styles.inlineText}>{message || defaultMessage}</Text>
        <TouchableOpacity
          style={styles.inlineButton}
          onPress={() => setShowUpgrade(true)}
        >
          <Text style={styles.inlineButtonText}>Upgrade to Pro</Text>
        </TouchableOpacity>
        <UpgradeModal
          visible={showUpgrade}
          onClose={() => setShowUpgrade(false)}
        />
      </View>
    );
  }

  // Wrap with tap-to-upgrade
  return (
    <>
      <TouchableOpacity onPress={() => setShowUpgrade(true)}>
        <View style={styles.lockedOverlay}>
          {children}
          <View style={styles.lockBadge}>
            <Text style={styles.lockIcon}>🔒</Text>
            <Text style={styles.lockText}>PRO</Text>
          </View>
        </View>
      </TouchableOpacity>
      <UpgradeModal
        visible={showUpgrade}
        onClose={() => setShowUpgrade(false)}
      />
    </>
  );
};

/**
 * Upgrade Modal Component
 */
interface UpgradeModalProps {
  visible: boolean;
  onClose: () => void;
}

export const UpgradeModal: React.FC<UpgradeModalProps> = ({ visible, onClose }) => {
  const unlockPro = useProStore((s) => s.unlockPro);

  const handlePurchase = () => {
    // TODO: Integrate with actual payment (RevenueCat, Stripe, etc.)
    // For now, just unlock directly for testing
    unlockPro();
    onClose();
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          {/* Header */}
          <View style={styles.header}>
            <Text style={styles.proIcon}>✨</Text>
            <Text style={styles.title}>Upgrade to Pro</Text>
            <Text style={styles.subtitle}>One-time purchase. Yours forever.</Text>
          </View>

          {/* Features List */}
          <View style={styles.featuresList}>
            <FeatureRow icon="📖" text="Read-Along Mode" />
            <FeatureRow icon="🔖" text="Unlimited Bookmarks" />
            <FeatureRow icon="🌙" text="Sleep Timer" />
            <FeatureRow icon="⚡" text="Playback Speed Control" />
            <FeatureRow icon="📑" text="Chapter Navigation" />
          </View>

          {/* Price */}
          <View style={styles.priceContainer}>
            <Text style={styles.priceLabel}>One-time payment</Text>
            <Text style={styles.price}>$4.99</Text>
            <Text style={styles.priceNote}>No subscriptions. No hidden fees.</Text>
          </View>

          {/* Buttons */}
          <TouchableOpacity style={styles.purchaseButton} onPress={handlePurchase}>
            <Text style={styles.purchaseButtonText}>Unlock Pro Forever</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.cancelButton} onPress={onClose}>
            <Text style={styles.cancelButtonText}>Maybe Later</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

const FeatureRow: React.FC<{ icon: string; text: string }> = ({ icon, text }) => (
  <View style={styles.featureRow}>
    <Text style={styles.featureIcon}>{icon}</Text>
    <Text style={styles.featureText}>{text}</Text>
  </View>
);

/**
 * Simple Pro Badge for UI
 */
export const ProBadge: React.FC = () => {
  const isPro = useProStore((s) => s.isPro);

  if (!isPro) return null;

  return (
    <View style={styles.proBadge}>
      <Text style={styles.proBadgeText}>PRO</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  // Inline styles
  inlineContainer: {
    backgroundColor: colors.card,
    borderRadius: borderRadius.md,
    padding: spacing.lg,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.lime,
    borderStyle: 'dashed',
  },
  inlineIcon: {
    fontSize: 32,
    marginBottom: spacing.sm,
  },
  inlineText: {
    ...typography.body,
    color: colors.gray,
    textAlign: 'center',
    marginBottom: spacing.md,
  },
  inlineButton: {
    backgroundColor: colors.lime,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm,
    borderRadius: borderRadius.md,
  },
  inlineButtonText: {
    ...typography.label,
    color: colors.black,
    fontWeight: '700',
  },

  // Locked overlay
  lockedOverlay: {
    position: 'relative',
    opacity: 0.7,
  },
  lockBadge: {
    position: 'absolute',
    top: 4,
    right: 4,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.card,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: borderRadius.sm,
    borderWidth: 1,
    borderColor: colors.lime,
  },
  lockIcon: {
    fontSize: 10,
    marginRight: 2,
  },
  lockText: {
    fontSize: 9,
    fontWeight: '700',
    color: colors.lime,
  },

  // Modal
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.85)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: spacing.lg,
  },
  modalContent: {
    backgroundColor: colors.card,
    borderRadius: borderRadius.lg,
    padding: spacing.xl,
    width: '100%',
    maxWidth: 340,
    borderWidth: 2,
    borderColor: colors.lime,
  },
  header: {
    alignItems: 'center',
    marginBottom: spacing.lg,
  },
  proIcon: {
    fontSize: 48,
    marginBottom: spacing.sm,
  },
  title: {
    ...typography.h1,
    color: colors.white,
  },
  subtitle: {
    ...typography.label,
    color: colors.gray,
  },

  // Features
  featuresList: {
    marginBottom: spacing.lg,
  },
  featureRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: spacing.sm,
  },
  featureIcon: {
    fontSize: 18,
    marginRight: spacing.md,
  },
  featureText: {
    ...typography.body,
    color: colors.white,
  },

  // Price
  priceContainer: {
    alignItems: 'center',
    marginBottom: spacing.lg,
    paddingVertical: spacing.md,
    backgroundColor: `${colors.lime}15`,
    borderRadius: borderRadius.md,
  },
  priceLabel: {
    ...typography.label,
    color: colors.gray,
  },
  price: {
    fontSize: 36,
    fontWeight: '900',
    color: colors.lime,
  },
  priceNote: {
    ...typography.small,
    color: colors.gray,
  },

  // Buttons
  purchaseButton: {
    backgroundColor: colors.lime,
    paddingVertical: spacing.md,
    borderRadius: borderRadius.md,
    marginBottom: spacing.sm,
  },
  purchaseButtonText: {
    ...typography.body,
    color: colors.black,
    fontWeight: '700',
    textAlign: 'center',
  },
  cancelButton: {
    paddingVertical: spacing.sm,
  },
  cancelButtonText: {
    ...typography.label,
    color: colors.gray,
    textAlign: 'center',
  },

  // Pro Badge
  proBadge: {
    backgroundColor: colors.lime,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: borderRadius.sm,
  },
  proBadgeText: {
    fontSize: 10,
    fontWeight: '900',
    color: colors.black,
  },
});
