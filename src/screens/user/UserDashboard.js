import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  RefreshControl,
  Dimensions,
} from 'react-native';
import {Card, Button, Avatar} from 'react-native-paper';
import LinearGradient from 'react-native-linear-gradient';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import AsyncStorage from '@react-native-async-storage/async-storage';

const {width} = Dimensions.get('window');

const UserDashboard = ({navigation}) => {
  const [userData, setUserData] = useState(null);
  const [refreshing, setRefreshing] = useState(false);
  const [recentTransactions, setRecentTransactions] = useState([]);

  useEffect(() => {
    loadUserData();
    loadRecentTransactions();
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

  const loadRecentTransactions = async () => {
    // Simulate loading recent transactions with dummy data
    const dummyTransactions = [
      {
        id: '1',
        type: 'received',
        amount: '0.00025',
        currency: 'BTC',
        from: 'Coffee Shop',
        date: new Date().toISOString(),
        status: 'completed',
      },
      {
        id: '2',
        type: 'sent',
        amount: '150.00',
        currency: 'USDT',
        to: 'John Doe',
        date: new Date(Date.now() - 86400000).toISOString(),
        status: 'completed',
      },
      {
        id: '3',
        type: 'received',
        amount: '0.015',
        currency: 'ETH',
        from: 'Restaurant',
        date: new Date(Date.now() - 172800000).toISOString(),
        status: 'pending',
      },
    ];
    setRecentTransactions(dummyTransactions);
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadUserData();
    await loadRecentTransactions();
    setRefreshing(false);
  };

  const getTotalBalanceUSD = () => {
    if (!userData?.balance) return '0.00';
    
    // Dummy exchange rates
    const rates = {
      btc: 45000,
      eth: 2800,
      usdt: 1,
    };

    const btcValue = parseFloat(userData.balance.btc) * rates.btc;
    const ethValue = parseFloat(userData.balance.eth) * rates.eth;
    const usdtValue = parseFloat(userData.balance.usdt) * rates.usdt;

    return (btcValue + ethValue + usdtValue).toFixed(2);
  };

  const quickActions = [
    {
      title: 'Send',
      icon: 'send',
      color: '#FF6B6B',
      onPress: () => navigation.navigate('Send'),
    },
    {
      title: 'Receive',
      icon: 'qrcode-scan',
      color: '#4ECDC4',
      onPress: () => navigation.navigate('Receive'),
    },
    {
      title: 'NFC Pay',
      icon: 'nfc-tap',
      color: '#45B7D1',
      onPress: () => navigation.navigate('NFCPayment'),
    },
    {
      title: 'QR Pay',
      icon: 'qrcode',
      color: '#96CEB4',
      onPress: () => navigation.navigate('QRPayment'),
    },
  ];

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
          <View style={styles.headerLeft}>
            <Avatar.Text
              size={50}
              label={userData?.fullName?.charAt(0) || 'U'}
              style={styles.avatar}
            />
            <View>
              <Text style={styles.greeting}>Welcome back,</Text>
              <Text style={styles.userName}>{userData?.fullName || 'User'}</Text>
            </View>
          </View>
          <Icon name="bell-outline" size={24} color="white" />
        </View>
      </LinearGradient>

      {/* Balance Card */}
      <View style={styles.balanceSection}>
        <Card style={styles.balanceCard}>
          <Card.Content style={styles.balanceContent}>
            <Text style={styles.balanceLabel}>Total Balance</Text>
            <Text style={styles.balanceAmount}>${getTotalBalanceUSD()}</Text>
            
            <View style={styles.balanceBreakdown}>
              <View style={styles.balanceItem}>
                <Icon name="currency-btc" size={20} color="#F7931A" />
                <Text style={styles.balanceItemText}>
                  {userData?.balance?.btc || '0.00000'} BTC
                </Text>
              </View>
              <View style={styles.balanceItem}>
                <Icon name="ethereum" size={20} color="#627EEA" />
                <Text style={styles.balanceItemText}>
                  {userData?.balance?.eth || '0.00000'} ETH
                </Text>
              </View>
              <View style={styles.balanceItem}>
                <Icon name="currency-usd" size={20} color="#26A69A" />
                <Text style={styles.balanceItemText}>
                  {userData?.balance?.usdt || '0.00'} USDT
                </Text>
              </View>
            </View>
          </Card.Content>
        </Card>
      </View>

      {/* Quick Actions */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Quick Actions</Text>
        <View style={styles.quickActions}>
          {quickActions.map((action, index) => (
            <Card key={index} style={styles.actionCard} onPress={action.onPress}>
              <Card.Content style={styles.actionContent}>
                <View style={[styles.actionIcon, {backgroundColor: action.color}]}>
                  <Icon name={action.icon} size={24} color="white" />
                </View>
                <Text style={styles.actionTitle}>{action.title}</Text>
              </Card.Content>
            </Card>
          ))}
        </View>
      </View>

      {/* Recent Transactions */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Recent Transactions</Text>
          <Button
            mode="text"
            onPress={() => navigation.navigate('Transactions')}
            textColor="#6C63FF">
            View All
          </Button>
        </View>
        
        {recentTransactions.map((transaction) => (
          <Card key={transaction.id} style={styles.transactionCard}>
            <Card.Content style={styles.transactionContent}>
              <View style={styles.transactionLeft}>
                <View
                  style={[
                    styles.transactionIcon,
                    {
                      backgroundColor:
                        transaction.type === 'received' ? '#E8F5E8' : '#FFF3E0',
                    },
                  ]}>
                  <Icon
                    name={transaction.type === 'received' ? 'arrow-down' : 'arrow-up'}
                    size={20}
                    color={transaction.type === 'received' ? '#4CAF50' : '#FF9800'}
                  />
                </View>
                <View>
                  <Text style={styles.transactionTitle}>
                    {transaction.type === 'received' ? 'Received from' : 'Sent to'}
                  </Text>
                  <Text style={styles.transactionSubtitle}>
                    {transaction.from || transaction.to}
                  </Text>
                </View>
              </View>
              <View style={styles.transactionRight}>
                <Text
                  style={[
                    styles.transactionAmount,
                    {
                      color: transaction.type === 'received' ? '#4CAF50' : '#FF9800',
                    },
                  ]}>
                  {transaction.type === 'received' ? '+' : '-'}
                  {transaction.amount} {transaction.currency}
                </Text>
                <Text style={styles.transactionStatus}>{transaction.status}</Text>
              </View>
            </Card.Content>
          </Card>
        ))}
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
    paddingBottom: 20,
    paddingHorizontal: 20,
  },
  headerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatar: {
    marginRight: 15,
    backgroundColor: 'rgba(255,255,255,0.2)',
  },
  greeting: {
    color: 'rgba(255,255,255,0.8)',
    fontSize: 14,
  },
  userName: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  balanceSection: {
    paddingHorizontal: 20,
    marginTop: -30,
  },
  balanceCard: {
    elevation: 8,
    borderRadius: 15,
  },
  balanceContent: {
    alignItems: 'center',
    paddingVertical: 25,
  },
  balanceLabel: {
    fontSize: 16,
    color: '#666',
    marginBottom: 10,
  },
  balanceAmount: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 20,
  },
  balanceBreakdown: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
  },
  balanceItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  balanceItemText: {
    marginLeft: 5,
    fontSize: 12,
    color: '#666',
  },
  section: {
    paddingHorizontal: 20,
    marginTop: 25,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 15,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  quickActions: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  actionCard: {
    width: (width - 60) / 2,
    marginBottom: 15,
    elevation: 3,
    borderRadius: 15,
  },
  actionContent: {
    alignItems: 'center',
    paddingVertical: 20,
  },
  actionIcon: {
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
  },
  actionTitle: {
    fontSize: 14,
    fontWeight: '500',
    color: '#333',
  },
  transactionCard: {
    marginBottom: 10,
    elevation: 2,
    borderRadius: 10,
  },
  transactionContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 15,
  },
  transactionLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  transactionIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  transactionTitle: {
    fontSize: 14,
    fontWeight: '500',
    color: '#333',
  },
  transactionSubtitle: {
    fontSize: 12,
    color: '#666',
  },
  transactionRight: {
    alignItems: 'flex-end',
  },
  transactionAmount: {
    fontSize: 14,
    fontWeight: 'bold',
  },
  transactionStatus: {
    fontSize: 12,
    color: '#666',
    textTransform: 'capitalize',
  },
});

export default UserDashboard;
