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
  success: '#00E676',
  warning: '#FFD700',
};

const DATE_RANGES = ['7D', '30D', '90D', '1Y'];

const CHART_DATA = [
  { day: 'Mon', height: 0.55 },
  { day: 'Tue', height: 0.72 },
  { day: 'Wed', height: 0.48 },
  { day: 'Thu', height: 0.85 },
  { day: 'Fri', height: 1.0 },
  { day: 'Sat', height: 0.38 },
  { day: 'Sun', height: 0.3 },
];

const Y_LABELS = ['$45K', '$30K', '$15K', '$0'];

const KEY_METRICS = [
  {
    title: 'MRR',
    value: '$48.3K',
    trend: 'up',
    trendColor: COLORS.accentGreen,
    sparkHeights: [0.3, 0.5, 0.4, 0.6, 0.55, 0.7, 0.8],
  },
  {
    title: 'Churn Rate',
    value: '2.1%',
    trend: 'down',
    trendColor: COLORS.accentGreen,
    sparkHeights: [0.8, 0.7, 0.6, 0.65, 0.5, 0.4, 0.3],
  },
  {
    title: 'LTV',
    value: '$2,847',
    trend: 'up',
    trendColor: COLORS.accentGreen,
    sparkHeights: [0.2, 0.35, 0.4, 0.5, 0.55, 0.7, 0.85],
  },
  {
    title: 'CAC',
    value: '$127',
    trend: 'neutral',
    trendColor: COLORS.textSecondary,
    sparkHeights: [0.5, 0.55, 0.48, 0.52, 0.5, 0.53, 0.49],
  },
];

const TOP_PRODUCTS = [
  { name: 'Enterprise Suite', revenue: '$18,420', percent: 0.72 },
  { name: 'Pro Plan', revenue: '$12,850', percent: 0.50 },
  { name: 'Starter Pack', revenue: '$7,230', percent: 0.28 },
];

const CUSTOMER_SEGMENTS = [
  { label: 'Enterprise', percent: 0.42, color: COLORS.primary },
  { label: 'Mid-Market', percent: 0.31, color: COLORS.accent },
  { label: 'SMB', percent: 0.18, color: COLORS.accentGreen },
  { label: 'Startup', percent: 0.09, color: COLORS.accentOrange },
];

