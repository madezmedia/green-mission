/**
 * Feature Flags System for Green Mission Dashboard
 * 
 * This module defines feature flags that control the visibility and behavior
 * of dashboard components. It supports a "hide, don't remove" approach for
 * implementing the simplified dashboard while preserving existing functionality.
 */

/**
 * Interface defining all available feature flags for the dashboard
 */
export interface FeatureFlags {
  /** Enable simplified dashboard mode with reduced complexity */
  simplifiedDashboard: boolean;
  
  /** Show advanced form fields and validation */
  advancedForm: boolean;
  
  /** Display sidebar navigation */
  sidebarNavigation: boolean;
  
  /** Enable Airtable synchronization features */
  airtableSync: boolean;
  
  /** Show sustainability metrics and reporting tab */
  sustainabilityTab: boolean;
  
  /** Display settings and configuration tab */
  settingsTab: boolean;
  
  /** Show directory visibility controls */
  directoryVisibility: boolean;
  
  /** Display membership tier information */
  membershipTierDisplay: boolean;
  
  /** Enable status management features */
  statusManagement: boolean;
  
  /** Enable advanced form validation */
  advancedValidation: boolean;
  
  /** Enable image management features */
  imageManagement: boolean;
  
  /** Enable advanced image features (multiple images, gallery) */
  advancedImageFeatures: boolean;
}

/**
 * Default feature flag configuration
 * 
 * Configured for simplified dashboard mode:
 * - Simplified dashboard is enabled
 * - Most advanced features are disabled
 * - Core functionality remains accessible
 */
export const DEFAULT_FEATURE_FLAGS: FeatureFlags = {
  simplifiedDashboard: true,
  advancedForm: false,
  sidebarNavigation: false,
  airtableSync: false,
  sustainabilityTab: false,
  settingsTab: false,
  directoryVisibility: false,
  membershipTierDisplay: false,
  statusManagement: false,
  advancedValidation: false,
  imageManagement: true,
  advancedImageFeatures: true,
};

/**
 * Get the current feature flags configuration
 * 
 * In future phases, this function will be enhanced to:
 * - Read from environment variables
 * - Support user-specific overrides
 * - Enable A/B testing capabilities
 * 
 * @returns {FeatureFlags} Current feature flags configuration
 */
export function getFeatureFlags(): FeatureFlags {
  // Phase 1: Return default configuration
  // Phase 2: Will integrate environment variables and user preferences
  return { ...DEFAULT_FEATURE_FLAGS };
}

/**
 * Check if a specific feature is enabled
 * 
 * @param {keyof FeatureFlags} feature - The feature flag to check
 * @returns {boolean} Whether the feature is enabled
 */
export function isFeatureEnabled(feature: keyof FeatureFlags): boolean {
  const flags = getFeatureFlags();
  return flags[feature];
}

/**
 * Get feature flags for a specific context or user
 * 
 * This function is prepared for future enhancement to support:
 * - User-specific feature flags
 * - Organization-level overrides
 * - Gradual rollout strategies
 * 
 * @param {string} [context] - Optional context identifier (user ID, org ID, etc.)
 * @returns {FeatureFlags} Feature flags for the given context
 */
export function getContextualFeatureFlags(context?: string): FeatureFlags {
  // Phase 1: Ignore context and return default flags
  // Phase 2: Will implement context-aware feature flag resolution
  return getFeatureFlags();
}