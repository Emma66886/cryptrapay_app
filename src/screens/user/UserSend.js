import React, {useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Alert,
} from 'react-native';
import {
  TextInput,
  Button,
  Card,
  RadioButton,
  Chip,
} from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import Toast from 'react-native-toast-message';

const UserSend = ({navigation, route}) => {
  const [recipient, setRecipient] = useState('');
  const [amount, setAmount] = useState('');
  const [currency, setCurrency] = useState(route?.params?.currency || 'USDT');
  const [note, setNote] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('address');
  const [loading, setLoading] = useState(false);

  const currencies = [
    {symbol: 'BTC', name: 'Bitcoin', balance: '0.00125'},
    {symbol: 'ETH', name: 'Ethereum', balance: '0.045'},
    {symbol: 'USDT', name: 'Tether', balance: '250.00'},
  ];

  const paymentMethods = [
    {value: 'address', label: 'Wallet Address', icon: 'wallet'},
    {value: 'qr', label: 'Scan QR Code', icon: 'qrcode-scan'},
    {value: 'contact', label: 'From Contacts', icon: 'account-group'},
  ];

  const validateForm = () => {
    if (!recipient.trim()) {
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: 'Please enter recipient information',
      });
      return false;
    }

    if (!amount || parseFloat(amount) <= 0) {
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: 'Please enter a valid amount',
      });
      return false;
    }

    const selectedCurrency = currencies.find(c => c.symbol === currency);
    if (parseFloat(amount) > parseFloat(selectedCurrency.balance)) {
      Toast.show({
        type: 'error',
        text1: 'Insufficient Balance',
        text2: `You don't have enough ${currency}`,
      });
      return false;
    }

    return true;
  };

  const handleSend = async () => {
    if (!validateForm()) return;

    Alert.alert(
      'Confirm Transaction',
      `Send ${amount} ${currency} to ${recipient}?`,
      [
        {text: 'Cancel', style: 'cancel'},
        {text: 'Confirm', onPress: confirmTransaction},
      ]
    );
  };

  const confirmTransaction = async () => {
    setLoading(true);

    try {
      // Simulate transaction processing
      await new Promise(resolve => setTimeout(resolve, 2000));

      Toast.show({
        type: 'success',
        text1: 'Transaction Sent!',
        text2: `${amount} ${currency} sent successfully`,
      });

      navigation.goBack();
    } catch (error) {
      Toast.show({
        type: 'error',
        text1: 'Transaction Failed',
        text2: 'Please try again',
      });
    } finally {
      setLoading(false);
    }
  };

  const selectedCurrency = currencies.find(c => c.symbol === currency);

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Button
          mode="text"
          onPress={() => navigation.goBack()}
          textColor="#6C63FF">
          Cancel
        </Button>
        <Text style={styles.headerTitle}>Send Crypto</Text>
        <View style={{width: 60}} />
      </View>

      <View style={styles.content}>
        {/* Currency Selection */}
        <Card style={styles.section}>
          <Card.Content>
            <Text style={styles.sectionTitle}>Select Currency</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              <View style={styles.currencyChips}>
                {currencies.map((curr) => (
                  <Chip
                    key={curr.symbol}
                    mode={currency === curr.symbol ? 'flat' : 'outlined'}
                    onPress={() => setCurrency(curr.symbol)}
                    style={[
                      styles.currencyChip,
                      currency === curr.symbol && styles.activeCurrencyChip,
                    ]}
                    textStyle={currency === curr.symbol && styles.activeChipText}>
                    {curr.symbol}
                  </Chip>
                ))}
              </View>
            </ScrollView>
            {selectedCurrency && (
              <Text style={styles.balanceText}>
                Available: {selectedCurrency.balance} {selectedCurrency.symbol}
              </Text>
            )}
          </Card.Content>
        </Card>

        {/* Payment Method */}
        <Card style={styles.section}>
          <Card.Content>
            <Text style={styles.sectionTitle}>Payment Method</Text>
            <RadioButton.Group
              onValueChange={setPaymentMethod}
              value={paymentMethod}>
              {paymentMethods.map((method) => (
                <View key={method.value} style={styles.radioOption}>
                  <RadioButton value={method.value} color="#6C63FF" />
                  <Icon name={method.icon} size={20} color="#666" />
                  <Text style={styles.radioLabel}>{method.label}</Text>
                </View>
              ))}
            </RadioButton.Group>
          </Card.Content>
        </Card>

        {/* Recipient */}
        <Card style={styles.section}>
          <Card.Content>
            <Text style={styles.sectionTitle}>Recipient</Text>
            {paymentMethod === 'address' && (
              <TextInput
                label="Wallet Address"
                value={recipient}
                onChangeText={setRecipient}
                mode="outlined"
                placeholder="Enter wallet address"
                multiline
                style={styles.input}
              />
            )}
            {paymentMethod === 'qr' && (
              <Button
                mode="outlined"
                onPress={() => navigation.navigate('QRPayment')}
                icon="qrcode-scan"
                style={styles.qrButton}>
                Scan QR Code
              </Button>
            )}
            {paymentMethod === 'contact' && (
              <Button
                mode="outlined"
                onPress={() => {
                  Toast.show({
                    type: 'info',
                    text1: 'Coming Soon',
                    text2: 'Contact selection will be available soon',
                  });
                }}
                icon="account-group"
                style={styles.contactButton}>
                Select from Contacts
              </Button>
            )}
          </Card.Content>
        </Card>

        {/* Amount */}
        <Card style={styles.section}>
          <Card.Content>
            <Text style={styles.sectionTitle}>Amount</Text>
            <TextInput
              label={`Amount (${currency})`}
              value={amount}
              onChangeText={setAmount}
              mode="outlined"
              keyboardType="decimal-pad"
              placeholder="0.00"
              style={styles.input}
            />
            <View style={styles.quickAmounts}>
              {['25%', '50%', '75%', 'Max'].map((percentage) => (
                <Chip
                  key={percentage}
                  onPress={() => {
                    if (selectedCurrency) {
                      const balance = parseFloat(selectedCurrency.balance);
                      let quickAmount;
                      switch (percentage) {
                        case '25%':
                          quickAmount = balance * 0.25;
                          break;
                        case '50%':
                          quickAmount = balance * 0.5;
                          break;
                        case '75%':
                          quickAmount = balance * 0.75;
                          break;
                        case 'Max':
                          quickAmount = balance;
                          break;
                      }
                      setAmount(quickAmount.toFixed(6));
                    }
                  }}
                  style={styles.quickAmountChip}>
                  {percentage}
                </Chip>
              ))}
            </View>
          </Card.Content>
        </Card>

        {/* Note */}
        <Card style={styles.section}>
          <Card.Content>
            <Text style={styles.sectionTitle}>Note (Optional)</Text>
            <TextInput
              label="Add a note"
              value={note}
              onChangeText={setNote}
              mode="outlined"
              placeholder="What's this for?"
              style={styles.input}
            />
          </Card.Content>
        </Card>

        {/* Transaction Summary */}
        {amount && recipient && (
          <Card style={styles.section}>
            <Card.Content>
              <Text style={styles.sectionTitle}>Transaction Summary</Text>
              <View style={styles.summaryRow}>
                <Text style={styles.summaryLabel}>Amount:</Text>
                <Text style={styles.summaryValue}>{amount} {currency}</Text>
              </View>
              <View style={styles.summaryRow}>
                <Text style={styles.summaryLabel}>Network Fee:</Text>
                <Text style={styles.summaryValue}>~0.0001 {currency}</Text>
              </View>
              <View style={[styles.summaryRow, styles.totalRow]}>
                <Text style={styles.totalLabel}>Total:</Text>
                <Text style={styles.totalValue}>
                  {(parseFloat(amount) + 0.0001).toFixed(6)} {currency}
                </Text>
              </View>
            </Card.Content>
          </Card>
        )}

        {/* Send Button */}
        <Button
          mode="contained"
          onPress={handleSend}
          loading={loading}
          disabled={loading || !amount || !recipient}
          style={styles.sendButton}
          contentStyle={styles.sendButtonContent}>
          Send {currency}
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
    paddingHorizontal: 20,
  },
  section: {
    marginBottom: 15,
    elevation: 3,
    borderRadius: 15,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 15,
  },
  currencyChips: {
    flexDirection: 'row',
  },
  currencyChip: {
    marginRight: 10,
    backgroundColor: 'white',
  },
  activeCurrencyChip: {
    backgroundColor: '#6C63FF',
  },
  activeChipText: {
    color: 'white',
  },
  balanceText: {
    fontSize: 12,
    color: '#666',
    marginTop: 10,
  },
  radioOption: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
  },
  radioLabel: {
    fontSize: 14,
    color: '#333',
    marginLeft: 10,
  },
  input: {
    marginBottom: 10,
  },
  qrButton: {
    borderColor: '#6C63FF',
    borderRadius: 25,
  },
  contactButton: {
    borderColor: '#6C63FF',
    borderRadius: 25,
  },
  quickAmounts: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
  },
  quickAmountChip: {
    backgroundColor: '#E3F2FD',
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 5,
  },
  summaryLabel: {
    fontSize: 14,
    color: '#666',
  },
  summaryValue: {
    fontSize: 14,
    color: '#333',
  },
  totalRow: {
    borderTopWidth: 1,
    borderTopColor: '#EEE',
    paddingTop: 10,
    marginTop: 10,
  },
  totalLabel: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  totalValue: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#4CAF50',
  },
  sendButton: {
    backgroundColor: '#6C63FF',
    borderRadius: 25,
    marginVertical: 20,
  },
  sendButtonContent: {
    height: 50,
  },
});

export default UserSend;
