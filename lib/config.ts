/**
 * Dashboard Configuration System
 * 
 * This module provides configuration settings for the Green Mission Dashboard
 * based on feature flags. It defines the structure and behavior of dashboard
 * components, forms, and layouts.
 */

import { getFeatureFlags, type FeatureFlags } from './feature-flags';

/**
 * Essential form fields that are always visible in simplified mode
 */
export const ESSENTIAL_FIELDS = [
  'businessName',
  'description',
  'industry',
  'email',
  'city',
  'country',
  'website',
  'phone',
  'logo',
  'businessImages'
] as const;

/**
 * Form configuration interface
 */
export interface FormConfig {
  /** Fields that should be displayed */
  visibleFields: readonly string[];
  /** Whether to show advanced validation */
  enableAdvancedValidation: boolean;
  /** Whether to show optional field sections */
  showOptionalSections: boolean;
  /** Maximum number of form steps/sections */
  maxSections: number;
}

/**
 * Layout configuration interface
 */
export interface LayoutConfig {
  /** Whether to show sidebar navigation */
  showSidebar: boolean;
  /** Maximum number of tabs to display */
  maxTabs: number;
  /** Whether to show advanced controls */
  showAdvancedControls: boolean;
  /** Whether to use compact layout */
  useCompactLayout: boolean;
}

/**
 * Feature-specific configuration interface
 */
export interface FeaturesConfig {
  /** Airtable integration settings */
  airtable: {
    enabled: boolean;
    showSyncStatus: boolean;
    autoSync: boolean;
  };
  /** Directory settings */
  directory: {
    showVisibilityControls: boolean;
    showMembershipTier: boolean;
    enableStatusManagement: boolean;
  };
  /** Dashboard tabs configuration */
  tabs: {
    showSustainability: boolean;
    showSettings: boolean;
    maxVisible: number;
  };
}

/**
 * Image configuration interface
 */
export interface ImageConfig {
  /** Whether image upload is enabled */
  enabled: boolean;
  /** Maximum file size in MB */
  maxSize: number;
  /** Accepted file types */
  acceptedTypes: string[];
  /** Maximum number of images */
  maxImages: number;
  /** Whether multiple images are allowed */
  allowMultiple: boolean;
}

/**
 * Complete dashboard configuration interface
 */
export interface DashboardConfig {
  /** Feature flags that drive the configuration */
  features: FeatureFlags;
  /** Form-related configuration */
  form: FormConfig;
  /** Layout-related configuration */
  layout: LayoutConfig;
  /** Feature-specific settings */
  featureSettings: FeaturesConfig;
  /** Image management configuration */
  images: ImageConfig;
  /** Whether dashboard is in simplified mode */
  isSimplified: boolean;
}

/**
 * Generate form configuration based on feature flags
 * 
 * @param {FeatureFlags} flags - Current feature flags
 * @returns {FormConfig} Form configuration
 */
function getFormConfig(flags: FeatureFlags): FormConfig {
  return {
    visibleFields: flags.advancedForm 
      ? [...ESSENTIAL_FIELDS, 'foundedYear', 'employeeCount', 'revenue', 'certifications']
      : ESSENTIAL_FIELDS,
    enableAdvancedValidation: flags.advancedValidation,
    showOptionalSections: flags.advancedForm,
    maxSections: flags.advancedForm ? 4 : 2,
  };
}

/**
 * Generate layout configuration based on feature flags
 * 
 * @param {FeatureFlags} flags - Current feature flags
 * @returns {LayoutConfig} Layout configuration
 */
function getLayoutConfig(flags: FeatureFlags): LayoutConfig {
  return {
    showSidebar: flags.sidebarNavigation,
    maxTabs: flags.simplifiedDashboard ? 2 : 4,
    showAdvancedControls: !flags.simplifiedDashboard,
    useCompactLayout: flags.simplifiedDashboard,
  };
}

