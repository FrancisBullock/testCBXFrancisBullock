import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  TextInput,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  RefreshControl,
  SafeAreaView,
} from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../types/navigation';
import type { Product } from './ProductDetailScreen';

type Props = NativeStackScreenProps<RootStackParamList, 'Home'>;

const CATEGORIES = ['ALL', 'Électronique', 'Informatique', 'Accessoires', 'Bureautique'];

// Remplace localhost par ton IP locale si tu testes sur un téléphone physique (ex: http://192.168.1.XX:3000/api/products)
const API_URL = 'http://localhost:3000/api/products';

export const HomeScreen: React.FC<Props> = ({ navigation }) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('ALL');
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchProducts = useCallback(async () => {
    try {
      const params = new URLSearchParams();
      if (search) params.append('search', search);
      if (selectedCategory && selectedCategory !== 'ALL') {
        params.append('category', selectedCategory);
      }

      const response = await fetch(`${API_URL}?${params.toString()}`);
      if (!response.ok) {
        throw new Error('Erreur lors de la récupération des données');
      }

      const data = await response.json();
      setProducts(data);
    } catch (error) {
      console.error('Erreur API:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [search, selectedCategory]);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  const onRefresh = () => {
    setRefreshing(true);
    fetchProducts();
  };

  const renderProductItem = ({ item }: { item: Product }) => {
    const isLowStock = item.quantity <= item.minThreshold;

    return (
      <TouchableOpacity
        style={[styles.card, isLowStock && styles.cardLowStock]}
        onPress={() => navigation.navigate('ProductDetail', { product: item })}
        activeOpacity={0.7}
      >
        <View style={styles.cardHeader}>
          <Text style={styles.productName}>{item.name}</Text>
          <Text style={styles.categoryBadge}>{item.category}</Text>
        </View>

        <Text style={styles.reference}>Réf: {item.reference}</Text>

        {item.description ? (
          <Text style={styles.description} numberOfLines={2}>
            {item.description}
          </Text>
        ) : null}

        <View style={styles.cardFooter}>
          <View style={styles.quantityContainer}>
            <Text style={styles.quantityLabel}>Stock : </Text>
            <Text
              style={[
                styles.quantityValue,
                isLowStock ? styles.lowStockText : styles.normalStockText,
              ]}
            >
              {item.quantity} unités
            </Text>
          </View>

          {isLowStock && (
            <View style={styles.alertBadge}>
              <Text style={styles.alertText}>⚠️ Alerte Stock</Text>
            </View>
          )}
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.searchContainer}>
        <TextInput
          style={styles.searchInput}
          placeholder="Rechercher par nom ou référence..."
          value={search}
          onChangeText={setSearch}
          clearButtonMode="while-editing"
        />
      </View>

      <View style={styles.filterContainer}>
        <FlatList
          horizontal
          showsHorizontalScrollIndicator={false}
          data={CATEGORIES}
          keyExtractor={(item) => item}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={[
                styles.chip,
                selectedCategory === item && styles.chipActive,
              ]}
              onPress={() => setSelectedCategory(item)}
            >
              <Text
                style={[
                  styles.chipText,
                  selectedCategory === item && styles.chipTextActive,
                ]}
              >
                {item === 'ALL' ? 'Tous' : item}
              </Text>
            </TouchableOpacity>
          )}
        />
      </View>

      <TouchableOpacity
        style={styles.addButton}
        onPress={() => navigation.navigate('ProductDetail', {})}
      >
        <Text style={styles.addButtonText}>+ Ajouter un produit</Text>
      </TouchableOpacity>

      {loading ? (
        <View style={styles.loaderContainer}>
          <ActivityIndicator size="large" color="#007AFF" />
        </View>
      ) : (
        <FlatList
          data={products}
          keyExtractor={(item) => item.id || item.reference}
          renderItem={renderProductItem}
          contentContainerStyle={styles.listContent}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyText}>Aucun produit trouvé</Text>
            </View>
          }
        />
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f7',
  },
  searchContainer: {
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 8,
  },
  searchInput: {
    backgroundColor: '#fff',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 10,
    fontSize: 15,
    borderWidth: 1,
    borderColor: '#e1e1e8',
  },
  filterContainer: {
    paddingVertical: 8,
    paddingLeft: 16,
  },
  chip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#e5e5ea',
    marginRight: 8,
  },
  chipActive: {
    backgroundColor: '#007AFF',
  },
  chipText: {
    fontSize: 14,
    color: '#3a3a3c',
    fontWeight: '500',
  },
  chipTextActive: {
    color: '#fff',
    fontWeight: '600',
  },
  addButton: {
    backgroundColor: '#007AFF',
    marginHorizontal: 16,
    marginVertical: 8,
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: 'center',
  },
  addButtonText: {
    color: '#fff',
    fontSize: 15,
    fontWeight: '600',
  },
  listContent: {
    padding: 16,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderLeftWidth: 4,
    borderLeftColor: '#34C759',
  },
  cardLowStock: {
    borderLeftColor: '#FF3B30',
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  productName: {
    fontSize: 17,
    fontWeight: '600',
    color: '#1c1c1e',
    flex: 1,
  },
  categoryBadge: {
    fontSize: 12,
    color: '#8e8e93',
    backgroundColor: '#f2f2f7',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  reference: {
    fontSize: 13,
    color: '#8e8e93',
    marginBottom: 6,
  },
  description: {
    fontSize: 14,
    color: '#3c3c43',
    marginBottom: 10,
  },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 8,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: '#f2f2f7',
  },
  quantityContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  quantityLabel: {
    fontSize: 14,
    color: '#8e8e93',
  },
  quantityValue: {
    fontSize: 14,
    fontWeight: '700',
  },
  normalStockText: {
    color: '#34C759',
  },
  lowStockText: {
    color: '#FF3B30',
  },
  alertBadge: {
    backgroundColor: '#FFE5E5',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  alertText: {
    fontSize: 12,
    color: '#FF3B30',
    fontWeight: '600',
  },
  loaderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyContainer: {
    padding: 32,
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 15,
    color: '#8e8e93',
  },
});

export default HomeScreen;