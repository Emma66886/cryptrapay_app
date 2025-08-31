import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  RefreshControl,
  Dimensions,
} from 'react-native';
import {Card, Button, Avatar, Chip} from 'react-native-paper';
import LinearGradient from 'react-native-linear-gradient';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import AsyncStorage from '@react-native-async-storage/async-storage';

const {width} = Dimensions.get('window');

const MerchantDashboard = ({navigation}) => {
  const [userData, setUserData] = useState(null);
  const [refreshing, setRefreshing] = useState(false);
  const [salesData, setSalesData] = useState({});
  const [recentOrders, setRecentOrders] = useState([]);

  useEffect(() => {
    loadUserData();
    loadSalesData();
    loadRecentOrders();
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

  const loadSalesData = async () => {
    // Simulate loading sales data
    const dummySalesData = {
      todaySales: 2450.75,
      todayOrders: 28,
      monthSales: 45320.50,
      monthOrders: 542,
      topCurrency: 'USDT',
      growth: '+12.5%',
    };
    setSalesData(dummySalesData);
  };

  const loadRecentOrders = async () => {
    // Simulate loading recent orders
    const dummyOrders = [
      {
        id: 'ORD001',
        customer: 'John Doe',
        amount: '25.50',
        currency: 'USDT',
        items: ['Coffee', 'Sandwich'],
        status: 'completed',
        time: new Date().toISOString(),
        paymentMethod: 'NFC',
      },
      {
        id: 'ORD002',
        customer: 'Jane Smith',
        amount: '0.0012',
        currency: 'BTC',
        items: ['Pizza', 'Soda'],
        status: 'pending',
        time: new Date(Date.now() - 300000).toISOString(),
        paymentMethod: 'QR',
      },
      {
        id: 'ORD003',
        customer: 'Mike Johnson',
        amount: '15.75',
        currency: 'USDT',
        items: ['Burger'],
        status: 'completed',
        time: new Date(Date.now() - 600000).toISOString(),
        paymentMethod: 'NFC',
      },
    ];
    setRecentOrders(dummyOrders);
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadUserData();
    await loadSalesData();
    await loadRecentOrders();
    setRefreshing(false);
  };

  const quickActions = [
    {
      title: 'Create Sale',
      icon: 'cash-plus',
      color: '#4CAF50',
      onPress: () => navigation.navigate('CreatePaymentRequest'),
    },
    {
      title: 'NFC Receive',
      icon: 'nfc-tap',
      color: '#2196F3',
      onPress: () => navigation.navigate('NFCReceive'),
    },
    {
      title: 'Inventory',
      icon: 'package-variant',
      color: '#FF9800',
      onPress: () => navigation.navigate('Inventory'),
    },
    {
      title: 'Analytics',
      icon: 'chart-line',
      color: '#9C27B0',
      onPress: () => navigation.navigate('Sales'),
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
              label={userData?.fullName?.charAt(0) || 'M'}
              style={styles.avatar}
            />
            <View>
              <Text style={styles.greeting}>Welcome back,</Text>
              <Text style={styles.userName}>{userData?.fullName || 'Merchant'}</Text>
            </View>
          </View>
          <Icon name="bell-outline" size={24} color="white" />
        </View>
      </LinearGradient>

      {/* Sales Overview */}
      <View style={styles.salesSection}>
        <View style={styles.salesHeader}>
          <Text style={styles.sectionTitle}>Sales Overview</Text>
          <Chip
            icon="trending-up"
            style={[styles.growthChip, {backgroundColor: '#E8F5E8'}]}
            textStyle={{color: '#4CAF50'}}>
            {salesData.growth}
          </Chip>
        </View>
        
        <View style={styles.salesCards}>
          <Card style={styles.salesCard}>
            <Card.Content style={styles.salesCardContent}>
              <Icon name="currency-usd" size={24} color="#4CAF50" />
              <Text style={styles.salesAmount}>${salesData.todaySales}</Text>
              <Text style={styles.salesLabel}>Today's Sales</Text>
            </Card.Content>
          </Card>
          
          <Card style={styles.salesCard}>
            <Card.Content style={styles.salesCardContent}>
              <Icon name="receipt" size={24} color="#2196F3" />
              <Text style={styles.salesAmount}>{salesData.todayOrders}</Text>
              <Text style={styles.salesLabel}>Orders Today</Text>
            </Card.Content>
          </Card>
        </View>

        <View style={styles.salesCards}>
          <Card style={styles.salesCard}>
            <Card.Content style={styles.salesCardContent}>
              <Icon name="chart-line" size={24} color="#FF9800" />
              <Text style={styles.salesAmount}>${salesData.monthSales}</Text>
              <Text style={styles.salesLabel}>This Month</Text>
            </Card.Content>
          </Card>
          
          <Card style={styles.salesCard}>
            <Card.Content style={styles.salesCardContent}>
              <Icon name="basket" size={24} color="#9C27B0" />
              <Text style={styles.salesAmount}>{salesData.monthOrders}</Text>
              <Text style={styles.salesLabel}>Orders Month</Text>
            </Card.Content>
          </Card>
        </View>
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

      {/* Recent Orders */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Recent Orders</Text>
          <Button
            mode="text"
            onPress={() => navigation.navigate('Sales')}
            textColor="#6C63FF">
            View All
          </Button>
        </View>
        
        {recentOrders.map((order) => (
          <Card key={order.id} style={styles.orderCard}>
            <Card.Content style={styles.orderContent}>
              <View style={styles.orderLeft}>
                <View style={styles.orderHeader}>
                  <Text style={styles.orderId}>#{order.id}</Text>
                  <Chip
                    style={[
                      styles.statusChip,
                      {
                        backgroundColor:
                          order.status === 'completed' ? '#E8F5E8' : '#FFF3E0',
                      },
                    ]}
                    textStyle={{
                      color: order.status === 'completed' ? '#4CAF50' : '#FF9800',
                      fontSize: 12,
                    }}>
                    {order.status}
                  </Chip>
                </View>
                <Text style={styles.orderCustomer}>{order.customer}</Text>
                <Text style={styles.orderItems}>
                  {order.items.join(', ')}
                </Text>
                <View style={styles.orderDetails}>
                  <Icon
                    name={order.paymentMethod === 'NFC' ? 'nfc-tap' : 'qrcode'}
                    size={16}
                    color="#666"
                  />
                  <Text style={styles.orderTime}>
                    {new Date(order.time).toLocaleTimeString([], {
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </Text>
                </View>
              </View>
              <View style={styles.orderRight}>
                <Text style={styles.orderAmount}>
                  {order.amount} {order.currency}
                </Text>
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
  salesSection: {
    paddingHorizontal: 20,
    marginTop: 20,
  },
  salesHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  growthChip: {
    height: 32,
  },
  salesCards: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 15,
  },
  salesCard: {
    flex: 1,
    marginHorizontal: 5,
    elevation: 3,
    borderRadius: 15,
  },
  salesCardContent: {
    alignItems: 'center',
    paddingVertical: 20,
  },
  salesAmount: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginTop: 10,
    marginBottom: 5,
  },
  salesLabel: {
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
  orderCard: {
    marginBottom: 10,
    elevation: 2,
    borderRadius: 10,
  },
  orderContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 15,
  },
  orderLeft: {
    flex: 1,
  },
  orderHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 5,
  },
  orderId: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#333',
    marginRight: 10,
  },
  statusChip: {
    height: 24,
  },
  orderCustomer: {
    fontSize: 14,
    color: '#666',
    marginBottom: 2,
  },
  orderItems: {
    fontSize: 12,
    color: '#888',
    marginBottom: 8,
  },
  orderDetails: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  orderTime: {
    fontSize: 12,
    color: '#666',
    marginLeft: 5,
  },
  orderRight: {
    alignItems: 'flex-end',
    justifyContent: 'center',
  },
  orderAmount: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#4CAF50',
  },
});

export default MerchantDashboard;
