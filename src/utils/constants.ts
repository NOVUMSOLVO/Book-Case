// App configuration constants
export const APP_CONFIG = {
  name: 'ZimbabweApps',
  description: 'Zimbabwe\'s premier mobile app marketplace',
  version: '1.0.0',
  supportEmail: 'support@zimbabweapps.co.zw',
  maxFileSize: {
    icon: 2 * 1024 * 1024, // 2MB
    screenshot: 5 * 1024 * 1024, // 5MB
    apk: 100 * 1024 * 1024, // 100MB
  },
  pagination: {
    defaultPageSize: 20,
    maxPageSize: 100,
  },
  validation: {
    minPasswordLength: 6,
    maxAppNameLength: 100,
    maxDescriptionLength: 5000,
  },
} as const;

// API endpoints
export const API_ENDPOINTS = {
  apps: '/api/apps',
  categories: '/api/categories',
  users: '/api/users',
  downloads: '/api/downloads',
  reviews: '/api/reviews',
} as const;

// Local storage keys
export const STORAGE_KEYS = {
  theme: 'book-case-theme',
  language: 'book-case-language',
  recentSearches: 'book-case-recent-searches',
} as const;

// Error messages
export const ERROR_MESSAGES = {
  network: 'Network error. Please check your connection.',
  unauthorized: 'You need to be logged in to perform this action.',
  forbidden: 'You don\'t have permission to perform this action.',
  notFound: 'The requested resource was not found.',
  validation: 'Please check your input and try again.',
  generic: 'Something went wrong. Please try again.',
} as const;

// Success messages
export const SUCCESS_MESSAGES = {
  login: 'Successfully logged in!',
  signup: 'Account created successfully!',
  logout: 'Successfully logged out!',
  appSubmitted: 'App submitted for review!',
  profileUpdated: 'Profile updated successfully!',
} as const;