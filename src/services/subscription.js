/**
 * BizPilot AI - Subscription Service
 * Handles RevenueCat integration for $99/month subscription
 */
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Platform } from 'react-native';

// RevenueCat API Keys - Replace with your actual keys
const API_KEYS = {
  ios: 'YOUR_REVENUECAT_IOS_API_KEY',
  android: 'YOUR_REVENUECAT_ANDROID_API_KEY',
};

// Product identifiers (must match App Store Connect / Google Play Console)
export const PRODUCTS = {
  MONTHLY: 'bizpilot_pro_monthly_99',
  ANNUAL: 'bizpilot_pro_annual_799',
};

export const ENTITLEMENTS = {
  PRO: 'pro',
};

const STORAGE_KEYS = {
  IS_SUBSCRIBED: '@bizpilot_is_subscribed',
  SUBSCRIPTION_TYPE: '@bizpilot_sub_type',
  SUBSCRIPTION_EXPIRY: '@bizpilot_sub_expiry',
};

/**
 * Initialize RevenueCat SDK
 * Call this in App.js on startup
 */
export async function initializePurchases() {
  try {
    const Purchases = require('react-native-purchases').default;
    const apiKey = Platform.OS === 'ios' ? API_KEYS.ios : API_KEYS.android;
    await Purchases.configure({ apiKey });
    console.log('RevenueCat initialized successfully');
    return true;
  } catch (error) {
    console.warn('RevenueCat initialization failed:', error);
    return false;
  }
}

/**
 * Check if user has active subscription
 */
export async function checkSubscriptionStatus() {
  try {
    const Purchases = require('react-native-purchases').default;
    const customerInfo = await Purchases.getCustomerInfo();
    const isActive =
      customerInfo.entitlements.active[ENTITLEMENTS.PRO] !== undefined;

    await AsyncStorage.setItem(
      STORAGE_KEYS.IS_SUBSCRIBED,
      JSON.stringify(isActive)
    );

    return isActive;
  } catch (error) {
    // Fallback to cached value
    const cached = await AsyncStorage.getItem(STORAGE_KEYS.IS_SUBSCRIBED);
    return cached ? JSON.parse(cached) : false;
  }
}

/**
 * Get available subscription offerings
 */
export async function getOfferings() {
  try {
    const Purchases = require('react-native-purchases').default;
    const offerings = await Purchases.getOfferings();

    if (offerings.current) {
      return {
        monthly: offerings.current.monthly,
        annual: offerings.current.annual,
        allPackages: offerings.current.availablePackages,
      };
    }
    return null;
  } catch (error) {
    console.error('Failed to fetch offerings:', error);
    return null;
  }
}

/**
 * Purchase a subscription package
 */
export async function purchasePackage(pkg) {
  try {
    const Purchases = require('react-native-purchases').default;
    const { customerInfo } = await Purchases.purchasePackage(pkg);
    const isActive =
      customerInfo.entitlements.active[ENTITLEMENTS.PRO] !== undefined;

    if (isActive) {
      await AsyncStorage.setItem(
        STORAGE_KEYS.IS_SUBSCRIBED,
        JSON.stringify(true)
      );
      await AsyncStorage.setItem(
        STORAGE_KEYS.SUBSCRIPTION_TYPE,
        pkg.packageType
      );
    }

    return { success: isActive, customerInfo };
  } catch (error) {
    if (error.userCancelled) {
      return { success: false, cancelled: true };
    }
    throw error;
  }
}

/**
 * Restore previous purchases
 */
export async function restorePurchases() {
  try {
    const Purchases = require('react-native-purchases').default;
    const customerInfo = await Purchases.restorePurchases();
    const isActive =
      customerInfo.entitlements.active[ENTITLEMENTS.PRO] !== undefined;

    await AsyncStorage.setItem(
      STORAGE_KEYS.IS_SUBSCRIBED,
      JSON.stringify(isActive)
    );

    return { success: isActive, customerInfo };
  } catch (error) {
    throw error;
  }
}

/**
 * Identify user with RevenueCat (call after authentication)
 */
export async function identifyUser(userId) {
  try {
    const Purchases = require('react-native-purchases').default;
    const { customerInfo } = await Purchases.logIn(userId);
    return customerInfo;
  } catch (error) {
    console.error('Failed to identify user:', error);
    return null;
  }
}

/**
 * Log out user from RevenueCat
 */
export async function logOutUser() {
  try {
    const Purchases = require('react-native-purchases').default;
    await Purchases.logOut();
    await AsyncStorage.removeItem(STORAGE_KEYS.IS_SUBSCRIBED);
    await AsyncStorage.removeItem(STORAGE_KEYS.SUBSCRIPTION_TYPE);
  } catch (error) {
    console.error('Failed to log out:', error);
  }
}

export default {
  initializePurchases,
  checkSubscriptionStatus,
  getOfferings,
  purchasePackage,
  restorePurchases,
  identifyUser,
  logOutUser,
  PRODUCTS,
  ENTITLEMENTS,
};
