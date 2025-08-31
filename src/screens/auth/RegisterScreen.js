import React, {useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import {
  TextInput,
  Button,
  Card,
  Checkbox,
} from 'react-native-paper';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import Toast from 'react-native-toast-message';

const RegisterScreen = ({navigation, route}) => {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: '',
    phoneNumber: '',
  });
  const [agreeToTerms, setAgreeToTerms] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const userMode = route?.params?.userMode || 'user';

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value,
    }));
  };

  const validateForm = () => {
    if (!formData.fullName.trim()) {
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: 'Please enter your full name',
      });
      return false;
    }

    if (!formData.email.trim() || !formData.email.includes('@')) {
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: 'Please enter a valid email address',
      });
      return false;
    }

    if (formData.password.length < 6) {
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: 'Password must be at least 6 characters long',
      });
      return false;
    }

    if (formData.password !== formData.confirmPassword) {
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: 'Passwords do not match',
      });
      return false;
    }

    if (!agreeToTerms) {
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: 'Please agree to the terms and conditions',
      });
      return false;
    }

    return true;
  };

  const handleRegister = async () => {
    if (!validateForm()) return;

    setLoading(true);

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));

      // Create dummy user data
      const userData = {
        id: Date.now().toString(),
        fullName: formData.fullName,
        email: formData.email,
        phoneNumber: formData.phoneNumber,
        mode: userMode,
        token: 'dummy_token_' + Date.now(),
        createdAt: new Date().toISOString(),
        balance: {
          btc: '0.00000',
          eth: '0.00000',
          usdt: '0.00',
        },
      };

      await AsyncStorage.multiSet([
        ['userToken', userData.token],
        ['userData', JSON.stringify(userData)],
        ['userMode', userMode],
      ]);

      Toast.show({
        type: 'success',
        text1: 'Success',
        text2: 'Account created successfully!',
      });

      navigation.reset({
        index: 0,
        routes: [{name: userMode === 'user' ? 'UserApp' : 'MerchantApp'}],
      });
    } catch (error) {
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: 'Registration failed. Please try again.',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={styles.header}>
        <Icon 
          name={userMode === 'user' ? 'account-plus' : 'store-plus'} 
          size={50} 
          color="#6C63FF" 
        />
        <Text style={styles.title}>
          Create {userMode === 'user' ? 'User' : 'Merchant'} Account
        </Text>
        <Text style={styles.subtitle}>
          Join Cryptrapay and start your crypto journey
        </Text>
      </View>

      <Card style={styles.registerCard}>
        <Card.Content style={styles.cardContent}>
          <TextInput
            label="Full Name"
            value={formData.fullName}
            onChangeText={value => handleInputChange('fullName', value)}
            mode="outlined"
            left={<TextInput.Icon icon="account" />}
            style={styles.input}
          />

          <TextInput
            label="Email Address"
            value={formData.email}
            onChangeText={value => handleInputChange('email', value)}
            mode="outlined"
            keyboardType="email-address"
            autoCapitalize="none"
            left={<TextInput.Icon icon="email" />}
            style={styles.input}
          />

          <TextInput
            label="Phone Number"
            value={formData.phoneNumber}
            onChangeText={value => handleInputChange('phoneNumber', value)}
            mode="outlined"
            keyboardType="phone-pad"
            left={<TextInput.Icon icon="phone" />}
            style={styles.input}
          />

          <TextInput
            label="Password"
            value={formData.password}
            onChangeText={value => handleInputChange('password', value)}
            mode="outlined"
            secureTextEntry={!showPassword}
            left={<TextInput.Icon icon="lock" />}
            right={
              <TextInput.Icon
                icon={showPassword ? 'eye-off' : 'eye'}
                onPress={() => setShowPassword(!showPassword)}
              />
            }
            style={styles.input}
          />

          <TextInput
            label="Confirm Password"
            value={formData.confirmPassword}
            onChangeText={value => handleInputChange('confirmPassword', value)}
            mode="outlined"
            secureTextEntry={!showConfirmPassword}
            left={<TextInput.Icon icon="lock-check" />}
            right={
              <TextInput.Icon
                icon={showConfirmPassword ? 'eye-off' : 'eye'}
                onPress={() => setShowConfirmPassword(!showConfirmPassword)}
              />
            }
            style={styles.input}
          />

          <View style={styles.termsContainer}>
            <Checkbox
              status={agreeToTerms ? 'checked' : 'unchecked'}
              onPress={() => setAgreeToTerms(!agreeToTerms)}
              color="#6C63FF"
            />
            <View style={styles.termsText}>
              <Text style={styles.termsLabel}>I agree to the </Text>
              <TouchableOpacity>
                <Text style={styles.termsLink}>Terms & Conditions</Text>
              </TouchableOpacity>
              <Text style={styles.termsLabel}> and </Text>
              <TouchableOpacity>
                <Text style={styles.termsLink}>Privacy Policy</Text>
              </TouchableOpacity>
            </View>
          </View>

          <Button
            mode="contained"
            onPress={handleRegister}
            loading={loading}
            disabled={loading}
            style={styles.registerButton}
            contentStyle={styles.buttonContent}>
            Create Account
          </Button>

          <View style={styles.loginPrompt}>
            <Text style={styles.loginText}>Already have an account? </Text>
            <TouchableOpacity
              onPress={() => navigation.navigate('Login', {userMode})}>
              <Text style={styles.loginLink}>Sign In</Text>
            </TouchableOpacity>
          </View>
        </Card.Content>
      </Card>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  content: {
    paddingHorizontal: 20,
    paddingVertical: 40,
  },
  header: {
    alignItems: 'center',
    marginBottom: 30,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginTop: 10,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 14,
    color: '#666',
    marginTop: 5,
    textAlign: 'center',
  },
  registerCard: {
    elevation: 4,
    borderRadius: 15,
  },
  cardContent: {
    paddingVertical: 30,
  },
  input: {
    marginBottom: 15,
  },
  termsContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 25,
    paddingHorizontal: 5,
  },
  termsText: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    flex: 1,
    marginLeft: 10,
    alignItems: 'center',
  },
  termsLabel: {
    color: '#666',
    fontSize: 14,
  },
  termsLink: {
    color: '#6C63FF',
    fontWeight: 'bold',
    fontSize: 14,
  },
  registerButton: {
    borderRadius: 25,
    backgroundColor: '#6C63FF',
  },
  buttonContent: {
    height: 50,
  },
  loginPrompt: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 20,
  },
  loginText: {
    color: '#666',
  },
  loginLink: {
    color: '#6C63FF',
    fontWeight: 'bold',
  },
});

export default RegisterScreen;
