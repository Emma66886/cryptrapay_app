import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  StyleSheet,
  Animated,
  Alert,
  Vibration,
  Platform,
} from 'react-native';
import {Button, Card, Portal, Modal, TextInput} from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import NfcManager, {NfcTech, Ndef} from 'react-native-nfc-manager';
import Toast from 'react-native-toast-message';

const NFCPayment = ({navigation, route}) => {
  const [isScanning, setIsScanning] = useState(false);
  const [paymentData, setPaymentData] = useState(null);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [pin, setPin] = useState('');
  const [loading, setLoading] = useState(false);
  const pulseAnim = new Animated.Value(1);

  const paymentInfo = route?.params || {
    amount: '0.00',
    currency: 'USDT',
    merchant: 'Unknown',
  };

  useEffect(() => {
    initNFC();
    return () => {
      NfcManager.cancelTechnologyRequest();
    };
  }, []);

  useEffect(() => {
    if (isScanning) {
      startPulseAnimation();
    } else {
      pulseAnim.setValue(1);
    }
  }, [isScanning]);

  const initNFC = async () => {
    try {
      const supported = await NfcManager.isSupported();
      if (!supported) {
        Alert.alert(
          'NFC Not Supported',
          'Your device does not support NFC functionality.',
          [{text: 'OK', onPress: () => navigation.goBack()}]
        );
        return;
      }

      const enabled = await NfcManager.isEnabled();
      if (!enabled) {
        Alert.alert(
          'NFC Disabled',
          'Please enable NFC in your device settings.',
          [
            {text: 'Cancel', onPress: () => navigation.goBack()},
            {text: 'Settings', onPress: () => NfcManager.goToNfcSetting()},
          ]
        );
        return;
      }

      await NfcManager.start();
    } catch (error) {
      console.error('NFC initialization error:', error);
      Toast.show({
        type: 'error',
        text1: 'NFC Error',
        text2: 'Failed to initialize NFC',
      });
    }
  };

  const startPulseAnimation = () => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.2,
          duration: 1000,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
        }),
      ])
    ).start();
  };

  const startNFCScanning = async () => {
    try {
      setIsScanning(true);
      
      await NfcManager.requestTechnology(NfcTech.Ndef);
      
      const tag = await NfcManager.getTag();
      
      if (tag) {
        Vibration.vibrate(100);
        
        // Simulate reading payment data from NFC tag
        const simulatedPaymentData = {
          merchantId: 'merchant_123',
          merchantName: paymentInfo.merchant || 'Coffee Shop',
          amount: paymentInfo.amount || '15.50',
          currency: paymentInfo.currency || 'USDT',
          transactionId: 'tx_' + Date.now(),
        };
        
        setPaymentData(simulatedPaymentData);
        setShowConfirmModal(true);
      }
    } catch (error) {
      console.error('NFC scanning error:', error);
      Toast.show({
        type: 'error',
        text1: 'NFC Error',
        text2: 'Failed to read NFC tag',
      });
    } finally {
      setIsScanning(false);
      NfcManager.cancelTechnologyRequest();
    }
  };

  const confirmPayment = async () => {
    if (!pin || pin.length < 4) {
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: 'Please enter your 4-digit PIN',
      });
      return;
    }

    setLoading(true);

    try {
      // Simulate payment processing
      await new Promise(resolve => setTimeout(resolve, 2000));

      // Simulate successful payment
      Toast.show({
        type: 'success',
        text1: 'Payment Successful!',
        text2: `Paid ${paymentData.amount} ${paymentData.currency} to ${paymentData.merchantName}`,
      });

      setShowConfirmModal(false);
      navigation.goBack();
    } catch (error) {
      Toast.show({
        type: 'error',
        text1: 'Payment Failed',
        text2: 'Please try again',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Button
          mode="text"
          onPress={() => navigation.goBack()}
          textColor="#6C63FF">
          Cancel
        </Button>
        <Text style={styles.headerTitle}>NFC Payment</Text>
        <View style={{width: 60}} />
      </View>

      <View style={styles.content}>
        <View style={styles.instructionSection}>
          <Text style={styles.instructionTitle}>
            {isScanning ? 'Scanning for NFC...' : 'Ready to Pay with NFC'}
          </Text>
          <Text style={styles.instructionText}>
            {isScanning
              ? 'Hold your phone near the merchant\'s NFC terminal'
              : 'Tap the NFC icon below to start scanning'}
          </Text>
        </View>

        <View style={styles.nfcSection}>
          <Animated.View
            style={[
              styles.nfcIconContainer,
              {transform: [{scale: pulseAnim}]},
              isScanning && styles.nfcScanning,
            ]}>
            <Icon
              name="nfc"
              size={100}
              color={isScanning ? '#03DAC4' : '#6C63FF'}
            />
          </Animated.View>
          
          {!isScanning && (
            <Button
              mode="contained"
              onPress={startNFCScanning}
              style={styles.scanButton}
              contentStyle={styles.scanButtonContent}
              icon="nfc-tap">
              Start NFC Scan
            </Button>
          )}
          
          {isScanning && (
            <Button
              mode="outlined"
              onPress={() => {
                setIsScanning(false);
                NfcManager.cancelTechnologyRequest();
              }}
              style={styles.cancelButton}
              textColor="#FF6B6B">
              Cancel Scan
            </Button>
          )}
        </View>

        <View style={styles.infoSection}>
          <Card style={styles.infoCard}>
            <Card.Content>
              <Text style={styles.infoTitle}>How NFC Payments Work</Text>
              <View style={styles.infoItem}>
                <Icon name="numeric-1-circle" size={20} color="#6C63FF" />
                <Text style={styles.infoText}>Tap "Start NFC Scan"</Text>
              </View>
              <View style={styles.infoItem}>
                <Icon name="numeric-2-circle" size={20} color="#6C63FF" />
                <Text style={styles.infoText}>Hold phone near NFC terminal</Text>
              </View>
              <View style={styles.infoItem}>
                <Icon name="numeric-3-circle" size={20} color="#6C63FF" />
                <Text style={styles.infoText}>Confirm payment details</Text>
              </View>
              <View style={styles.infoItem}>
                <Icon name="numeric-4-circle" size={20} color="#6C63FF" />
                <Text style={styles.infoText}>Enter PIN to complete payment</Text>
              </View>
            </Card.Content>
          </Card>
        </View>
      </View>

      {/* Payment Confirmation Modal */}
      <Portal>
        <Modal
          visible={showConfirmModal}
          onDismiss={() => setShowConfirmModal(false)}
          contentContainerStyle={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Icon name="nfc-tap" size={50} color="#4CAF50" />
            <Text style={styles.modalTitle}>Confirm Payment</Text>
            
            {paymentData && (
              <View style={styles.paymentDetails}>
                <View style={styles.detailRow}>
                  <Text style={styles.detailLabel}>Merchant:</Text>
                  <Text style={styles.detailValue}>{paymentData.merchantName}</Text>
                </View>
                <View style={styles.detailRow}>
                  <Text style={styles.detailLabel}>Amount:</Text>
                  <Text style={styles.detailValue}>
                    {paymentData.amount} {paymentData.currency}
                  </Text>
                </View>
                <View style={styles.detailRow}>
                  <Text style={styles.detailLabel}>Transaction ID:</Text>
                  <Text style={styles.detailValue}>{paymentData.transactionId}</Text>
                </View>
              </View>
            )}

            <TextInput
              label="Enter PIN"
              value={pin}
              onChangeText={setPin}
              mode="outlined"
              secureTextEntry
              keyboardType="numeric"
              maxLength={4}
              style={styles.pinInput}
              placeholder="4-digit PIN"
            />

            <View style={styles.modalActions}>
              <Button
                mode="outlined"
                onPress={() => setShowConfirmModal(false)}
                style={styles.modalButton}
                disabled={loading}>
                Cancel
              </Button>
              <Button
                mode="contained"
                onPress={confirmPayment}
                loading={loading}
                disabled={loading}
                style={[styles.modalButton, styles.confirmButton]}>
                Confirm Payment
              </Button>
            </View>
          </View>
        </Modal>
      </Portal>
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
    paddingHorizontal: 20,
  },
  instructionSection: {
    alignItems: 'center',
    marginVertical: 30,
  },
  instructionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 10,
    textAlign: 'center',
  },
  instructionText: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    lineHeight: 20,
  },
  nfcSection: {
    alignItems: 'center',
    marginVertical: 40,
  },
  nfcIconContainer: {
    width: 200,
    height: 200,
    borderRadius: 100,
    backgroundColor: 'white',
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 8,
    marginBottom: 30,
  },
  nfcScanning: {
    backgroundColor: '#E8F5E8',
  },
  scanButton: {
    backgroundColor: '#6C63FF',
    borderRadius: 25,
    paddingHorizontal: 20,
  },
  scanButtonContent: {
    height: 50,
  },
  cancelButton: {
    borderColor: '#FF6B6B',
    borderRadius: 25,
  },
  infoSection: {
    marginTop: 20,
  },
  infoCard: {
    elevation: 3,
    borderRadius: 15,
  },
  infoTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 15,
  },
  infoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  infoText: {
    marginLeft: 10,
    fontSize: 14,
    color: '#666',
  },
  modalContainer: {
    backgroundColor: 'white',
    padding: 20,
    margin: 20,
    borderRadius: 15,
  },
  modalContent: {
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginTop: 15,
    marginBottom: 20,
  },
  paymentDetails: {
    width: '100%',
    marginBottom: 20,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#EEE',
  },
  detailLabel: {
    fontSize: 14,
    color: '#666',
  },
  detailValue: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#333',
  },
  pinInput: {
    width: '100%',
    marginBottom: 20,
  },
  modalActions: {
    flexDirection: 'row',
    width: '100%',
    justifyContent: 'space-between',
  },
  modalButton: {
    flex: 1,
    marginHorizontal: 5,
    borderRadius: 25,
  },
  confirmButton: {
    backgroundColor: '#4CAF50',
  },
});

export default NFCPayment;
