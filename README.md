# WhaleByte Mobile App

A decentralized social media platform that combines blockchain technology with community-driven content moderation.

## Features

- Decentralized social platform
- Token-based interaction system
- Community-driven content moderation
- Themed communities (Spheres)
- AI-assisted content monitoring
- Transparent transaction history

## Getting Started

### Prerequisites

- Node.js (v14 or later)
- npm or yarn
- Expo CLI (`npm install -g expo-cli`)
- iOS Simulator (for Mac users) or Android Emulator
- Expo Go app on your physical device (optional)

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/TenmaAsh/whalebyte-mobile.git
   cd whalebyte-mobile
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm start
   ```

   Or use the setup script:
   ```bash
   chmod +x setup.sh
   ./setup.sh
   ```

4. Run on your device:
   - Scan the QR code with Expo Go (Android) or Camera app (iOS)
   - Press 'i' for iOS simulator
   - Press 'a' for Android emulator

## Testing

The app includes a test environment for trying out features:

1. Navigate to the "Test Moderation" tab
2. Use the test dashboard to:
   - Create test posts
   - Report content
   - Review moderation queue
   - Test AI moderation
   - Try community voting

## Development

### Project Structure

```
src/
├── components/     # Reusable UI components
├── contexts/       # React Context providers
├── screens/        # Screen components
├── services/       # API and mock services
├── types/         # TypeScript definitions
├── utils/         # Helper functions
└── config/        # App configuration
```

### Mock Data

The app includes mock data for testing:
- Test users with different roles
- Sample posts and comments
- Test spheres (communities)
- Moderation reports
- Transaction history

### Configuration

Edit `src/config/index.ts` to modify:
- API endpoints
- Blockchain settings
- Feature flags
- UI theme
- Moderation rules
- Token economics

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.