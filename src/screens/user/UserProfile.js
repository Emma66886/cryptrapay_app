import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Alert,
} from 'react-native';
import {
  List,
  Switch,
  Button,
  Avatar,
  Divider,
  Card,
} from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Toast from 'react-native-toast-message';

const UserProfile = ({navigation}) => {
  const [userData, setUserData] = useState(null);
  const [settings, setSettings] = useState({
    notifications: true,
    biometric: false,
    autoLock: true,
    darkMode: false,
  });

  useEffect(() => {
    loadUserData();
    loadSettings();
  }, []);

  const loadUserData = async () => {
    try {
      const data = await AsyncStorage.getItem('userData');
      if (data) {
        setUserData(JSON.parse(data));
      }
    } catch (error) {
      console.error('Error loading user data:', error);
    }
  };

  const loadSettings = async () => {
    try {
      const savedSettings = await AsyncStorage.getItem('userSettings');
      if (savedSettings) {
        setSettings({...settings, ...JSON.parse(savedSettings)});
      }
    } catch (error) {
      console.error('Error loading settings:', error);
    }
  };

  const updateSetting = async (key, value) => {
    const newSettings = {...settings, [key]: value};
    setSettings(newSettings);
    
    try {
      await AsyncStorage.setItem('userSettings', JSON.stringify(newSettings));
    } catch (error) {
      console.error('Error saving settings:', error);
    }
  };

  const handleLogout = () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to logout?',
      [
        {text: 'Cancel', style: 'cancel'},
        {text: 'Logout', style: 'destructive', onPress: confirmLogout},
      ]
    );
  };

  const confirmLogout = async () => {
    try {
      await AsyncStorage.multiRemove(['userToken', 'userData']);
      Toast.show({
        type: 'success',
        text1: 'Logged Out',
        text2: 'You have been successfully logged out',
      });
      navigation.reset({
        index: 0,
        routes: [{name: 'Login'}],
      });
    } catch (error) {
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: 'Failed to logout',
      });
    }
  };

  const handleSwitchMode = () => {
    Alert.alert(
      'Switch Mode',
      'Switch to Merchant Mode?',
      [
        {text: 'Cancel', style: 'cancel'},
        {text: 'Switch', onPress: () => switchToMerchant()},
      ]
    );
  };

  const switchToMerchant = async () => {
    try {
      await AsyncStorage.setItem('userMode', 'merchant');
      navigation.reset({
        index: 0,
        routes: [{name: 'MerchantApp'}],
      });
    } catch (error) {
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: 'Failed to switch mode',
      });
    }
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Profile</Text>
      </View>

      {/* User Info */}
      <Card style={styles.section}>
        <Card.Content style={styles.userInfo}>
          <Avatar.Text
            size={80}
            label={userData?.fullName?.charAt(0) || 'U'}
            style={styles.avatar}
          />
          <View style={styles.userDetails}>
            <Text style={styles.userName}>{userData?.fullName || 'User'}</Text>
            <Text style={styles.userEmail}>{userData?.email || 'user@example.com'}</Text>
            <Text style={styles.userMode}>User Mode</Text>
          </View>
        </Card.Content>
      </Card>

      {/* Account Section */}
      <Card style={styles.section}>
        <Card.Content>
          <Text style={styles.sectionTitle}>Account</Text>
          
          <List.Item
            title="Personal Information"
            description="Update your profile details"
            left={() => <Icon name="account-edit" size={24} color="#6C63FF" />}
            right={() => <Icon name="chevron-right" size={24} color="#666" />}
            onPress={() => {
              Toast.show({
                type: 'info',
                text1: 'Coming Soon',
                text2: 'Profile editing will be available soon',
              });
            }}
            style={styles.listItem}
          />
          
          <List.Item
            title="Security & Privacy"
            description="Manage your security settings"
            left={() => <Icon name="shield-check" size={24} color="#6C63FF" />}
            right={() => <Icon name="chevron-right" size={24} color="#666" />}
            onPress={() => {
              Toast.show({
                type: 'info',
                text1: 'Coming Soon',
                text2: 'Security settings will be available soon',
              });
            }}
            style={styles.listItem}
          />
          
          <List.Item
            title="Backup & Recovery"
            description="Secure your wallet"
            left={() => <Icon name="backup-restore" size={24} color="#6C63FF" />}
            right={() => <Icon name="chevron-right" size={24} color="#666" />}
            onPress={() => {
              Toast.show({
                type: 'info',
                text1: 'Coming Soon',
                text2: 'Backup options will be available soon',
              });
            }}
            style={styles.listItem}
          />
        </Card.Content>
      </Card>

      {/* Settings Section */}
      <Card style={styles.section}>
        <Card.Content>
          <Text style={styles.sectionTitle}>Settings</Text>
          
          <List.Item
            title="Push Notifications"
            description="Receive transaction alerts"
            left={() => <Icon name="bell" size={24} color="#6C63FF" />}
            right={() => (
              <Switch
                value={settings.notifications}
                onValueChange={(value) => updateSetting('notifications', value)}
                color="#6C63FF"
              />
            )}
            style={styles.listItem}
          />
          
          <List.Item
            title="Biometric Authentication"
            description="Use fingerprint or face unlock"
            left={() => <Icon name="fingerprint" size={24} color="#6C63FF" />}
            right={() => (
              <Switch
                value={settings.biometric}
                onValueChange={(value) => updateSetting('biometric', value)}
                color="#6C63FF"
              />
            )}
            style={styles.listItem}
          />
          
          <List.Item
            title="Auto-Lock"
            description="Lock app when inactive"
            left={() => <Icon name="lock" size={24} color="#6C63FF" />}
            right={() => (
              <Switch
                value={settings.autoLock}
                onValueChange={(value) => updateSetting('autoLock', value)}
                color="#6C63FF"
              />
            )}
            style={styles.listItem}
          />
        </Card.Content>
      </Card>

      {/* App Section */}
      <Card style={styles.section}>
        <Card.Content>
          <Text style={styles.sectionTitle}>App</Text>
          
          <List.Item
            title="Switch to Merchant Mode"
            description="Accept crypto payments"
            left={() => <Icon name="store" size={24} color="#03DAC4" />}
            right={() => <Icon name="chevron-right" size={24} color="#666" />}
            onPress={handleSwitchMode}
            style={styles.listItem}
          />
          
          <List.Item
            title="Help & Support"
            description="Get assistance"
            left={() => <Icon name="help-circle" size={24} color="#6C63FF" />}
            right={() => <Icon name="chevron-right" size={24} color="#666" />}
            onPress={() => {
              Toast.show({
                type: 'info',
                text1: 'Coming Soon',
                text2: 'Support center will be available soon',
              });
            }}
            style={styles.listItem}
          />
          
          <List.Item
            title="About"
            description="App version and info"
            left={() => <Icon name="information" size={24} color="#6C63FF" />}
            right={() => <Icon name="chevron-right" size={24} color="#666" />}
            onPress={() => {
              Alert.alert('About Cryptrapay', 'Version 1.0.0\n\nCryptrapay is a secure cryptocurrency payment platform.');
            }}
            style={styles.listItem}
          />
        </Card.Content>
      </Card>

      {/* Logout Button */}
      <View style={styles.logoutSection}>
        <Button
          mode="outlined"
          onPress={handleLogout}
          icon="logout"
          style={styles.logoutButton}
          textColor="#F44336">
          Logout
        </Button>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  header: {
    paddingTop: 40,
    paddingHorizontal: 20,
    paddingBottom: 20,
    backgroundColor: 'white',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
  },
  section: {
    marginHorizontal: 20,
    marginBottom: 15,
    elevation: 3,
    borderRadius: 15,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 10,
  },
  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 20,
  },
  avatar: {
    backgroundColor: '#6C63FF',
    marginRight: 20,
  },
  userDetails: {
    flex: 1,
  },
  userName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 5,
  },
  userEmail: {
    fontSize: 14,
    color: '#666',
    marginBottom: 5,
  },
  userMode: {
    fontSize: 12,
    color: '#6C63FF',
    fontWeight: '500',
  },
  listItem: {
    paddingVertical: 8,
  },
  logoutSection: {
    paddingHorizontal: 20,
    paddingVertical: 30,
  },
  logoutButton: {
    borderColor: '#F44336',
    borderRadius: 25,
  },
});

export default UserProfile;
