import React, {useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Share,
  Clipboard,
} from 'react-native';
import {Button, Card, Chip} from 'react-native-paper';
import QRCode from 'react-native-qrcode-svg';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import Toast from 'react-native-toast-message';

const UserReceive = ({navigation, route}) => {
  const [selectedCurrency, setSelectedCurrency] = useState(
    route?.params?.currency || 'USDT'
  );

  const currencies = [
    {
      symbol: 'BTC',
      name: 'Bitcoin',
      address: '1A1zP1eP5QGefi2DMPTfTL5SLmv7DivfNa',
    },
    {
      symbol: 'ETH',
      name: 'Ethereum',
      address: '0x742d35Cc7cB28c0A02bC5d2E1A7e1C4f2c1b5bDf',
    },
    {
      symbol: 'USDT',
      name: 'Tether',
      address: '0x742d35Cc7cB28c0A02bC5d2E1A7e1C4f2c1b5bDf',
    },
  ];

  const selectedCurrencyData = currencies.find(c => c.symbol === selectedCurrency);

  const copyToClipboard = async () => {
    try {
      await Clipboard.setString(selectedCurrencyData.address);
      Toast.show({
        type: 'success',
        text1: 'Copied!',
        text2: 'Address copied to clipboard',
      });
    } catch (error) {
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: 'Failed to copy address',
      });
    }
  };

  const shareAddress = async () => {
    try {
      await Share.share({
        message: `My ${selectedCurrencyData.name} address: ${selectedCurrencyData.address}`,
        title: 'My Crypto Address',
      });
    } catch (error) {
      console.error('Error sharing:', error);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Button
          mode="text"
          onPress={() => navigation.goBack()}
          textColor="#6C63FF">
          Back
        </Button>
        <Text style={styles.headerTitle}>Receive Crypto</Text>
        <View style={{width: 60}} />
      </View>

      <View style={styles.content}>
        {/* Currency Selection */}
        <Card style={styles.section}>
          <Card.Content>
            <Text style={styles.sectionTitle}>Select Currency to Receive</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              <View style={styles.currencyChips}>
                {currencies.map((currency) => (
                  <Chip
                    key={currency.symbol}
                    mode={selectedCurrency === currency.symbol ? 'flat' : 'outlined'}
                    onPress={() => setSelectedCurrency(currency.symbol)}
                    style={[
                      styles.currencyChip,
                      selectedCurrency === currency.symbol && styles.activeCurrencyChip,
                    ]}
                    textStyle={
                      selectedCurrency === currency.symbol && styles.activeChipText
                    }>
                    {currency.symbol}
                  </Chip>
                ))}
              </View>
            </ScrollView>
          </Card.Content>
        </Card>

        {/* QR Code */}
        <Card style={styles.section}>
          <Card.Content style={styles.qrSection}>
            <Text style={styles.sectionTitle}>
              {selectedCurrencyData?.name} Address
            </Text>
            
            <View style={styles.qrContainer}>
              <QRCode
                value={selectedCurrencyData?.address || ''}
                size={200}
                backgroundColor="white"
                color="black"
                logo={{uri: 'https://via.placeholder.com/50'}}
                logoSize={30}
                logoBackgroundColor="transparent"
              />
            </View>

            <Text style={styles.instruction}>
              Scan this QR code or copy the address below to receive {selectedCurrency}
            </Text>
          </Card.Content>
        </Card>

        {/* Address */}
        <Card style={styles.section}>
          <Card.Content>
            <Text style={styles.sectionTitle}>Wallet Address</Text>
            <View style={styles.addressContainer}>
              <Text style={styles.addressText}>
                {selectedCurrencyData?.address}
              </Text>
            </View>

            <View style={styles.actionButtons}>
              <Button
                mode="outlined"
                onPress={copyToClipboard}
                icon="content-copy"
                style={styles.actionButton}
                textColor="#6C63FF">
                Copy
              </Button>
              <Button
                mode="outlined"
                onPress={shareAddress}
                icon="share"
                style={styles.actionButton}
                textColor="#6C63FF">
                Share
              </Button>
            </View>
          </Card.Content>
        </Card>

        {/* Important Notice */}
        <Card style={styles.section}>
          <Card.Content>
            <View style={styles.warningHeader}>
              <Icon name="alert-circle" size={20} color="#FF9800" />
              <Text style={styles.warningTitle}>Important Notice</Text>
            </View>
            <View style={styles.warningItem}>
              <Text style={styles.warningText}>
                • Only send {selectedCurrencyData?.name} ({selectedCurrency}) to this address
              </Text>
            </View>
            <View style={styles.warningItem}>
              <Text style={styles.warningText}>
                • Sending other cryptocurrencies may result in permanent loss
              </Text>
            </View>
            <View style={styles.warningItem}>
              <Text style={styles.warningText}>
                • Always double-check the address before sending
              </Text>
            </View>
            <View style={styles.warningItem}>
              <Text style={styles.warningText}>
                • Transactions are irreversible once confirmed
              </Text>
            </View>
          </Card.Content>
        </Card>

        {/* Recent Transactions */}
        <Card style={styles.section}>
          <Card.Content>
            <Text style={styles.sectionTitle}>Recent Transactions</Text>
            <View style={styles.emptyState}>
              <Icon name="history" size={50} color="#CCC" />
              <Text style={styles.emptyText}>No recent transactions</Text>
              <Text style={styles.emptySubtext}>
                Transactions will appear here once you receive payments
              </Text>
            </View>
          </Card.Content>
        </Card>
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
  qrSection: {
    alignItems: 'center',
  },
  qrContainer: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 15,
    elevation: 2,
    marginBottom: 20,
  },
  instruction: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    lineHeight: 20,
  },
  addressContainer: {
    backgroundColor: '#F8F9FA',
    padding: 15,
    borderRadius: 10,
    marginBottom: 15,
  },
  addressText: {
    fontSize: 14,
    color: '#333',
    fontFamily: 'monospace',
    textAlign: 'center',
    lineHeight: 20,
  },
  actionButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  actionButton: {
    flex: 1,
    marginHorizontal: 5,
    borderColor: '#6C63FF',
    borderRadius: 25,
  },
  warningHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  warningTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FF9800',
    marginLeft: 8,
  },
  warningItem: {
    marginBottom: 8,
  },
  warningText: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: 40,
  },
  emptyText: {
    fontSize: 16,
    color: '#666',
    marginTop: 15,
    marginBottom: 5,
  },
  emptySubtext: {
    fontSize: 12,
    color: '#999',
    textAlign: 'center',
  },
});

export default UserReceive;
