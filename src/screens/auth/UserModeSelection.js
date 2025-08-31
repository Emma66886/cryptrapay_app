import React, {useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
} from 'react-native';
import {Button, Card} from 'react-native-paper';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

const {width} = Dimensions.get('window');

const UserModeSelection = ({navigation}) => {
  const [selectedMode, setSelectedMode] = useState(null);

  const handleModeSelection = async (mode) => {
    try {
      await AsyncStorage.setItem('userMode', mode);
      setSelectedMode(mode);
      navigation.navigate('Login', {userMode: mode});
    } catch (error) {
      console.error('Error saving user mode:', error);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Icon name="account-switch" size={60} color="#6C63FF" />
        <Text style={styles.title}>Choose Your Mode</Text>
        <Text style={styles.subtitle}>
          Select how you want to use Cryptrapay
        </Text>
      </View>

      <View style={styles.modesContainer}>
        <TouchableOpacity
          style={styles.modeCard}
          onPress={() => handleModeSelection('user')}>
          <Card style={styles.card}>
            <Card.Content style={styles.cardContent}>
              <Icon name="account" size={50} color="#6C63FF" />
              <Text style={styles.modeTitle}>User Mode</Text>
              <Text style={styles.modeDescription}>
                Pay for goods and services using cryptocurrency
              </Text>
              <View style={styles.features}>
                <Text style={styles.feature}>• Send & Receive Payments</Text>
                <Text style={styles.feature}>• QR Code Scanning</Text>
                <Text style={styles.feature}>• NFC Payments</Text>
                <Text style={styles.feature}>• Transaction History</Text>
              </View>
            </Card.Content>
          </Card>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.modeCard}
          onPress={() => handleModeSelection('merchant')}>
          <Card style={styles.card}>
            <Card.Content style={styles.cardContent}>
              <Icon name="store" size={50} color="#03DAC4" />
              <Text style={styles.modeTitle}>Merchant Mode</Text>
              <Text style={styles.modeDescription}>
                Accept cryptocurrency payments from customers
              </Text>
              <View style={styles.features}>
                <Text style={styles.feature}>• Point of Sale System</Text>
                <Text style={styles.feature}>• Inventory Management</Text>
                <Text style={styles.feature}>• Sales Analytics</Text>
                <Text style={styles.feature}>• NFC Payment Reception</Text>
              </View>
            </Card.Content>
          </Card>
        </TouchableOpacity>
      </View>

      <View style={styles.footer}>
        <Text style={styles.footerText}>
          You can always switch modes later in settings
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
    paddingHorizontal: 20,
  },
  header: {
    alignItems: 'center',
    paddingTop: 60,
    paddingBottom: 40,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#333',
    marginTop: 20,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    marginTop: 10,
    textAlign: 'center',
  },
  modesContainer: {
    flex: 1,
    justifyContent: 'center',
  },
  modeCard: {
    marginBottom: 20,
  },
  card: {
    elevation: 4,
    borderRadius: 15,
  },
  cardContent: {
    alignItems: 'center',
    paddingVertical: 30,
  },
  modeTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#333',
    marginTop: 15,
    marginBottom: 10,
  },
  modeDescription: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    marginBottom: 20,
  },
  features: {
    alignSelf: 'stretch',
  },
  feature: {
    fontSize: 14,
    color: '#555',
    marginBottom: 5,
    paddingLeft: 20,
  },
  footer: {
    paddingBottom: 40,
    alignItems: 'center',
  },
  footerText: {
    fontSize: 12,
    color: '#888',
    textAlign: 'center',
  },
});

export default UserModeSelection;
