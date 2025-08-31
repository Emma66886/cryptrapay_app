import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  RefreshControl,
  Dimensions,
  TouchableOpacity,
} from 'react-native';
import {Card, Button, Chip, Portal, Modal} from 'react-native-paper';
import LinearGradient from 'react-native-linear-gradient';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import AsyncStorage from '@react-native-async-storage/async-storage';

const {width} = Dimensions.get('window');

const UserWallet = ({navigation}) => {
  const [userData, setUserData] = useState(null);
  const [refreshing, setRefreshing] = useState(false);
  const [selectedCurrency, setSelectedCurrency] = useState('all');
  const [showAddModal, setShowAddModal] = useState(false);

  const currencies = [
    {
      symbol: 'BTC',
      name: 'Bitcoin',
      icon: 'currency-btc',
      color: '#F7931A',
      price: 45000,
      change: '+2.5%',
      changePositive: true,
    },
    {
      symbol: 'ETH',
      name: 'Ethereum',
      icon: 'ethereum',
      color: '#627EEA',
      price: 2800,
      change: '+1.8%',
      changePositive: true,
    },
    {
      symbol: 'USDT',
      name: 'Tether',
      icon: 'currency-usd',
      color: '#26A69A',
      price: 1,
      change: '0.0%',
      changePositive: true,
    },
  ];

  useEffect(() => {
    loadUserData();
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

  const onRefresh = async () => {
    setRefreshing(true);
    await loadUserData();
    setRefreshing(false);
  };

  const getCurrencyBalance = (symbol) => {
    if (!userData?.balance) return '0.00000';
    return userData.balance[symbol.toLowerCase()] || '0.00000';
  };

  const getCurrencyValueUSD = (symbol, balance) => {
    const currency = currencies.find(c => c.symbol === symbol);
    return currency ? (parseFloat(balance) * currency.price).toFixed(2) : '0.00';
  };

  const getTotalBalanceUSD = () => {
    if (!userData?.balance) return '0.00';
    
    let total = 0;
    currencies.forEach(currency => {
      const balance = parseFloat(getCurrencyBalance(currency.symbol));
      total += balance * currency.price;
    });
    
    return total.toFixed(2);
  };

  const filteredCurrencies = selectedCurrency === 'all' 
    ? currencies 
    : currencies.filter(c => c.symbol === selectedCurrency);

  return (
    <ScrollView
      style={styles.container}
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}>
      
      {/* Header */}
      <LinearGradient
        colors={['#6C63FF', '#03DAC4']}
        style={styles.header}
        start={{x: 0, y: 0}}
        end={{x: 1, y: 1}}>
        <View style={styles.headerContent}>
          <Text style={styles.headerTitle}>My Wallet</Text>
          <TouchableOpacity onPress={() => setShowAddModal(true)}>
            <Icon name="plus-circle" size={28} color="white" />
          </TouchableOpacity>
        </View>
        <View style={styles.totalBalance}>
          <Text style={styles.totalBalanceLabel}>Total Portfolio Value</Text>
          <Text style={styles.totalBalanceAmount}>${getTotalBalanceUSD()}</Text>
        </View>
      </LinearGradient>

      {/* Currency Filter */}
      <View style={styles.filterSection}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          <View style={styles.filterChips}>
            <Chip
              mode={selectedCurrency === 'all' ? 'flat' : 'outlined'}
              onPress={() => setSelectedCurrency('all')}
              style={[
                styles.filterChip,
                selectedCurrency === 'all' && styles.activeChip,
              ]}
              textStyle={selectedCurrency === 'all' && styles.activeChipText}>
              All
            </Chip>
            {currencies.map((currency) => (
              <Chip
                key={currency.symbol}
                mode={selectedCurrency === currency.symbol ? 'flat' : 'outlined'}
                onPress={() => setSelectedCurrency(currency.symbol)}
                style={[
                  styles.filterChip,
                  selectedCurrency === currency.symbol && styles.activeChip,
                ]}
                textStyle={selectedCurrency === currency.symbol && styles.activeChipText}>
                {currency.symbol}
              </Chip>
            ))}
          </View>
        </ScrollView>
      </View>

      {/* Currency Cards */}
      <View style={styles.currencySection}>
        {filteredCurrencies.map((currency) => {
          const balance = getCurrencyBalance(currency.symbol);
          const valueUSD = getCurrencyValueUSD(currency.symbol, balance);
          
          return (
            <Card key={currency.symbol} style={styles.currencyCard}>
              <Card.Content style={styles.currencyContent}>
                <View style={styles.currencyHeader}>
                  <View style={styles.currencyInfo}>
                    <View
                      style={[
                        styles.currencyIcon,
                        {backgroundColor: currency.color + '20'},
                      ]}>
                      <Icon name={currency.icon} size={24} color={currency.color} />
                    </View>
                    <View style={styles.currencyDetails}>
                      <Text style={styles.currencyName}>{currency.name}</Text>
                      <Text style={styles.currencySymbol}>{currency.symbol}</Text>
                    </View>
                  </View>
                  <View style={styles.currencyPrice}>
                    <Text style={styles.priceText}>${currency.price.toLocaleString()}</Text>
                    <Text
                      style={[
                        styles.changeText,
                        {color: currency.changePositive ? '#4CAF50' : '#F44336'},
                      ]}>
                      {currency.change}
                    </Text>
                  </View>
                </View>

                <View style={styles.balanceSection}>
                  <View style={styles.balanceRow}>
                    <Text style={styles.balanceLabel}>Balance</Text>
                    <Text style={styles.balanceValue}>
                      {balance} {currency.symbol}
                    </Text>
                  </View>
                  <View style={styles.balanceRow}>
                    <Text style={styles.balanceLabel}>Value</Text>
                    <Text style={styles.balanceValueUSD}>${valueUSD}</Text>
                  </View>
                </View>

                <View style={styles.actionButtons}>
                  <Button
                    mode="outlined"
                    onPress={() => navigation.navigate('Send', {currency: currency.symbol})}
                    style={[styles.actionButton, {borderColor: currency.color}]}
                    textColor={currency.color}
                    compact>
                    Send
                  </Button>
                  <Button
                    mode="contained"
                    onPress={() => navigation.navigate('Receive', {currency: currency.symbol})}
                    style={[styles.actionButton, {backgroundColor: currency.color}]}
                    compact>
                    Receive
                  </Button>
                </View>
              </Card.Content>
            </Card>
          );
        })}
      </View>

      {/* Add Currency Modal */}
      <Portal>
        <Modal
          visible={showAddModal}
          onDismiss={() => setShowAddModal(false)}
          contentContainerStyle={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Add Currency</Text>
            <Text style={styles.modalSubtitle}>
              Coming soon! More cryptocurrencies will be available.
            </Text>
            <Button
              mode="contained"
              onPress={() => setShowAddModal(false)}
              style={styles.modalButton}>
              Close
            </Button>
          </View>
        </Modal>
      </Portal>
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
    paddingBottom: 30,
    paddingHorizontal: 20,
  },
  headerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
  },
  totalBalance: {
    alignItems: 'center',
  },
  totalBalanceLabel: {
    color: 'rgba(255,255,255,0.8)',
    fontSize: 14,
    marginBottom: 5,
  },
  totalBalanceAmount: {
    color: 'white',
    fontSize: 32,
    fontWeight: 'bold',
  },
  filterSection: {
    paddingVertical: 15,
  },
  filterChips: {
    flexDirection: 'row',
    paddingHorizontal: 20,
  },
  filterChip: {
    marginRight: 10,
    backgroundColor: 'white',
  },
  activeChip: {
    backgroundColor: '#6C63FF',
  },
  activeChipText: {
    color: 'white',
  },
  currencySection: {
    paddingHorizontal: 20,
  },
  currencyCard: {
    marginBottom: 15,
    elevation: 3,
    borderRadius: 15,
  },
  currencyContent: {
    paddingVertical: 20,
  },
  currencyHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  currencyInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  currencyIcon: {
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  currencyDetails: {},
  currencyName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  currencySymbol: {
    fontSize: 14,
    color: '#666',
  },
  currencyPrice: {
    alignItems: 'flex-end',
  },
  priceText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  changeText: {
    fontSize: 14,
    fontWeight: '500',
  },
  balanceSection: {
    backgroundColor: '#F8F9FA',
    borderRadius: 10,
    padding: 15,
    marginBottom: 15,
  },
  balanceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 5,
  },
  balanceLabel: {
    fontSize: 14,
    color: '#666',
  },
  balanceValue: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#333',
  },
  balanceValueUSD: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#4CAF50',
  },
  actionButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  actionButton: {
    flex: 1,
    marginHorizontal: 5,
    borderRadius: 25,
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
    marginBottom: 10,
  },
  modalSubtitle: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    marginBottom: 20,
  },
  modalButton: {
    backgroundColor: '#6C63FF',
    borderRadius: 25,
    paddingHorizontal: 30,
  },
});

export default UserWallet;
