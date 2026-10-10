import { Product } from '../screens/ProductDetailScreen';

export type RootStackParamList = {
  Home: undefined;
  ProductDetail: { product?: Product };
};