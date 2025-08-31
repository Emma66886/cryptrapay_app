import React from 'react';
import {View, Text, StyleSheet} from 'react-native';
import {Button} from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

const QRPayment = ({navigation}) => {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Button
          mode="text"
          onPress={() => navigation.goBack()}
          textColor="#6C63FF">
          Back
        </Button>
        <Text style={styles.headerTitle}>QR Payment</Text>
        <View style={{width: 60}} />
      </View>

      <View style={styles.content}>
        <Icon name="qrcode-scan" size={100} color="#6C63FF" />
        <Text style={styles.title}>QR Code Scanner</Text>
        <Text style={styles.subtitle}>
          This feature will implement QR code scanning for payments
        </Text>
        
        <Button
          mode="contained"
          style={styles.button}
          onPress={() => navigation.goBack()}>
          Coming Soon
        </Button>
      </View>
    </View>
  );
};

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

export default QRPayment;
