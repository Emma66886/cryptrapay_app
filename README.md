# Cryptrapay Mobile App

A React Native cryptocurrency payment application with both user and merchant functionality, featuring NFC payments and QR code scanning.

## Features

### User App
- 🔐 Secure authentication with biometric support
- 💰 Multi-currency wallet (BTC, ETH, USDT)
- 💸 Send and receive cryptocurrency
- 📱 NFC tap-to-pay functionality
- 📋 QR code payments
- 📊 Transaction history
- 👤 User profile management

### Merchant App
- 🏪 Merchant dashboard with sales analytics
- 💳 Point of Sale system
- 📦 Inventory management
- 📈 Sales reporting
- 🔄 NFC payment reception
- 💰 Real-time payment processing

## Technology Stack

- **React Native** - Cross-platform mobile development
- **React Navigation** - Navigation and routing
- **React Native Paper** - Material Design components
- **React Native NFC Manager** - NFC functionality
- **React Native Vector Icons** - Icon library
- **AsyncStorage** - Local data persistence
- **Linear Gradient** - UI enhancements

## Getting Started

### Prerequisites

- Node.js (>= 16)
- React Native development environment
- Android Studio (for Android)
- Xcode (for iOS)

### Installation

1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd cryptrapay_app
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Install iOS dependencies (iOS only):
   ```bash
   cd ios && pod install && cd ..
   ```

### Running the App

#### Android
```bash
npm run android
```

#### iOS
```bash
npm run ios
```

#### Development Server
```bash
npm start
```

## Build Instructions

### Android APK
```bash
npm run build:android
```

### iOS Archive
```bash
npm run build:ios
```

## Demo Mode

The app currently runs in demo mode with dummy data:
- Use any email/password combination to login
- All transactions are simulated
- NFC functionality shows demo interactions
- No real cryptocurrency transactions occur

## Project Structure

```
src/
├── App.js                      # Main app component
├── screens/
│   ├── auth/                   # Authentication screens
│   │   ├── LoginScreen.js
│   │   ├── RegisterScreen.js
│   │   └── UserModeSelection.js
│   ├── user/                   # User app screens
│   │   ├── UserDashboard.js
│   │   ├── UserWallet.js
│   │   ├── UserSend.js
│   │   ├── UserReceive.js
│   │   ├── UserTransactions.js
│   │   ├── UserProfile.js
│   │   ├── NFCPayment.js
│   │   └── QRPayment.js
│   ├── merchant/               # Merchant app screens
│   │   ├── MerchantDashboard.js
│   │   └── PlaceholderScreens.js
│   ├── OnboardingScreen.js
│   └── SplashScreen.js
```

## Features in Development

- [ ] Real API integration
- [ ] Enhanced security features
- [ ] More cryptocurrency support
- [ ] Advanced analytics
- [ ] Push notifications
- [ ] Offline functionality

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Support

For support and questions, please contact the development team or create an issue in the repository.