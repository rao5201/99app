import React, { useState } from 'react';
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
};

const FILTERS = ['All', 'Active', 'Completed'];

const PROJECTS = [
  {
    id: '1',
    name: 'Q2 Marketing Campaign',
    tasksCompleted: 9,
    totalTasks: 12,
    progress: 0.75,
    priority: 'High',
    dueDate: 'Apr 15, 2026',
    members: [
      { initials: 'JP', color: '#6C5CE7' },
      { initials: 'AK', color: '#00D2FF' },
      { initials: 'SM', color: '#FF9100' },
    ],
  },
  {
    id: '2',
    name: 'Product Launch v2.0',
    tasksCompleted: 9,
    totalTasks: 20,
    progress: 0.45,
    priority: 'High',
    dueDate: 'May 01, 2026',
    members: [
      { initials: 'RD', color: '#00E676' },
      { initials: 'JP', color: '#6C5CE7' },
      { initials: 'LW', color: '#FF5252' },
      { initials: 'TN', color: '#00D2FF' },
    ],
  },
  {
    id: '3',
    name: 'Customer Onboarding Flow',
    tasksCompleted: 18,
    totalTasks: 20,
    progress: 0.9,
    priority: 'Medium',
    dueDate: 'Mar 30, 2026',
    members: [
      { initials: 'AK', color: '#00D2FF' },
      { initials: 'SM', color: '#FF9100' },
    ],
  },
  {
    id: '4',
    name: 'Annual Financial Report',
    tasksCompleted: 3,
    totalTasks: 15,
    progress: 0.2,
    priority: 'Low',
    dueDate: 'Jun 30, 2026',
    members: [
      { initials: 'JP', color: '#6C5CE7' },
      { initials: 'RD', color: '#00E676' },
    ],
  },
];

const getProgressColor = (progress) => {
  if (progress > 0.7) return COLORS.accentGreen;
  if (progress >= 0.4) return COLORS.accentOrange;
  return COLORS.accentRed;
};

const getPriorityColor = (priority) => {
  switch (priority) {
    case 'High':
      return COLORS.accentRed;
    case 'Medium':
      return COLORS.accentOrange;
    case 'Low':
      return COLORS.accentGreen;
    default:
      return COLORS.textMuted;
  }
};

export default function ProjectsScreen() {
  const [activeFilter, setActiveFilter] = useState('All');

  const renderFilterTabs = () => (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.filtersContainer}
    >
      {FILTERS.map((filter) => {
        const isActive = activeFilter === filter;
        return (
          <TouchableOpacity
            key={filter}
            style={[styles.filterTab, isActive && styles.filterTabActive]}
            onPress={() => setActiveFilter(filter)}
            activeOpacity={0.7}
          >
            <Text
              style={[
                styles.filterTabText,
                isActive && styles.filterTabTextActive,
              ]}
            >
              {filter}
            </Text>
          </TouchableOpacity>
        );
      })}
    </ScrollView>
  );

  const renderAvatars = (members) => (
    <View style={styles.avatarsRow}>
      {members.map((member, index) => (
        <View
          key={index}
          style={[
            styles.avatar,
            { backgroundColor: member.color, marginLeft: index === 0 ? 0 : -10 },
          ]}
        >
          <Text style={styles.avatarText}>{member.initials}</Text>
        </View>
      ))}
    </View>
  );

  const renderProjectCard = (project) => {
    const progressColor = getProgressColor(project.progress);
    const priorityColor = getPriorityColor(project.priority);
    const progressPercent = Math.round(project.progress * 100);

    return (
      <View key={project.id} style={styles.card}>
        <View style={styles.cardHeader}>
          <Text style={styles.projectName} numberOfLines={1}>
            {project.name}
          </Text>
          <View style={[styles.priorityBadge, { backgroundColor: priorityColor + '20' }]}>
            <Text style={[styles.priorityText, { color: priorityColor }]}>
              {project.priority}
            </Text>
          </View>
        </View>

        <View style={styles.progressSection}>
          <View style={styles.progressHeader}>
            <Text style={styles.progressLabel}>
              {project.tasksCompleted}/{project.totalTasks} tasks completed
            </Text>
            <Text style={[styles.progressPercent, { color: progressColor }]}>
              {progressPercent}%
            </Text>
          </View>
          <View style={styles.progressBarBg}>
            <View
              style={[
                styles.progressBarFill,
                { width: `${progressPercent}%`, backgroundColor: progressColor },
              ]}
            />
          </View>
        </View>

        <View style={styles.cardFooter}>
          {renderAvatars(project.members)}
          <View style={styles.dueDateRow}>
            <Ionicons name="calendar-outline" size={14} color={COLORS.textSecondary} />
            <Text style={styles.dueDateText}>{project.dueDate}</Text>
          </View>
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={COLORS.bgDark} />

      <View style={styles.header}>
        <Text style={styles.headerTitle}>Projects</Text>
        <TouchableOpacity style={styles.addButton} activeOpacity={0.7}>
          <Ionicons name="add" size={24} color={COLORS.textPrimary} />
        </TouchableOpacity>
      </View>

      {renderFilterTabs()}

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {PROJECTS.map(renderProjectCard)}
      </ScrollView>

      <TouchableOpacity style={styles.fab} activeOpacity={0.8}>
        <LinearGradient
          colors={[COLORS.primary, COLORS.primaryLight]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.fabGradient}
        >
          <Ionicons name="add" size={28} color={COLORS.textPrimary} />
        </LinearGradient>
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.bgDark,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 12,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: '700',
    color: COLORS.textPrimary,
  },
  addButton: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: COLORS.bgCardLight,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  filtersContainer: {
    paddingHorizontal: 20,
    paddingBottom: 16,
    gap: 10,
    flexDirection: 'row',
  },
  filterTab: {
    paddingHorizontal: 20,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: COLORS.bgCard,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  filterTabActive: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },
  filterTabText: {
    fontSize: 14,
    fontWeight: '500',
    color: COLORS.textSecondary,
  },
  filterTabTextActive: {
    color: COLORS.textPrimary,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingBottom: 100,
  },
  card: {
    backgroundColor: COLORS.bgCard,
    borderRadius: 16,
    padding: 18,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 14,
  },
  projectName: {
    fontSize: 17,
    fontWeight: '700',
    color: COLORS.textPrimary,
    flex: 1,
    marginRight: 10,
  },
  priorityBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
  },
  priorityText: {
    fontSize: 12,
    fontWeight: '600',
  },
  progressSection: {
    marginBottom: 14,
  },
  progressHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  progressLabel: {
    fontSize: 13,
    color: COLORS.textSecondary,
  },
  progressPercent: {
    fontSize: 13,
    fontWeight: '600',
  },
  progressBarBg: {
    height: 6,
    backgroundColor: COLORS.bgCardLight,
    borderRadius: 3,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    borderRadius: 3,
  },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  avatarsRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatar: {
    width: 30,
    height: 30,
    borderRadius: 15,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: COLORS.bgCard,
  },
  avatarText: {
    fontSize: 10,
    fontWeight: '700',
    color: COLORS.textPrimary,
  },
  dueDateRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },
  dueDateText: {
    fontSize: 12,
    color: COLORS.textSecondary,
  },
  fab: {
    position: 'absolute',
    bottom: 30,
    right: 20,
    borderRadius: 28,
    overflow: 'hidden',
    elevation: 8,
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 8,
  },
  fabGradient: {
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
