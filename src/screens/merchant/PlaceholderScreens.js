// Placeholder screens for remaining functionality

import React from 'react';
import {View, Text, StyleSheet} from 'react-native';
import {Button} from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

const PlaceholderScreen = ({navigation, title, icon, subtitle}) => (
  <View style={styles.container}>
    <View style={styles.header}>
      <Button
        mode="text"
        onPress={() => navigation.goBack()}
        textColor="#6C63FF">
        Back
      </Button>
      <Text style={styles.headerTitle}>{title}</Text>
      <View style={{width: 60}} />
    </View>

    <View style={styles.content}>
      <Icon name={icon} size={100} color="#6C63FF" />
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.subtitle}>{subtitle}</Text>
      
      <Button
        mode="contained"
        style={styles.button}
        onPress={() => navigation.goBack()}>
        Coming Soon
      </Button>
    </View>
  </View>
);

// Merchant Screens
export const MerchantPOS = ({navigation}) => (
  <PlaceholderScreen
    navigation={navigation}
    title="Point of Sale"
    icon="cash-register"
    subtitle="Create and manage sales transactions"
  />
);

export const MerchantInventory = ({navigation}) => (
  <PlaceholderScreen
    navigation={navigation}
    title="Inventory Management"
    icon="package-variant"
    subtitle="Manage your products and inventory"
  />
);

export const MerchantSales = ({navigation}) => (
  <PlaceholderScreen
    navigation={navigation}
    title="Sales Analytics"
    icon="chart-line"
    subtitle="View detailed sales reports and analytics"
  />
);

export const MerchantSettings = ({navigation}) => (
  <PlaceholderScreen
    navigation={navigation}
    title="Merchant Settings"
    icon="cog"
    subtitle="Configure your merchant account settings"
  />
);

export const CreatePaymentRequest = ({navigation}) => (
  <PlaceholderScreen
    navigation={navigation}
    title="Create Payment Request"
    icon="cash-plus"
    subtitle="Create a payment request for customers"
  />
);

export const NFCReceive = ({navigation}) => (
  <PlaceholderScreen
    navigation={navigation}
    title="NFC Receive"
    icon="nfc-tap"
    subtitle="Receive NFC payments from customers"
  />
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 40,
    paddingHorizontal: 20,
    paddingBottom: 10,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginTop: 20,
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginBottom: 40,
  },
  button: {
    backgroundColor: '#6C63FF',
    borderRadius: 25,
    paddingHorizontal: 30,
  },
});
