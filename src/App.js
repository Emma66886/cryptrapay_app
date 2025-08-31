import React, {useEffect, useState} from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {createStackNavigator} from '@react-navigation/stack';
import {Provider as PaperProvider, DefaultTheme} from 'react-native-paper';
import Toast from 'react-native-toast-message';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Screens
import SplashScreen from './screens/SplashScreen';
import OnboardingScreen from './screens/OnboardingScreen';
import LoginScreen from './screens/auth/LoginScreen';
import RegisterScreen from './screens/auth/RegisterScreen';
import UserModeSelection from './screens/auth/UserModeSelection';

// User App Screens
import UserDashboard from './screens/user/UserDashboard';
import UserWallet from './screens/user/UserWallet';
import UserSend from './screens/user/UserSend';
import UserReceive from './screens/user/UserReceive';
import UserTransactions from './screens/user/UserTransactions';
import UserProfile from './screens/user/UserProfile';
import QRPayment from './screens/user/QRPayment';
import NFCPayment from './screens/user/NFCPayment';

// Merchant App Screens
import MerchantDashboard from './screens/merchant/MerchantDashboard';
import {
  MerchantPOS,
  MerchantInventory,
  MerchantSales,
  MerchantSettings,
  CreatePaymentRequest,
  NFCReceive,
} from './screens/merchant/PlaceholderScreens';

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

const theme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    primary: '#6C63FF',
    accent: '#03DAC4',
    surface: '#FFFFFF',
    background: '#F5F5F5',
  },
};

// User Tab Navigator
const UserTabs = () => (
  <Tab.Navigator
    screenOptions={({route}) => ({
      tabBarIcon: ({focused, color, size}) => {
        let iconName;
        switch (route.name) {
          case 'Dashboard':
            iconName = 'view-dashboard';
            break;
          case 'Wallet':
            iconName = 'wallet';
            break;
          case 'Send':
            iconName = 'send';
            break;
          case 'Receive':
            iconName = 'qrcode-scan';
            break;
          case 'Transactions':
            iconName = 'history';
            break;
          case 'Profile':
            iconName = 'account';
            break;
        }
        return <Icon name={iconName} size={size} color={color} />;
      },
      tabBarActiveTintColor: '#6C63FF',
      tabBarInactiveTintColor: 'gray',
      headerShown: false,
    })}>
    <Tab.Screen name="Dashboard" component={UserDashboard} />
    <Tab.Screen name="Wallet" component={UserWallet} />
    <Tab.Screen name="Send" component={UserSend} />
    <Tab.Screen name="Receive" component={UserReceive} />
    <Tab.Screen name="Transactions" component={UserTransactions} />
    <Tab.Screen name="Profile" component={UserProfile} />
  </Tab.Navigator>
);

// Merchant Tab Navigator
const MerchantTabs = () => (
  <Tab.Navigator
    screenOptions={({route}) => ({
      tabBarIcon: ({focused, color, size}) => {
        let iconName;
        switch (route.name) {
          case 'Dashboard':
            iconName = 'view-dashboard';
            break;
          case 'POS':
            iconName = 'cash-register';
            break;
          case 'Inventory':
            iconName = 'package-variant';
            break;
          case 'Sales':
            iconName = 'chart-line';
            break;
          case 'Settings':
            iconName = 'cog';
            break;
        }
        return <Icon name={iconName} size={size} color={color} />;
      },
      tabBarActiveTintColor: '#6C63FF',
      tabBarInactiveTintColor: 'gray',
      headerShown: false,
    })}>
    <Tab.Screen name="Dashboard" component={MerchantDashboard} />
    <Tab.Screen name="POS" component={MerchantPOS} />
    <Tab.Screen name="Inventory" component={MerchantInventory} />
    <Tab.Screen name="Sales" component={MerchantSales} />
    <Tab.Screen name="Settings" component={MerchantSettings} />
  </Tab.Navigator>
);

const App = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [isFirstTime, setIsFirstTime] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userMode, setUserMode] = useState('user'); // 'user' or 'merchant'

  useEffect(() => {
    checkAppState();
  }, []);

  const checkAppState = async () => {
    try {
      const firstTime = await AsyncStorage.getItem('isFirstTime');
      const token = await AsyncStorage.getItem('userToken');
      const mode = await AsyncStorage.getItem('userMode');

      setIsFirstTime(firstTime === null);
      setIsAuthenticated(token !== null);
      setUserMode(mode || 'user');
    } catch (error) {
      console.error('Error checking app state:', error);
    } finally {
      setTimeout(() => setIsLoading(false), 2000); // Show splash for 2 seconds
    }
  };

  if (isLoading) {
    return <SplashScreen />;
  }

  return (
    <PaperProvider theme={theme}>
      <NavigationContainer>
        <Stack.Navigator screenOptions={{headerShown: false}}>
          {isFirstTime ? (
            <Stack.Screen name="Onboarding" component={OnboardingScreen} />
          ) : !isAuthenticated ? (
            <>
              <Stack.Screen name="UserModeSelection" component={UserModeSelection} />
              <Stack.Screen name="Login" component={LoginScreen} />
              <Stack.Screen name="Register" component={RegisterScreen} />
            </>
          ) : (
            <>
              {userMode === 'user' ? (
                <>
                  <Stack.Screen name="UserApp" component={UserTabs} />
                  <Stack.Screen name="QRPayment" component={QRPayment} />
                  <Stack.Screen name="NFCPayment" component={NFCPayment} />
                </>
              ) : (
                <>
                  <Stack.Screen name="MerchantApp" component={MerchantTabs} />
                  <Stack.Screen name="CreatePaymentRequest" component={CreatePaymentRequest} />
                  <Stack.Screen name="NFCReceive" component={NFCReceive} />
                </>
              )}
            </>
          )}
        </Stack.Navigator>
        <Toast />
      </NavigationContainer>
    </PaperProvider>
  );
};

export default App;
