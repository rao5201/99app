import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
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
  success: '#00E676',
  warning: '#FFD700',
};

const BAR_DATA = [
  { day: 'M', height: 0.6 },
  { day: 'T', height: 0.8 },
  { day: 'W', height: 0.5 },
  { day: 'T', height: 0.9 },
  { day: 'F', height: 1.0 },
  { day: 'S', height: 0.4 },
  { day: 'S', height: 0.3 },
];

const QUICK_ACTIONS = [
  { icon: 'document-text-outline', label: 'Generate Report' },
  { icon: 'trending-up-outline', label: 'Analyze Trends' },
  { icon: 'calendar-outline', label: 'Schedule Tasks' },
  { icon: 'scan-outline', label: 'Scan Document' },
];

const RECENT_ACTIVITY = [
  {
    icon: 'card-outline',
    iconColor: COLORS.accentGreen,
    description: 'Payment received from Acme Corp',
    timestamp: '2 min ago',
  },
  {
    icon: 'people-outline',
    iconColor: COLORS.accent,
    description: 'New customer signup: Jane Smith',
    timestamp: '15 min ago',
  },
  {
    icon: 'alert-circle-outline',
    iconColor: COLORS.accentOrange,
    description: 'Invoice #1042 is overdue',
    timestamp: '1 hr ago',
  },
  {
    icon: 'bulb-outline',
    iconColor: COLORS.primaryLight,
    description: 'AI detected a revenue trend anomaly',
    timestamp: '3 hr ago',
  },
];

