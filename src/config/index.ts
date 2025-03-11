export const CONFIG = {
  // API Configuration
  API_URL: __DEV__ ? 'http://localhost:3000' : 'https://api.whalebyte.com',
  
  // Blockchain Configuration
  BLOCKCHAIN: {
    NETWORK: __DEV__ ? 'testnet' : 'mainnet',
    CONTRACT_ADDRESS: __DEV__ 
      ? '0x1234567890123456789012345678901234567890'
      : '0x9876543210987654321098765432109876543210',
    RPC_URL: __DEV__
      ? 'https://testnet.infura.io/v3/your-project-id'
      : 'https://mainnet.infura.io/v3/your-project-id',
  },

  // Storage Configuration
  STORAGE: {
    IPFS_GATEWAY: 'https://ipfs.io/ipfs/',
    IPFS_API: 'https://ipfs.infura.io:5001',
  },

  // Authentication Configuration
  AUTH: {
    JWT_KEY: '@whalebyte_jwt',
    WALLET_KEY: '@whalebyte_wallet',
  },

  // Feature Flags
  FEATURES: {
    ENABLE_AI_MODERATION: true,
    ENABLE_COMMUNITY_VOTING: true,
    ENABLE_PREMIUM_SPHERES: true,
  },

  // Moderation Configuration
  MODERATION: {
    MIN_VOTES_REQUIRED: 5,
    REMOVE_THRESHOLD_PERCENTAGE: 60,
    AI_CONFIDENCE_THRESHOLD: 0.8,
    REPORT_CATEGORIES: [
      'inappropriate_content',
      'hate_speech',
      'misinformation',
      'spam',
      'harassment',
      'violence',
      'copyright',
      'other',
    ] as const,
  },

  // Token Configuration
  TOKENS: {
    INITIAL_BALANCE: 100,
    MIN_APPRECIATION_AMOUNT: 1,
    MAX_APPRECIATION_AMOUNT: 100,
    SPHERE_CREATION_COST: 500,
  },

  // UI Configuration
  UI: {
    THEME: {
      PRIMARY_COLOR: '#0000ff',
      SECONDARY_COLOR: '#4CAF50',
      BACKGROUND_COLOR: '#f5f5f5',
      TEXT_COLOR: '#333333',
      ERROR_COLOR: '#f44336',
      SUCCESS_COLOR: '#4CAF50',
      WARNING_COLOR: '#ffd700',
    },
    ANIMATION: {
      DEFAULT_DURATION: 300,
    },
  },

  // Development Configuration
  DEV: {
    ENABLE_LOGGING: true,
    SIMULATE_NETWORK_DELAY: true,
    NETWORK_DELAY_MS: 500,
  },
} as const;

// Type definitions for configuration
export type Config = typeof CONFIG;
export type ThemeColors = typeof CONFIG.UI.THEME;
export type ReportCategory = typeof CONFIG.MODERATION.REPORT_CATEGORIES[number];