/**
 * Generate feature-specific configuration based on feature flags
 *
 * @param {FeatureFlags} flags - Current feature flags
 * @returns {FeaturesConfig} Features configuration
 */
function getFeaturesConfig(flags: FeatureFlags): FeaturesConfig {
  return {
    airtable: {
      enabled: flags.airtableSync,
      showSyncStatus: flags.airtableSync,
      autoSync: flags.airtableSync && !flags.simplifiedDashboard,
    },
    directory: {
      showVisibilityControls: flags.directoryVisibility,
      showMembershipTier: flags.membershipTierDisplay,
      enableStatusManagement: flags.statusManagement,
    },
    tabs: {
      showSustainability: flags.sustainabilityTab,
      showSettings: flags.settingsTab,
      maxVisible: flags.simplifiedDashboard ? 2 : 4,
    },
  };
}

/**
 * Generate image configuration based on feature flags
 *
 * @param {FeatureFlags} flags - Current feature flags
 * @returns {ImageConfig} Image configuration
 */
function getImageConfig(flags: FeatureFlags): ImageConfig {
  return {
    enabled: flags.imageManagement,
    maxSize: 5, // 5MB for logos
    acceptedTypes: ['image/jpeg', 'image/png', 'image/webp', 'image/svg+xml'],
    maxImages: flags.advancedImageFeatures ? 6 : 1, // 1 logo + 5 business images
    allowMultiple: flags.advancedImageFeatures,
  };
}

/**
 * Get the complete dashboard configuration based on current feature flags
 * 
 * This function combines all configuration aspects and provides a single
 * source of truth for dashboard behavior. It will be enhanced in future
 * phases to support user preferences and dynamic configuration updates.
 * 
 * @returns {DashboardConfig} Complete dashboard configuration
 */
export function getDashboardConfig(): DashboardConfig {
  const flags = getFeatureFlags();
  
  return {
    features: flags,
    form: getFormConfig(flags),
    layout: getLayoutConfig(flags),
    featureSettings: getFeaturesConfig(flags),
    images: getImageConfig(flags),
    isSimplified: flags.simplifiedDashboard,
  };
}

/**
 * Get configuration for a specific context or user
 * 
 * This function is prepared for future enhancement to support:
 * - User-specific configuration overrides
 * - Organization-level settings
 * - Dynamic configuration updates
 * 
 * @param {string} [context] - Optional context identifier
 * @returns {DashboardConfig} Configuration for the given context
 */
export function getContextualDashboardConfig(context?: string): DashboardConfig {
  // Phase 1: Ignore context and return default configuration
  // Phase 2: Will implement context-aware configuration resolution
  return getDashboardConfig();
}

/**
 * Check if a specific feature should be visible in the current configuration
 * 
 * @param {string} featureName - Name of the feature to check
 * @returns {boolean} Whether the feature should be visible
 */
export function isFeatureVisible(featureName: string): boolean {
  const config = getDashboardConfig();
  
  switch (featureName) {
    case 'sidebar':
      return config.layout.showSidebar;
    case 'sustainabilityTab':
      return config.featureSettings.tabs.showSustainability;
    case 'settingsTab':
      return config.featureSettings.tabs.showSettings;
    case 'airtableSync':
      return config.featureSettings.airtable.enabled;
    case 'membershipTier':
      return config.featureSettings.directory.showMembershipTier;
    case 'advancedControls':
      return config.layout.showAdvancedControls;
    default:
      return false;
  }
}

/**
 * Get the list of visible form fields for the current configuration
 * 
 * @returns {readonly string[]} Array of field names that should be visible
 */
export function getVisibleFormFields(): readonly string[] {
  const config = getDashboardConfig();
  return config.form.visibleFields;
}

/**
 * Get the maximum number of tabs that should be displayed
 * 
 * @returns {number} Maximum number of tabs
 */
export function getMaxVisibleTabs(): number {
  const config = getDashboardConfig();
  return config.layout.maxTabs;
}