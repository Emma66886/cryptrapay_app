import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  RefreshControl,
} from 'react-native';
import {Card, Chip, Searchbar} from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

const UserTransactions = ({navigation}) => {
  const [refreshing, setRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFilter, setSelectedFilter] = useState('all');
  const [transactions, setTransactions] = useState([]);

  const filters = ['all', 'sent', 'received', 'pending'];

  useEffect(() => {
    loadTransactions();
  }, []);

  const loadTransactions = async () => {
    // Simulate loading transactions with dummy data
    const dummyTransactions = [
      {
        id: 'tx1',
        type: 'received',
        amount: '25.50',
        currency: 'USDT',
        from: 'Coffee Shop',
        to: null,
        date: new Date().toISOString(),
        status: 'completed',
        txHash: '0x1234...5678',
        fee: '0.50',
      },
      {
        id: 'tx2',
        type: 'sent',
        amount: '0.0012',
        currency: 'BTC',
        from: null,
        to: 'John Doe',
        date: new Date(Date.now() - 3600000).toISOString(),
        status: 'completed',
        txHash: '0xabcd...efgh',
        fee: '0.0001',
      },
      {
        id: 'tx3',
        type: 'received',
        amount: '150.00',
        currency: 'USDT',
        from: 'Restaurant',
        to: null,
        date: new Date(Date.now() - 7200000).toISOString(),
        status: 'pending',
        txHash: '0x9876...5432',
        fee: '0.50',
      },
      {
        id: 'tx4',
        type: 'sent',
        amount: '0.025',
        currency: 'ETH',
        from: null,
        to: 'Alice Smith',
        date: new Date(Date.now() - 86400000).toISOString(),
        status: 'completed',
        txHash: '0xfedc...ba98',
        fee: '0.002',
      },
      {
        id: 'tx5',
        type: 'received',
        amount: '75.25',
        currency: 'USDT',
        from: 'Online Store',
        to: null,
        date: new Date(Date.now() - 172800000).toISOString(),
        status: 'completed',
        txHash: '0x1357...2468',
        fee: '0.50',
      },
    ];
    
    setTransactions(dummyTransactions);
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadTransactions();
    setRefreshing(false);
  };

  const filteredTransactions = transactions.filter(tx => {
    const matchesFilter = selectedFilter === 'all' || tx.type === selectedFilter || tx.status === selectedFilter;
    const matchesSearch = searchQuery === '' || 
      tx.from?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tx.to?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tx.currency.toLowerCase().includes(searchQuery.toLowerCase());
    
    return matchesFilter && matchesSearch;
  });

  const getTransactionIcon = (type, status) => {
    if (status === 'pending') return 'clock-outline';
    return type === 'received' ? 'arrow-down' : 'arrow-up';
  };

  const getTransactionColor = (type, status) => {
    if (status === 'pending') return '#FF9800';
    return type === 'received' ? '#4CAF50' : '#F44336';
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / (1000 * 60));
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    if (diffMins < 60) {
      return `${diffMins}m ago`;
    } else if (diffHours < 24) {
      return `${diffHours}h ago`;
    } else if (diffDays < 7) {
      return `${diffDays}d ago`;
    } else {
      return date.toLocaleDateString();
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Transaction History</Text>
      </View>

      <View style={styles.searchSection}>
        <Searchbar
          placeholder="Search transactions..."
          onChangeText={setSearchQuery}
          value={searchQuery}
          style={styles.searchBar}
        />
      </View>

      <View style={styles.filterSection}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          <View style={styles.filterChips}>
            {filters.map((filter) => (
              <Chip
                key={filter}
                mode={selectedFilter === filter ? 'flat' : 'outlined'}
                onPress={() => setSelectedFilter(filter)}
                style={[
                  styles.filterChip,
                  selectedFilter === filter && styles.activeFilterChip,
                ]}
                textStyle={selectedFilter === filter && styles.activeChipText}>
                {filter.charAt(0).toUpperCase() + filter.slice(1)}
              </Chip>
            ))}
          </View>
        </ScrollView>
      </View>

      <ScrollView
        style={styles.transactionsList}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}>
        
        {filteredTransactions.length === 0 ? (
          <View style={styles.emptyState}>
            <Icon name="history" size={80} color="#CCC" />
            <Text style={styles.emptyText}>No transactions found</Text>
            <Text style={styles.emptySubtext}>
              {searchQuery || selectedFilter !== 'all' 
                ? 'Try adjusting your search or filter'
                : 'Your transactions will appear here'}
            </Text>
          </View>
        ) : (
          filteredTransactions.map((transaction) => (
            <Card key={transaction.id} style={styles.transactionCard}>
              <Card.Content style={styles.transactionContent}>
                <View style={styles.transactionLeft}>
                  <View
                    style={[
                      styles.transactionIcon,
                      {
                        backgroundColor: getTransactionColor(transaction.type, transaction.status) + '20',
                      },
                    ]}>
                    <Icon
                      name={getTransactionIcon(transaction.type, transaction.status)}
                      size={24}
                      color={getTransactionColor(transaction.type, transaction.status)}
                    />
                  </View>
                  <View style={styles.transactionDetails}>
                    <Text style={styles.transactionTitle}>
                      {transaction.type === 'received' ? 'Received from' : 'Sent to'}
                    </Text>
                    <Text style={styles.transactionSubtitle}>
                      {transaction.from || transaction.to || 'Unknown'}
                    </Text>
                    <Text style={styles.transactionTime}>
                      {formatDate(transaction.date)}
                    </Text>
                  </View>
                </View>
                
                <View style={styles.transactionRight}>
                  <Text
                    style={[
                      styles.transactionAmount,
                      {color: getTransactionColor(transaction.type, transaction.status)},
                    ]}>
                    {transaction.type === 'received' ? '+' : '-'}
                    {transaction.amount} {transaction.currency}
                  </Text>
                  <Text style={styles.transactionStatus}>
                    {transaction.status}
                  </Text>
                  <Text style={styles.transactionFee}>
                    Fee: {transaction.fee} {transaction.currency}
                  </Text>
                </View>
              </Card.Content>
            </Card>
          ))
        )}
      </ScrollView>
    </View>
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
  searchSection: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    backgroundColor: 'white',
  },
  searchBar: {
    elevation: 0,
    backgroundColor: '#F5F5F5',
  },
  filterSection: {
    paddingVertical: 15,
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: '#EEE',
  },
  filterChips: {
    flexDirection: 'row',
    paddingHorizontal: 20,
  },
  filterChip: {
    marginRight: 10,
    backgroundColor: 'white',
  },
  activeFilterChip: {
    backgroundColor: '#6C63FF',
  },
  activeChipText: {
    color: 'white',
  },
  transactionsList: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 15,
  },
  transactionCard: {
    marginBottom: 10,
    elevation: 2,
    borderRadius: 15,
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
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  transactionDetails: {
    flex: 1,
  },
  transactionTitle: {
    fontSize: 14,
    fontWeight: '500',
    color: '#333',
    marginBottom: 2,
  },
  transactionSubtitle: {
    fontSize: 12,
    color: '#666',
    marginBottom: 2,
  },
  transactionTime: {
    fontSize: 11,
    color: '#999',
  },
  transactionRight: {
    alignItems: 'flex-end',
  },
  transactionAmount: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 2,
  },
  transactionStatus: {
    fontSize: 12,
    color: '#666',
    textTransform: 'capitalize',
    marginBottom: 2,
  },
  transactionFee: {
    fontSize: 10,
    color: '#999',
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 80,
  },
  emptyText: {
    fontSize: 18,
    color: '#666',
    marginTop: 20,
    marginBottom: 10,
  },
  emptySubtext: {
    fontSize: 14,
    color: '#999',
    textAlign: 'center',
    lineHeight: 20,
  },
});

export default UserTransactions;
