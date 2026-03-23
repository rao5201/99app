import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  Switch,
  StatusBar,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

const COLORS = {
  primary: '#6C5CE7',
  primaryLight: '#A29BFE',
  accent: '#00D2FF',
  accentGreen: '#00E676',
  accentOrange: '#FF9100',
  accentRed: '#FF5252',
  bgDark: '#0A0E27',
  bgCard: '#141937',
  bgCardLight: '#1E2548',
  textPrimary: '#FFFFFF',
  textSecondary: '#8B92B0',
  textMuted: '#5A6180',
  border: '#2A3158',
};

const SETTINGS_SECTIONS = [
  {
    title: 'Account',
    items: [
      { icon: 'diamond-outline', label: 'Subscription Plan', value: 'Pro - $99/mo' },
      { icon: 'receipt-outline', label: 'Billing History', value: '' },
      { icon: 'people-outline', label: 'Team Members', value: '' },
    ],
  },
  {
    title: 'Preferences',
    items: [
      { icon: 'notifications-outline', label: 'Notifications', value: '', toggle: true, toggleKey: 'notifications' },
      { icon: 'moon-outline', label: 'Dark Mode', value: '', toggle: true, toggleKey: 'darkMode' },
      { icon: 'language-outline', label: 'Language', value: 'English' },
      { icon: 'cash-outline', label: 'Currency', value: 'USD' },
    ],
  },
  {
    title: 'AI Settings',
    items: [
      { icon: 'hardware-chip-outline', label: 'AI Model', value: 'GPT-4o' },
      { icon: 'chatbubble-ellipses-outline', label: 'Response Style', value: '' },
      { icon: 'document-text-outline', label: 'Auto-Reports', value: '' },
    ],
  },
  {
    title: 'Support',
    items: [
      { icon: 'help-circle-outline', label: 'Help Center', value: '' },
      { icon: 'mail-outline', label: 'Contact Us', value: '' },
      { icon: 'star-outline', label: 'Rate App', value: '' },
    ],
  },
  {
    title: 'Legal',
    items: [
      { icon: 'shield-checkmark-outline', label: 'Privacy Policy', value: '' },
      { icon: 'document-outline', label: 'Terms of Service', value: '' },
    ],
  },
];

export default function SettingsScreen() {
  const [toggles, setToggles] = useState({
    notifications: true,
    darkMode: true,
  });

  const handleToggle = (key) => {
    setToggles((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const renderProfileSection = () => (
    <View style={styles.profileSection}>
      <LinearGradient
        colors={[COLORS.primary, COLORS.primaryLight]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.profileAvatar}
      >
        <Text style={styles.profileInitials}>JP</Text>
      </LinearGradient>

      <Text style={styles.profileName}>James Parker</Text>
      <Text style={styles.profileEmail}>james@company.com</Text>

      <View style={styles.proBadge}>
        <Ionicons name="star" size={12} color="#FFD700" />
        <Text style={styles.proBadgeText}>PRO</Text>
      </View>

      <TouchableOpacity style={styles.editProfileButton} activeOpacity={0.7}>
        <Text style={styles.editProfileText}>Edit Profile</Text>
      </TouchableOpacity>
    </View>
  );

  const renderSettingsItem = (item, index, isLast) => (
    <TouchableOpacity
      key={index}
      style={[styles.settingsItem, !isLast && styles.settingsItemBorder]}
      activeOpacity={item.toggle ? 1 : 0.7}
    >
      <View style={styles.settingsItemLeft}>
        <View style={styles.iconContainer}>
          <Ionicons name={item.icon} size={20} color={COLORS.primaryLight} />
        </View>
        <Text style={styles.settingsItemLabel}>{item.label}</Text>
      </View>

      <View style={styles.settingsItemRight}>
        {item.toggle ? (
          <Switch
            value={toggles[item.toggleKey]}
            onValueChange={() => handleToggle(item.toggleKey)}
            trackColor={{ false: COLORS.bgCardLight, true: COLORS.primary + '80' }}
            thumbColor={toggles[item.toggleKey] ? COLORS.primary : COLORS.textMuted}
            ios_backgroundColor={COLORS.bgCardLight}
          />
        ) : (
          <>
            {item.value ? (
              <Text style={styles.settingsItemValue}>{item.value}</Text>
            ) : null}
            <Ionicons name="chevron-forward" size={18} color={COLORS.textMuted} />
          </>
        )}
      </View>
    </TouchableOpacity>
  );

  const renderSection = (section, sectionIndex) => (
    <View key={sectionIndex} style={styles.section}>
      <Text style={styles.sectionTitle}>{section.title}</Text>
      <View style={styles.sectionCard}>
        {section.items.map((item, index) =>
          renderSettingsItem(item, index, index === section.items.length - 1)
        )}
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={COLORS.bgDark} />

      <View style={styles.header}>
        <Text style={styles.headerTitle}>Settings</Text>
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {renderProfileSection()}

        {SETTINGS_SECTIONS.map(renderSection)}

        <TouchableOpacity style={styles.signOutButton} activeOpacity={0.7}>
          <Ionicons name="log-out-outline" size={20} color={COLORS.accentRed} />
          <Text style={styles.signOutText}>Sign Out</Text>
        </TouchableOpacity>

        <Text style={styles.versionText}>BizPilot AI v1.0.0</Text>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.bgDark,
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 12,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: '700',
    color: COLORS.textPrimary,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingBottom: 40,
  },
  profileSection: {
    alignItems: 'center',
    paddingVertical: 24,
    marginBottom: 8,
  },
  profileAvatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 14,
  },
  profileInitials: {
    fontSize: 28,
    fontWeight: '700',
    color: COLORS.textPrimary,
  },
  profileName: {
    fontSize: 22,
    fontWeight: '700',
    color: COLORS.textPrimary,
    marginBottom: 4,
  },
  profileEmail: {
    fontSize: 14,
    color: COLORS.textSecondary,
    marginBottom: 12,
  },
  proBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFD70020',
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 12,
    gap: 5,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#FFD70040',
  },
  proBadgeText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#FFD700',
    letterSpacing: 1,
  },
  editProfileButton: {
    paddingHorizontal: 24,
    paddingVertical: 10,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: COLORS.primary,
    backgroundColor: COLORS.primary + '15',
  },
  editProfileText: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.primaryLight,
  },
  section: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 13,
    fontWeight: '600',
    color: COLORS.textMuted,
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: 10,
    marginLeft: 4,
  },
  sectionCard: {
    backgroundColor: COLORS.bgCard,
    borderRadius: 16,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  settingsItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 14,
    paddingHorizontal: 16,
  },
  settingsItemBorder: {
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  settingsItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  iconContainer: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: COLORS.bgCardLight,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  settingsItemLabel: {
    fontSize: 15,
    fontWeight: '500',
    color: COLORS.textPrimary,
  },
  settingsItemRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  settingsItemValue: {
    fontSize: 13,
    color: COLORS.textSecondary,
  },
  signOutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: COLORS.accentRed + '40',
    backgroundColor: COLORS.accentRed + '10',
    marginTop: 8,
    marginBottom: 16,
    gap: 8,
  },
  signOutText: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.accentRed,
  },
  versionText: {
    textAlign: 'center',
    fontSize: 12,
    color: COLORS.textMuted,
    marginBottom: 20,
  },
});
