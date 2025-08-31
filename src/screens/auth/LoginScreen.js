import React, {useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Alert,
  TouchableOpacity,
} from 'react-native';
import {
  TextInput,
  Button,
  Card,
  Divider,
  Switch,
} from 'react-native-paper';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import Toast from 'react-native-toast-message';

const LoginScreen = ({navigation, route}) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [loading, setLoading] = useState(false);
  
  const userMode = route?.params?.userMode || 'user';

  const handleLogin = async () => {
    if (!email || !password) {
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: 'Please fill in all fields',
      });
      return;
    }

    setLoading(true);

    try {
      // Simulate API call with dummy data
      await new Promise(resolve => setTimeout(resolve, 1500));

      // Dummy authentication - accept any email/password combination
      const userData = {
        id: '1',
        email: email,
        name: email.split('@')[0],
        mode: userMode,
        token: 'dummy_token_' + Date.now(),
        balance: {
          btc: '0.00125',
          eth: '0.045',
          usdt: '250.00',
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
        text2: 'Login successful!',
      });

      navigation.reset({
        index: 0,
        routes: [{name: userMode === 'user' ? 'UserApp' : 'MerchantApp'}],
      });
    } catch (error) {
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: 'Login failed. Please try again.',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleBiometricLogin = () => {
    Alert.alert(
      'Biometric Authentication',
      'This feature will be implemented with real biometric authentication',
      [{text: 'OK'}]
    );
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={styles.header}>
        <Icon 
          name={userMode === 'user' ? 'account' : 'store'} 
          size={50} 
          color="#6C63FF" 
        />
        <Text style={styles.title}>
          {userMode === 'user' ? 'User Login' : 'Merchant Login'}
        </Text>
        <Text style={styles.subtitle}>
          Welcome back! Please sign in to continue
        </Text>
      </View>

      <Card style={styles.loginCard}>
        <Card.Content style={styles.cardContent}>
          <TextInput
            label="Email"
            value={email}
            onChangeText={setEmail}
            mode="outlined"
            keyboardType="email-address"
            autoCapitalize="none"
            left={<TextInput.Icon icon="email" />}
            style={styles.input}
          />

          <TextInput
            label="Password"
            value={password}
            onChangeText={setPassword}
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

          <View style={styles.options}>
            <View style={styles.rememberMe}>
              <Switch
                value={rememberMe}
                onValueChange={setRememberMe}
                color="#6C63FF"
              />
              <Text style={styles.rememberText}>Remember me</Text>
            </View>
            <TouchableOpacity>
              <Text style={styles.forgotPassword}>Forgot Password?</Text>
            </TouchableOpacity>
          </View>

          <Button
            mode="contained"
            onPress={handleLogin}
            loading={loading}
            disabled={loading}
            style={styles.loginButton}
            contentStyle={styles.buttonContent}>
            Login
          </Button>

          <Divider style={styles.divider} />

          <Button
            mode="outlined"
            onPress={handleBiometricLogin}
            style={styles.biometricButton}
            contentStyle={styles.buttonContent}
            icon="fingerprint">
            Login with Biometrics
          </Button>

          <View style={styles.registerPrompt}>
            <Text style={styles.registerText}>Don't have an account? </Text>
            <TouchableOpacity
              onPress={() => navigation.navigate('Register', {userMode})}>
              <Text style={styles.registerLink}>Sign Up</Text>
            </TouchableOpacity>
          </View>
        </Card.Content>
      </Card>

      <View style={styles.demoInfo}>
        <Text style={styles.demoText}>Demo Mode - Use any email/password</Text>
      </View>
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
  },
  subtitle: {
    fontSize: 14,
    color: '#666',
    marginTop: 5,
    textAlign: 'center',
  },
  loginCard: {
    elevation: 4,
    borderRadius: 15,
  },
  cardContent: {
    paddingVertical: 30,
  },
  input: {
    marginBottom: 15,
  },
  options: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 25,
  },
  rememberMe: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  rememberText: {
    marginLeft: 8,
    color: '#666',
  },
  forgotPassword: {
    color: '#6C63FF',
    fontWeight: '500',
  },
  loginButton: {
    borderRadius: 25,
    backgroundColor: '#6C63FF',
  },
  buttonContent: {
    height: 50,
  },
  divider: {
    marginVertical: 20,
  },
  biometricButton: {
    borderRadius: 25,
    borderColor: '#6C63FF',
  },
  registerPrompt: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 20,
  },
  registerText: {
    color: '#666',
  },
  registerLink: {
    color: '#6C63FF',
    fontWeight: 'bold',
  },
  demoInfo: {
    marginTop: 20,
    padding: 15,
    backgroundColor: '#E3F2FD',
    borderRadius: 10,
    alignItems: 'center',
  },
  demoText: {
    color: '#1976D2',
    fontSize: 12,
    textAlign: 'center',
  },
});

export default LoginScreen;