export default function DashboardScreen() {
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={COLORS.bgDark} />
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={styles.header}>
          <View>
            <Text style={styles.greeting}>Good Morning</Text>
            <Text style={styles.userName}>Alex Johnson</Text>
          </View>
          <TouchableOpacity style={styles.notificationBtn}>
            <View style={styles.notificationDot} />
            <Ionicons name="notifications-outline" size={24} color={COLORS.textPrimary} />
          </TouchableOpacity>
        </View>

        {/* Revenue Overview Card */}
        <View style={styles.revenueCard}>
          <Text style={styles.revenueLabel}>Total Revenue</Text>
          <Text style={styles.revenueAmount}>$48,329</Text>
          <View style={styles.revenueChange}>
            <Ionicons name="arrow-up" size={14} color={COLORS.accentGreen} />
            <Text style={styles.revenueChangeText}>+12.5% vs last month</Text>
          </View>

          {/* Bar Chart */}
          <View style={styles.chartContainer}>
            {BAR_DATA.map((bar, index) => (
              <View key={index} style={styles.barWrapper}>
                <View style={styles.barTrack}>
                  <LinearGradient
                    colors={[COLORS.primary, COLORS.primaryLight]}
                    start={{ x: 0, y: 1 }}
                    end={{ x: 0, y: 0 }}
                    style={[
                      styles.bar,
                      { height: `${bar.height * 100}%` },
                    ]}
                  />
                </View>
                <Text style={styles.barLabel}>{bar.day}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* Stat Mini Cards */}
        <View style={styles.statsRow}>
          <View style={styles.statCard}>
            <Text style={styles.statLabel}>Customers</Text>
            <View style={styles.statValueRow}>
              <Text style={styles.statValue}>2,847</Text>
              <Ionicons name="arrow-up" size={14} color={COLORS.accentGreen} />
            </View>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statLabel}>Tasks</Text>
            <View style={styles.statValueRow}>
              <Text style={styles.statValue}>23 active</Text>
              <View style={[styles.indicator, { backgroundColor: COLORS.accentOrange }]} />
            </View>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statLabel}>AI Insights</Text>
            <View style={styles.statValueRow}>
              <Text style={styles.statValue}>7 new</Text>
              <View style={[styles.indicator, { backgroundColor: COLORS.accent }]} />
            </View>
          </View>
        </View>

        {/* AI Quick Actions */}
        <Text style={styles.sectionTitle}>AI Quick Actions</Text>
        <View style={styles.actionsGrid}>
          {QUICK_ACTIONS.map((action, index) => (
            <TouchableOpacity key={index} style={styles.actionButton} activeOpacity={0.7}>
              <LinearGradient
                colors={[COLORS.primary + '30', COLORS.primaryLight + '10']}
                style={styles.actionIconWrap}
              >
                <Ionicons name={action.icon} size={24} color={COLORS.primaryLight} />
              </LinearGradient>
              <Text style={styles.actionLabel}>{action.label}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Recent Activity */}
        <Text style={styles.sectionTitle}>Recent Activity</Text>
        <View style={styles.activityCard}>
          {RECENT_ACTIVITY.map((item, index) => (
            <View
              key={index}
              style={[
                styles.activityItem,
                index < RECENT_ACTIVITY.length - 1 && styles.activityItemBorder,
              ]}
            >
              <View style={[styles.activityIconWrap, { backgroundColor: item.iconColor + '20' }]}>
                <Ionicons name={item.icon} size={20} color={item.iconColor} />
              </View>
              <View style={styles.activityContent}>
                <Text style={styles.activityDesc}>{item.description}</Text>
                <Text style={styles.activityTime}>{item.timestamp}</Text>
              </View>
            </View>
          ))}
        </View>

        <View style={{ height: 32 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.bgDark,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 16,
  },

  /* Header */
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
  },
  greeting: {
    fontSize: 14,
    color: COLORS.textSecondary,
  },
  userName: {
    fontSize: 22,
    fontWeight: '700',
    color: COLORS.textPrimary,
    marginTop: 2,
  },
  notificationBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: COLORS.bgCard,
    alignItems: 'center',
    justifyContent: 'center',
  },
  notificationDot: {
    position: 'absolute',
    top: 10,
    right: 12,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: COLORS.accentRed,
    zIndex: 1,
  },

  /* Revenue Card */
  revenueCard: {
    backgroundColor: COLORS.bgCard,
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  revenueLabel: {
    fontSize: 14,
    color: COLORS.textSecondary,
    marginBottom: 4,
  },
  revenueAmount: {
    fontSize: 32,
    fontWeight: '800',
    color: COLORS.textPrimary,
  },
  revenueChange: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
    marginBottom: 20,
  },
  revenueChangeText: {
    fontSize: 13,
    color: COLORS.accentGreen,
    marginLeft: 4,
  },
  chartContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    height: 120,
  },
  barWrapper: {
    flex: 1,
    alignItems: 'center',
  },
  barTrack: {
    width: 24,
    height: 100,
    backgroundColor: COLORS.bgCardLight,
    borderRadius: 6,
    justifyContent: 'flex-end',
    overflow: 'hidden',
  },
  bar: {
    width: '100%',
    borderRadius: 6,
  },
  barLabel: {
    fontSize: 12,
    color: COLORS.textMuted,
    marginTop: 8,
  },

  /* Stats Row */
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 28,
  },
  statCard: {
    flex: 1,
    backgroundColor: COLORS.bgCard,
    borderRadius: 12,
    padding: 14,
    marginHorizontal: 4,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  statLabel: {
    fontSize: 12,
    color: COLORS.textSecondary,
    marginBottom: 6,
  },
  statValueRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  statValue: {
    fontSize: 16,
    fontWeight: '700',
    color: COLORS.textPrimary,
  },
  indicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },

  /* Section Title */
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: COLORS.textPrimary,
    marginBottom: 14,
  },

  /* Quick Actions Grid */
  actionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 28,
  },
  actionButton: {
    width: '48%',
    backgroundColor: COLORS.bgCard,
    borderRadius: 14,
    padding: 18,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  actionIconWrap: {
    width: 48,
    height: 48,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  actionLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.textPrimary,
  },

  /* Recent Activity */
  activityCard: {
    backgroundColor: COLORS.bgCard,
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  activityItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
  },
  activityItemBorder: {
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  activityIconWrap: {
    width: 40,
    height: 40,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  activityContent: {
    flex: 1,
  },
  activityDesc: {
    fontSize: 14,
    color: COLORS.textPrimary,
    marginBottom: 2,
  },
  activityTime: {
    fontSize: 12,
    color: COLORS.textMuted,
  },
});