export default function AnalyticsScreen() {
  const [selectedRange, setSelectedRange] = useState('30D');

  const getTrendIcon = (trend) => {
    if (trend === 'up') return 'arrow-up';
    if (trend === 'down') return 'arrow-down';
    return 'remove-outline';
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={COLORS.bgDark} />
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Analytics</Text>
          <View style={styles.dateRangeRow}>
            {DATE_RANGES.map((range) => (
              <TouchableOpacity
                key={range}
                style={[
                  styles.dateRangeBtn,
                  selectedRange === range && styles.dateRangeBtnActive,
                ]}
                onPress={() => setSelectedRange(range)}
                activeOpacity={0.7}
              >
                <Text
                  style={[
                    styles.dateRangeText,
                    selectedRange === range && styles.dateRangeTextActive,
                  ]}
                >
                  {range}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Revenue Chart Card */}
        <View style={styles.chartCard}>
          <View style={styles.chartCardHeader}>
            <Text style={styles.chartCardTitle}>Revenue Overview</Text>
            <View style={styles.chartBadge}>
              <Ionicons name="arrow-up" size={12} color={COLORS.accentGreen} />
              <Text style={styles.chartBadgeText}>+12.5%</Text>
            </View>
          </View>

          <View style={styles.chartArea}>
            {/* Y-Axis Labels */}
            <View style={styles.yAxis}>
              {Y_LABELS.map((label, index) => (
                <Text key={index} style={styles.yAxisLabel}>
                  {label}
                </Text>
              ))}
            </View>

            {/* Bars */}
            <View style={styles.barsContainer}>
              {/* Grid lines */}
              <View style={styles.gridLines}>
                {Y_LABELS.map((_, index) => (
                  <View key={index} style={styles.gridLine} />
                ))}
              </View>

              <View style={styles.barsRow}>
                {CHART_DATA.map((bar, index) => (
                  <View key={index} style={styles.bigBarWrapper}>
                    <View style={styles.bigBarTrack}>
                      <LinearGradient
                        colors={[COLORS.primary, COLORS.primaryLight]}
                        start={{ x: 0, y: 1 }}
                        end={{ x: 0, y: 0 }}
                        style={[
                          styles.bigBar,
                          { height: `${bar.height * 100}%` },
                        ]}
                      />
                    </View>
                    <Text style={styles.bigBarLabel}>{bar.day}</Text>
                  </View>
                ))}
              </View>
            </View>
          </View>
        </View>

        {/* Key Metrics */}
        <Text style={styles.sectionTitle}>Key Metrics</Text>
        <View style={styles.metricsGrid}>
          {KEY_METRICS.map((metric, index) => (
            <View key={index} style={styles.metricCard}>
              <Text style={styles.metricTitle}>{metric.title}</Text>
              <Text style={styles.metricValue}>{metric.value}</Text>
              <View style={styles.metricBottom}>
                <View style={styles.sparkline}>
                  {metric.sparkHeights.map((h, i) => (
                    <View
                      key={i}
                      style={[
                        styles.sparkBar,
                        {
                          height: h * 20,
                          backgroundColor: metric.trendColor + '80',
                        },
                      ]}
                    />
                  ))}
                </View>
                <Ionicons
                  name={getTrendIcon(metric.trend)}
                  size={14}
                  color={metric.trendColor}
                />
              </View>
            </View>
          ))}
        </View>

        {/* Top Products */}
        <Text style={styles.sectionTitle}>Top Products</Text>
        <View style={styles.productsCard}>
          {TOP_PRODUCTS.map((product, index) => (
            <View
              key={index}
              style={[
                styles.productItem,
                index < TOP_PRODUCTS.length - 1 && styles.productItemBorder,
              ]}
            >
              <View style={styles.productInfo}>
                <Text style={styles.productName}>{product.name}</Text>
                <Text style={styles.productRevenue}>{product.revenue}</Text>
              </View>
              <View style={styles.percentBarTrack}>
                <LinearGradient
                  colors={[COLORS.primary, COLORS.primaryLight]}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                  style={[
                    styles.percentBarFill,
                    { width: `${product.percent * 100}%` },
                  ]}
                />
              </View>
              <Text style={styles.percentText}>
                {Math.round(product.percent * 100)}%
              </Text>
            </View>
          ))}
        </View>

        {/* Customer Segments */}
        <Text style={styles.sectionTitle}>Customer Segments</Text>
        <View style={styles.segmentsCard}>
          {/* Stacked horizontal bar */}
          <View style={styles.stackedBar}>
            {CUSTOMER_SEGMENTS.map((seg, index) => (
              <View
                key={index}
                style={[
                  styles.stackedSegment,
                  {
                    flex: seg.percent,
                    backgroundColor: seg.color,
                    borderTopLeftRadius: index === 0 ? 6 : 0,
                    borderBottomLeftRadius: index === 0 ? 6 : 0,
                    borderTopRightRadius:
                      index === CUSTOMER_SEGMENTS.length - 1 ? 6 : 0,
                    borderBottomRightRadius:
                      index === CUSTOMER_SEGMENTS.length - 1 ? 6 : 0,
                  },
                ]}
              />
            ))}
          </View>

          {/* Legend */}
          <View style={styles.segmentLegend}>
            {CUSTOMER_SEGMENTS.map((seg, index) => (
              <View key={index} style={styles.legendItem}>
                <View
                  style={[styles.legendDot, { backgroundColor: seg.color }]}
                />
                <Text style={styles.legendLabel}>{seg.label}</Text>
                <Text style={styles.legendPercent}>
                  {Math.round(seg.percent * 100)}%
                </Text>
              </View>
            ))}
          </View>

          {/* Individual segment bars */}
          {CUSTOMER_SEGMENTS.map((seg, index) => (
            <View key={index} style={styles.segmentRow}>
              <Text style={styles.segmentRowLabel}>{seg.label}</Text>
              <View style={styles.segmentBarTrack}>
                <View
                  style={[
                    styles.segmentBarFill,
                    {
                      width: `${seg.percent * 100}%`,
                      backgroundColor: seg.color,
                    },
                  ]}
                />
              </View>
              <Text style={styles.segmentRowPercent}>
                {Math.round(seg.percent * 100)}%
              </Text>
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
    marginBottom: 24,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: '800',
    color: COLORS.textPrimary,
    marginBottom: 16,
  },
  dateRangeRow: {
    flexDirection: 'row',
    backgroundColor: COLORS.bgCard,
    borderRadius: 12,
    padding: 4,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  dateRangeBtn: {
    flex: 1,
    paddingVertical: 10,
    alignItems: 'center',
    borderRadius: 10,
  },
  dateRangeBtnActive: {
    backgroundColor: COLORS.primary,
  },
  dateRangeText: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.textMuted,
  },
  dateRangeTextActive: {
    color: COLORS.textPrimary,
  },

  /* Chart Card */
  chartCard: {
    backgroundColor: COLORS.bgCard,
    borderRadius: 16,
    padding: 20,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  chartCardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  chartCardTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: COLORS.textPrimary,
  },
  chartBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.accentGreen + '20',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 20,
  },
  chartBadgeText: {
    fontSize: 12,
    fontWeight: '600',
    color: COLORS.accentGreen,
    marginLeft: 3,
  },
  chartArea: {
    flexDirection: 'row',
    height: 180,
  },
  yAxis: {
    justifyContent: 'space-between',
    paddingRight: 10,
    paddingBottom: 24,
  },
  yAxisLabel: {
    fontSize: 11,
    color: COLORS.textMuted,
    textAlign: 'right',
    width: 36,
  },
  barsContainer: {
    flex: 1,
    position: 'relative',
  },
  gridLines: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 24,
    justifyContent: 'space-between',
  },
  gridLine: {
    height: 1,
    backgroundColor: COLORS.border,
  },
  barsRow: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    paddingBottom: 24,
  },
  bigBarWrapper: {
    flex: 1,
    alignItems: 'center',
  },
  bigBarTrack: {
    width: 28,
    height: '100%',
    backgroundColor: 'transparent',
    borderRadius: 6,
    justifyContent: 'flex-end',
    overflow: 'hidden',
  },
  bigBar: {
    width: '100%',
    borderRadius: 6,
  },
  bigBarLabel: {
    fontSize: 11,
    color: COLORS.textMuted,
    marginTop: 6,
    position: 'absolute',
    bottom: 0,
  },

  /* Section Title */
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: COLORS.textPrimary,
    marginBottom: 14,
  },

  /* Key Metrics Grid */
  metricsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 24,
  },
  metricCard: {
    width: '48%',
    backgroundColor: COLORS.bgCard,
    borderRadius: 14,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  metricTitle: {
    fontSize: 13,
    color: COLORS.textSecondary,
    marginBottom: 6,
  },
  metricValue: {
    fontSize: 22,
    fontWeight: '800',
    color: COLORS.textPrimary,
    marginBottom: 10,
  },
  metricBottom: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
  },
  sparkline: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: 3,
  },
  sparkBar: {
    width: 4,
    borderRadius: 2,
  },

  /* Top Products */
  productsCard: {
    backgroundColor: COLORS.bgCard,
    borderRadius: 16,
    padding: 16,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  productItem: {
    paddingVertical: 14,
  },
  productItemBorder: {
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  productInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  productName: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.textPrimary,
  },
  productRevenue: {
    fontSize: 14,
    fontWeight: '700',
    color: COLORS.textPrimary,
  },
  percentBarTrack: {
    height: 8,
    backgroundColor: COLORS.bgCardLight,
    borderRadius: 4,
    overflow: 'hidden',
    marginBottom: 6,
  },
  percentBarFill: {
    height: '100%',
    borderRadius: 4,
  },
  percentText: {
    fontSize: 12,
    color: COLORS.textSecondary,
    textAlign: 'right',
  },

  /* Customer Segments */
  segmentsCard: {
    backgroundColor: COLORS.bgCard,
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  stackedBar: {
    flexDirection: 'row',
    height: 14,
    borderRadius: 7,
    overflow: 'hidden',
    marginBottom: 16,
    gap: 2,
  },
  stackedSegment: {
    height: '100%',
  },
  segmentLegend: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 16,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 16,
    marginBottom: 8,
  },
  legendDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    marginRight: 6,
  },
  legendLabel: {
    fontSize: 12,
    color: COLORS.textSecondary,
    marginRight: 4,
  },
  legendPercent: {
    fontSize: 12,
    fontWeight: '700',
    color: COLORS.textPrimary,
  },
  segmentRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  segmentRowLabel: {
    fontSize: 13,
    color: COLORS.textSecondary,
    width: 80,
  },
  segmentBarTrack: {
    flex: 1,
    height: 8,
    backgroundColor: COLORS.bgCardLight,
    borderRadius: 4,
    overflow: 'hidden',
    marginHorizontal: 10,
  },
  segmentBarFill: {
    height: '100%',
    borderRadius: 4,
  },
  segmentRowPercent: {
    fontSize: 13,
    fontWeight: '700',
    color: COLORS.textPrimary,
    width: 36,
    textAlign: 'right',
  },
});
