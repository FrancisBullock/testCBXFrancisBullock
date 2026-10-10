import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import { HomeScreen } from './src/screens/HomeScreen';
import { ProductDetailScreen } from './src/screens/ProductDetailScreen';
import type { RootStackParamList } from './src/types/navigation';

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Home">
        <Stack.Screen
          name="Home"
          component={HomeScreen}
          options={{ title: 'Gestion de Stock' }}
        />
        <Stack.Screen
          name="ProductDetail"
          component={ProductDetailScreen}
          options={({ route }) => ({
            title: route.params?.product ? 'Modifier Produit' : 'Nouveau Produit',
          })}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
