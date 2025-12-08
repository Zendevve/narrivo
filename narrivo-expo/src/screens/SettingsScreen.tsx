import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Switch,
  ScrollView,
  SafeAreaView,
  Linking,
} from 'react-native';
import { colors, spacing, borderRadius, typography } from '../theme';

export const SettingsScreen: React.FC = () => {
  const [darkMode, setDarkMode] = React.useState(true);
  const [autoPlay, setAutoPlay] = React.useState(true);
  const [syncProgress, setSyncProgress] = React.useState(false);

  const appVersion = '1.0.0';

  const openLink = (url: string) => {
    Linking.openURL(url);
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        {/* Header */}
        <Text style={styles.title}>
          Settings<Text style={styles.accent}>.</Text>
        </Text>

        {/* Playback Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Playback</Text>

          <View style={styles.row}>
            <View>
              <Text style={styles.rowLabel}>Auto-Play Next</Text>
              <Text style={styles.rowDesc}>Continue to next chapter automatically</Text>
            </View>
            <Switch
              value={autoPlay}
              onValueChange={setAutoPlay}
              trackColor={{ false: colors.border, true: colors.lime }}
              thumbColor={colors.white}
            />
          </View>
        </View>

        {/* Appearance Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Appearance</Text>

          <View style={styles.row}>
            <View>
              <Text style={styles.rowLabel}>Dark Mode</Text>
              <Text style={styles.rowDesc}>Use dark theme (recommended)</Text>
            </View>
            <Switch
              value={darkMode}
              onValueChange={setDarkMode}
              trackColor={{ false: colors.border, true: colors.lime }}
              thumbColor={colors.white}
            />
          </View>
        </View>

        {/* Storage Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Storage</Text>

          <TouchableOpacity style={styles.row}>
            <View>
              <Text style={styles.rowLabel}>Clear Cache</Text>
              <Text style={styles.rowDesc}>Free up temporary storage</Text>
            </View>
            <Text style={styles.rowAction}>→</Text>
          </TouchableOpacity>

          <View style={styles.row}>
            <View>
              <Text style={styles.rowLabel}>Sync Progress</Text>
              <Text style={styles.rowDesc}>Coming soon: Cloud backup</Text>
            </View>
            <Switch
              value={syncProgress}
              onValueChange={setSyncProgress}
              trackColor={{ false: colors.border, true: colors.lime }}
              thumbColor={colors.white}
              disabled
            />
          </View>
        </View>

        {/* About Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>About</Text>

          <TouchableOpacity style={styles.row} onPress={() => openLink('https://github.com/Zendevve/narrivo')}>
            <Text style={styles.rowLabel}>Source Code</Text>
            <Text style={styles.rowAction}>→</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.row} onPress={() => openLink('https://librivox.org')}>
            <Text style={styles.rowLabel}>LibriVox (Public Domain Audio)</Text>
            <Text style={styles.rowAction}>→</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.row} onPress={() => openLink('https://gutenberg.org')}>
            <Text style={styles.rowLabel}>Project Gutenberg (Public Domain eBooks)</Text>
            <Text style={styles.rowAction}>→</Text>
          </TouchableOpacity>

          <View style={styles.row}>
            <Text style={styles.rowLabel}>Version</Text>
            <Text style={styles.versionText}>{appVersion}</Text>
          </View>
        </View>

        {/* Footer */}
        <View style={styles.footer}>
          <Text style={styles.footerText}>Made with ❤️ for readers everywhere</Text>
          <Text style={styles.footerSubtext}>Narrivo • Open Source</Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.bg,
  },
  content: {
    padding: spacing.md,
    paddingBottom: 100,
  },
  title: {
    ...typography.h1,
    color: colors.white,
    marginBottom: spacing.lg,
  },
  accent: {
    color: colors.lime,
  },
  section: {
    marginBottom: spacing.lg,
  },
  sectionTitle: {
    ...typography.label,
    color: colors.lime,
    marginBottom: spacing.md,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: colors.card,
    padding: spacing.md,
    borderRadius: borderRadius.md,
    marginBottom: spacing.sm,
  },
  rowLabel: {
    ...typography.body,
    color: colors.white,
    fontWeight: '600',
  },
  rowDesc: {
    ...typography.small,
    color: colors.gray,
    marginTop: 2,
  },
  rowAction: {
    fontSize: 18,
    color: colors.gray,
  },
  versionText: {
    ...typography.body,
    color: colors.gray,
    fontFamily: 'monospace',
  },
  footer: {
    alignItems: 'center',
    marginTop: spacing.xl,
    paddingTop: spacing.lg,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  footerText: {
    ...typography.body,
    color: colors.gray,
    marginBottom: spacing.xs,
  },
  footerSubtext: {
    ...typography.label,
    color: colors.border,
  },
});
