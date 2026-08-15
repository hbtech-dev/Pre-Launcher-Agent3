/**
 * Secure Storage Utility
 * Provides encrypted storage for sensitive data and manages localStorage securely
 */

// Simple encryption/decryption using base64 (for basic obfuscation)
// For production, consider using crypto-js or similar library
const encryptData = (data) => {
  try {
    const jsonString = JSON.stringify(data);
    return btoa(encodeURIComponent(jsonString));
  } catch (error) {
    console.error('Encryption error:', error);
    return null;
  }
};

const decryptData = (encryptedData) => {
  try {
    const jsonString = decodeURIComponent(atob(encryptedData));
    return JSON.parse(jsonString);
  } catch (error) {
    console.error('Decryption error:', error);
    return null;
  }
};

// Secure storage class
class SecureStorage {
  constructor() {
    this.prefix = 'agent3_';
  }

  // Set item with encryption for sensitive data
  setSecure(key, value) {
    if (typeof window === 'undefined') return;
    
    const encrypted = encryptData(value);
    if (encrypted) {
      localStorage.setItem(this.prefix + key, encrypted);
    }
  }

  // Get item with decryption
  getSecure(key) {
    if (typeof window === 'undefined') return null;
    
    const encrypted = localStorage.getItem(this.prefix + key);
    if (!encrypted) return null;
    
    return decryptData(encrypted);
  }

  // Set item without encryption (for non-sensitive data)
  set(key, value) {
    if (typeof window === 'undefined') return;
    
    try {
      const jsonString = JSON.stringify(value);
      localStorage.setItem(this.prefix + key, jsonString);
    } catch (error) {
      console.error('Storage error:', error);
    }
  }

  // Get item without decryption
  get(key) {
    if (typeof window === 'undefined') return null;
    
    try {
      const item = localStorage.getItem(this.prefix + key);
      return item ? JSON.parse(item) : null;
    } catch (error) {
      console.error('Retrieval error:', error);
      return null;
    }
  }

  // Remove item
  remove(key) {
    if (typeof window === 'undefined') return;
    localStorage.removeItem(this.prefix + key);
  }

  // Clear all app-related storage
  clearAll() {
    if (typeof window === 'undefined') return;
    
    const keys = Object.keys(localStorage);
    keys.forEach(key => {
      if (key.startsWith(this.prefix)) {
        localStorage.removeItem(key);
      }
    });
  }

  // Store only essential user data (not full user object)
  setUserSession(token, refreshToken, userId, userType) {
    this.setSecure('token', token);
    this.setSecure('refreshToken', refreshToken);
    this.set('userId', userId);
    this.set('userType', userType);
    this.set('loginTime', new Date().toISOString()); // Track when user logged in
  }

  // Get user session
  getUserSession() {
    return {
      token: this.getSecure('token'),
      refreshToken: this.getSecure('refreshToken'),
      userId: this.get('userId'),
      userType: this.get('userType'),
      loginTime: this.get('loginTime')
    };
  }

  // Clear user session
  clearUserSession() {
    this.remove('token');
    this.remove('refreshToken');
    this.remove('userId');
    this.remove('userType');
    this.remove('loginTime');
    this.remove('user'); // Remove old user object if exists
  }

  // Clear user profile
  clearUserProfile() {
    this.remove('userProfile');
  }

  // Store minimal user profile (only what's needed for UI)
  setUserProfile(profile) {
    const minimalProfile = {
      id: profile._id || profile.id,
      name: profile.fullName || profile.name,
      email: profile.email,
      avatar: profile.avatar?.url || profile.avatar
    };
    this.set('userProfile', minimalProfile);
  }

  // Get user profile
  getUserProfile() {
    return this.get('userProfile');
  }

  // Store location (non-sensitive)
  setLocation(location) {
    this.set('userLocation', location);
  }

  // Get location
  getLocation() {
    return this.get('userLocation');
  }

  // Store preferences (non-sensitive)
  setPreferences(preferences) {
    this.set('userPreferences', preferences);
  }

  // Get preferences
  getPreferences() {
    return this.get('userPreferences');
  }
}

// Export singleton instance
export const secureStorage = new SecureStorage();

// Helper functions for backward compatibility
export const setSecureItem = (key, value) => secureStorage.setSecure(key, value);
export const getSecureItem = (key) => secureStorage.getSecure(key);
export const removeItem = (key) => secureStorage.remove(key);
export const clearStorage = () => secureStorage.clearAll();

export default secureStorage;
