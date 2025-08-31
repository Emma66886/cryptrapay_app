import React, {useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  StatusBar,
  Image,
} from 'react-native';
import {Button} from 'react-native-paper';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

const {width} = Dimensions.get('window');

const onboardingData = [
  {
    id: 1,
    title: 'Welcome to Cryptrapay',
    description: 'Your gateway to seamless cryptocurrency payments',
    icon: 'currency-btc',
    color: '#6C63FF',
  },
  {
    id: 2,
    title: 'Secure Transactions',
    description: 'Bank-level security with biometric authentication',
    icon: 'shield-check',
    color: '#03DAC4',
  },
  {
    id: 3,
    title: 'NFC Payments',
    description: 'Tap to pay with Near Field Communication technology',
    icon: 'nfc-tap',
    color: '#FF6B6B',
  },
  {
    id: 4,
    title: 'Merchant & User',
    description: 'Two modes: Pay as a customer or receive as a merchant',
    icon: 'swap-horizontal',
    color: '#4ECDC4',
  },
];

const OnboardingScreen = ({navigation}) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const handleNext = () => {
    if (currentIndex < onboardingData.length - 1) {
      setCurrentIndex(currentIndex + 1);
    } else {
      completeOnboarding();
    }
  };

  const handleSkip = () => {
    completeOnboarding();
  };

  const completeOnboarding = async () => {
    try {
      await AsyncStorage.setItem('isFirstTime', 'false');
      navigation.replace('UserModeSelection');
    } catch (error) {
      console.error('Error completing onboarding:', error);
    }
  };

  const currentItem = onboardingData[currentIndex];

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="white" />
      
      <View style={styles.header}>
        <Button mode="text" onPress={handleSkip} textColor="#666">
          Skip
        </Button>
      </View>

      <View style={styles.content}>
        <View style={[styles.iconContainer, {backgroundColor: currentItem.color}]}>
          <Icon name={currentItem.icon} size={80} color="white" />
        </View>

        <Text style={styles.title}>{currentItem.title}</Text>
        <Text style={styles.description}>{currentItem.description}</Text>
      </View>

      <View style={styles.footer}>
        <View style={styles.pagination}>
          {onboardingData.map((_, index) => (
            <View
              key={index}
              style={[
                styles.dot,
                {
                  backgroundColor:
                    index === currentIndex ? currentItem.color : '#E0E0E0',
                },
              ]}
            />
          ))}
        </View>

        <Button
          mode="contained"
          onPress={handleNext}
          style={[styles.nextButton, {backgroundColor: currentItem.color}]}
          contentStyle={styles.nextButtonContent}>
          {currentIndex === onboardingData.length - 1 ? 'Get Started' : 'Next'}
        </Button>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 20,
    alignItems: 'flex-end',
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
  },
  iconContainer: {
    width: 150,
    height: 150,
    borderRadius: 75,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 40,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#333',
    textAlign: 'center',
    marginBottom: 20,
  },
  description: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    lineHeight: 24,
  },
  footer: {
    paddingHorizontal: 40,
    paddingBottom: 40,
  },
  pagination: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 40,
  },
  dot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginHorizontal: 5,
  },
  nextButton: {
    borderRadius: 25,
  },
  nextButtonContent: {
    height: 50,
  },
});

export default OnboardingScreen;
