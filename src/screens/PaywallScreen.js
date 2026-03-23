import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  Dimensions,
  Platform,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import Purchases from 'react-native-purchases';
import AsyncStorage from '@react-native-async-storage/async-storage';

const { width } = Dimensions.get('window');

const COLORS = {
  primary: '#6C5CE7',
  primaryLight: '#A29BFE',
  accent: '#00D2FF',
  accentGreen: '#00E676',
  bgDark: '#0A0E27',
  bgCard: '#141937',
  bgCardLight: '#1E2548',
  textPrimary: '#FFFFFF',
  textSecondary: '#8B92B0',
  gradientPrimary: ['#6C5CE7', '#A29BFE'],
  gradientGold: ['#FFD700', '#FF9100'],
};

const PRO_FEATURES = [
  'Unlimited AI Business Analysis',
  'Real-Time Revenue Dashboard',
  'AI-Generated Reports & Insights',
  'Smart Task Automation',
  'Priority 24/7 Support',
  'Team Collaboration (up to 25)',
  'Custom KPI Tracking',
  'Document Scanner & OCR',
];

const STORAGE_KEY = '@bizpilot_subscription_active';

export default function PaywallScreen({ navigation }) {
  const [selectedPlan, setSelectedPlan] = useState('monthly');
  const [loading, setLoading] = useState(false);
  const [offerings, setOfferings] = useState(null);

  useEffect(() => {
    fetchOfferings();
  }, []);

  const fetchOfferings = async () => {
    try {
      const offeringsResult = await Purchases.getOfferings();
      if (offeringsResult.current) {
        setOfferings(offeringsResult.current);
      }
    } catch (error) {
      console.warn('Failed to fetch offerings:', error);
    }
  };

  const handlePurchase = useCallback(async () => {
    setLoading(true);
    try {
      let packageToPurchase = null;

      if (offerings) {
        packageToPurchase =
          selectedPlan === 'monthly'
            ? offerings.monthly
            : offerings.annual;
      }

      if (!packageToPurchase) {
        Alert.alert(
          'Unavailable',
          'This subscription package is not available right now. Please try again later.'
        );
        setLoading(false);
        return;
      }

      const { customerInfo } = await Purchases.purchasePackage(packageToPurchase);
      const isActive =
        typeof customerInfo.entitlements.active['pro'] !== 'undefined';

      if (isActive) {
        await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify({ active: true, plan: selectedPlan, purchasedAt: new Date().toISOString() }));
        navigation.reset({ index: 0, routes: [{ name: 'Dashboard' }] });
      }
    } catch (error) {
      if (!error.userCancelled) {
        Alert.alert('Purchase Failed', error.message || 'Something went wrong. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  }, [offerings, selectedPlan, navigation]);

  const handleRestore = useCallback(async () => {
    setLoading(true);
    try {
      const customerInfo = await Purchases.restorePurchases();
      const isActive =
        typeof customerInfo.entitlements.active['pro'] !== 'undefined';

      if (isActive) {
        await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify({ active: true, restored: true, restoredAt: new Date().toISOString() }));
        Alert.alert('Restored', 'Your subscription has been restored.', [
          { text: 'Continue', onPress: () => navigation.reset({ index: 0, routes: [{ name: 'Dashboard' }] }) },
        ]);
      } else {
        Alert.alert('No Subscription Found', 'We could not find an active subscription for your account.');
      }
    } catch (error) {
      Alert.alert('Restore Failed', error.message || 'Could not restore purchases. Please try again.');
    } finally {
      setLoading(false);
    }
  }, [navigation]);

  return (
    <LinearGradient colors={[COLORS.bgDark, COLORS.bgCard]} style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        bounces={false}
      >
        {/* Close button */}
        <TouchableOpacity style={styles.closeButton} onPress={() => navigation.goBack()}>
          <Ionicons name="close" size={28} color={COLORS.textSecondary} />
        </TouchableOpacity>

        {/* Hero */}
        <View style={styles.heroSection}>
          <LinearGradient
            colors={COLORS.gradientPrimary}
            style={styles.iconBadge}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
          >
            <Ionicons name="rocket" size={32} color={COLORS.textPrimary} />
          </LinearGradient>
          <Text style={styles.heading}>Unlock Full Power</Text>
          <Text style={styles.subtitle}>Join 50,000+ business leaders</Text>
        </View>

        {/* Pro Plan Card */}
        <LinearGradient
          colors={COLORS.gradientGold}
          style={styles.planCardBorder}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
        >
          <TouchableOpacity
            activeOpacity={0.9}
            style={[
              styles.planCardInner,
              selectedPlan === 'monthly' && styles.planCardSelected,
            ]}
            onPress={() => setSelectedPlan('monthly')}
          >
            {/* PRO Badge */}
            <LinearGradient
              colors={COLORS.gradientGold}
              style={styles.proBadge}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
            >
              <Text style={styles.proBadgeText}>PRO</Text>
            </LinearGradient>

            {/* Price */}
            <View style={styles.priceRow}>
              <Text style={styles.priceDollar}>$</Text>
              <Text style={styles.priceAmount}>99</Text>
              <Text style={styles.pricePeriod}>/month</Text>
            </View>
            <Text style={styles.cancelText}>Cancel anytime</Text>

            {/* Divider */}
            <View style={styles.divider} />

            {/* Features */}
            {PRO_FEATURES.map((feature, index) => (
              <View key={index} style={styles.featureRow}>
                <Ionicons
                  name="checkmark-circle"
                  size={22}
                  color={COLORS.accentGreen}
                />
                <Text style={styles.featureText}>{feature}</Text>
              </View>
            ))}
          </TouchableOpacity>
        </LinearGradient>

        {/* Annual Plan */}
        <TouchableOpacity
          activeOpacity={0.8}
          style={[
            styles.annualCard,
            selectedPlan === 'annual' && styles.annualCardSelected,
          ]}
          onPress={() => setSelectedPlan('annual')}
        >
          <View style={styles.annualLeft}>
            <View
              style={[
                styles.radioOuter,
                selectedPlan === 'annual' && styles.radioOuterActive,
              ]}
            >
              {selectedPlan === 'annual' && <View style={styles.radioInner} />}
            </View>
            <View>
              <Text style={styles.annualTitle}>Annual Plan</Text>
              <Text style={styles.annualPrice}>$799/year (Save 33%)</Text>
            </View>
          </View>
          <View style={styles.saveBadge}>
            <Text style={styles.saveBadgeText}>BEST VALUE</Text>
          </View>
        </TouchableOpacity>

        {/* CTA Button */}
        <TouchableOpacity
          activeOpacity={0.85}
          onPress={handlePurchase}
          disabled={loading}
          style={styles.ctaWrapper}
        >
          <LinearGradient
            colors={COLORS.gradientPrimary}
            style={styles.ctaButton}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
          >
            {loading ? (
              <ActivityIndicator color={COLORS.textPrimary} size="small" />
            ) : (
              <>
                <Ionicons name="shield-checkmark" size={22} color={COLORS.textPrimary} style={{ marginRight: 8 }} />
                <Text style={styles.ctaText}>Start 7-Day Free Trial</Text>
              </>
            )}
          </LinearGradient>
        </TouchableOpacity>

        <Text style={styles.trialNote}>
          Then {selectedPlan === 'monthly' ? '$99/month' : '$799/year'}. Cancel anytime.
        </Text>

        {/* Restore */}
        <TouchableOpacity onPress={handleRestore} style={styles.restoreButton} disabled={loading}>
          <Text style={styles.restoreText}>Restore Purchase</Text>
        </TouchableOpacity>

        {/* Legal */}
        <Text style={styles.legalText}>
          By continuing, you agree to our{' '}
          <Text style={styles.legalLink}>Terms of Service</Text> and{' '}
          <Text style={styles.legalLink}>Privacy Policy</Text>.
          {'\n'}Payment will be charged to your {Platform.OS === 'ios' ? 'Apple ID' : 'Google Play'} account at confirmation of purchase.
          Subscription automatically renews unless canceled at least 24 hours before the end of the current period.
        </Text>
      </ScrollView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 24,
    paddingTop: Platform.OS === 'ios' ? 60 : 40,
    paddingBottom: 48,
  },
  closeButton: {
    alignSelf: 'flex-end',
    padding: 4,
    marginBottom: 8,
  },

  /* Hero */
  heroSection: {
    alignItems: 'center',
    marginBottom: 28,
  },
  iconBadge: {
    width: 64,
    height: 64,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  heading: {
    fontSize: 30,
    fontWeight: '800',
    color: COLORS.textPrimary,
    textAlign: 'center',
    letterSpacing: 0.3,
  },
  subtitle: {
    fontSize: 16,
    color: COLORS.textSecondary,
    marginTop: 6,
    textAlign: 'center',
  },

  /* Pro Plan Card */
  planCardBorder: {
    borderRadius: 20,
    padding: 2,
    marginBottom: 16,
  },
  planCardInner: {
    backgroundColor: COLORS.bgCardLight,
    borderRadius: 18,
    paddingVertical: 24,
    paddingHorizontal: 20,
  },
  planCardSelected: {
    backgroundColor: COLORS.bgCard,
  },
  proBadge: {
    alignSelf: 'flex-start',
    paddingHorizontal: 14,
    paddingVertical: 4,
    borderRadius: 8,
    marginBottom: 16,
  },
  proBadgeText: {
    color: COLORS.bgDark,
    fontWeight: '900',
    fontSize: 13,
    letterSpacing: 1.5,
  },
  priceRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    marginBottom: 4,
  },
  priceDollar: {
    fontSize: 22,
    fontWeight: '700',
    color: COLORS.textPrimary,
    marginBottom: 6,
  },
  priceAmount: {
    fontSize: 52,
    fontWeight: '900',
    color: COLORS.textPrimary,
    lineHeight: 56,
  },
  pricePeriod: {
    fontSize: 16,
    color: COLORS.textSecondary,
    marginBottom: 8,
    marginLeft: 4,
  },
  cancelText: {
    fontSize: 14,
    color: COLORS.textSecondary,
    marginBottom: 16,
  },
  divider: {
    height: 1,
    backgroundColor: 'rgba(255,255,255,0.07)',
    marginBottom: 16,
  },
  featureRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 14,
  },
  featureText: {
    fontSize: 15,
    color: COLORS.textPrimary,
    marginLeft: 12,
    flex: 1,
  },

  /* Annual Card */
  annualCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: COLORS.bgCardLight,
    borderRadius: 16,
    borderWidth: 1.5,
    borderColor: 'rgba(255,255,255,0.08)',
    padding: 16,
    marginBottom: 28,
  },
  annualCardSelected: {
    borderColor: COLORS.primary,
  },
  annualLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  radioOuter: {
    width: 22,
    height: 22,
    borderRadius: 11,
    borderWidth: 2,
    borderColor: COLORS.textSecondary,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  radioOuterActive: {
    borderColor: COLORS.primary,
  },
  radioInner: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: COLORS.primary,
  },
  annualTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: COLORS.textPrimary,
  },
  annualPrice: {
    fontSize: 13,
    color: COLORS.textSecondary,
    marginTop: 2,
  },
  saveBadge: {
    backgroundColor: 'rgba(0,230,118,0.15)',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 6,
  },
  saveBadgeText: {
    fontSize: 11,
    fontWeight: '800',
    color: COLORS.accentGreen,
    letterSpacing: 0.5,
  },

  /* CTA */
  ctaWrapper: {
    borderRadius: 16,
    overflow: 'hidden',
    elevation: 8,
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.4,
    shadowRadius: 16,
  },
  ctaButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 18,
    borderRadius: 16,
  },
  ctaText: {
    fontSize: 18,
    fontWeight: '800',
    color: COLORS.textPrimary,
    letterSpacing: 0.3,
  },
  trialNote: {
    textAlign: 'center',
    color: COLORS.textSecondary,
    fontSize: 13,
    marginTop: 12,
  },

  /* Restore */
  restoreButton: {
    alignSelf: 'center',
    marginTop: 20,
    paddingVertical: 8,
    paddingHorizontal: 16,
  },
  restoreText: {
    fontSize: 14,
    color: COLORS.accent,
    fontWeight: '600',
  },

  /* Legal */
  legalText: {
    fontSize: 11,
    lineHeight: 16,
    color: COLORS.textSecondary,
    textAlign: 'center',
    marginTop: 20,
    opacity: 0.7,
  },
  legalLink: {
    color: COLORS.accent,
    textDecorationLine: 'underline',
  },
});
