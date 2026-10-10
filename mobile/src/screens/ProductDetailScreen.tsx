import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert,
  ActivityIndicator,
  SafeAreaView,
} from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../types/navigation';

export interface Product {
  id?: string;
  name: string;
  reference: string;
  description?: string | null;
  category: string;
  quantity: number;
  minThreshold: number;
}

type Props = NativeStackScreenProps<RootStackParamList, 'ProductDetail'>;

const API_URL = 'http://localhost:3000/api/products';

export const ProductDetailScreen: React.FC<Props> = ({ route, navigation }) => {
  const productToEdit = route.params?.product;
  const isEditing = Boolean(productToEdit?.id);

  const [name, setName] = useState(productToEdit?.name || '');
  const [reference, setReference] = useState(productToEdit?.reference || '');
  const [category, setCategory] = useState(productToEdit?.category || 'Informatique');
  const [description, setDescription] = useState(productToEdit?.description || '');
  const [quantity, setQuantity] = useState(
    productToEdit ? String(productToEdit.quantity) : '0'
  );
  const [minThreshold, setMinThreshold] = useState(
    productToEdit ? String(productToEdit.minThreshold) : '5'
  );

  const [loading, setLoading] = useState(false);

  const handleSave = async () => {
    if (!name.trim() || !reference.trim() || !category.trim()) {
      Alert.alert('Erreur', 'Veuillez remplir tous les champs obligatoires.');
      return;
    }

    setLoading(true);

    const payload = {
      name: name.trim(),
      reference: reference.trim(),
      category: category.trim(),
      description: description.trim() || null,
      quantity: parseInt(quantity, 10) || 0,
      minThreshold: parseInt(minThreshold, 10) || 5,
    };

    try {
      const url = isEditing ? `${API_URL}/${productToEdit?.id}` : API_URL;
      const method = isEditing ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error('Erreur de sauvegarde');
      }

      Alert.alert('Succès', isEditing ? 'Produit mis à jour !' : 'Produit créé !');
      navigation.goBack();
    } catch (error) {
      Alert.alert('Erreur', 'Impossible de sauvegarder le produit.');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = () => {
    if (!productToEdit?.id) return;

    Alert.alert(
      'Confirmation',
      'Voulez-vous vraiment supprimer ce produit ?',
      [
        { text: 'Annuler', style: 'cancel' },
        {
          text: 'Supprimer',
          style: 'destructive',
          onPress: async () => {
            setLoading(true);
            try {
              const response = await fetch(`${API_URL}/${productToEdit.id}`, {
                method: 'DELETE',
              });

              if (!response.ok) throw new Error('Erreur de suppression');

              Alert.alert('Succès', 'Produit supprimé !');
              navigation.goBack();
            } catch (error) {
              Alert.alert('Erreur', 'Impossible de supprimer le produit.');
              console.error(error);
            } finally {
              setLoading(false);
            }
          },
        },
      ]
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Text style={styles.title}>
          {isEditing ? 'Modifier le Produit' : 'Nouveau Produit'}
        </Text>

        <Text style={styles.label}>Nom du produit *</Text>
        <TextInput
          style={styles.input}
          placeholder="Ex: Ecran Dell 27 pouces"
          value={name}
          onChangeText={setName}
        />

        <Text style={styles.label}>Référence unique *</Text>
        <TextInput
          style={styles.input}
          placeholder="Ex: REF-DELL-27"
          value={reference}
          onChangeText={setReference}
          autoCapitalize="characters"
        />

        <Text style={styles.label}>Catégorie *</Text>
        <TextInput
          style={styles.input}
          placeholder="Ex: Informatique, Électronique..."
          value={category}
          onChangeText={setCategory}
        />

        <View style={styles.row}>
          <View style={styles.flex1}>
            <Text style={styles.label}>Quantité</Text>
            <TextInput
              style={styles.input}
              keyboardType="numeric"
              value={quantity}
              onChangeText={setQuantity}
            />
          </View>

          <View style={[styles.flex1, { marginLeft: 12 }]}>
            <Text style={styles.label}>Seuil d'alerte</Text>
            <TextInput
              style={styles.input}
              keyboardType="numeric"
              value={minThreshold}
              onChangeText={setMinThreshold}
            />
          </View>
        </View>

        <Text style={styles.label}>Description</Text>
        <TextInput
          style={[styles.input, styles.textArea]}
          placeholder="Détails du produit..."
          multiline
          numberOfLines={4}
          value={description}
          onChangeText={setDescription}
        />

        {loading ? (
          <ActivityIndicator size="large" color="#007AFF" style={{ marginTop: 20 }} />
        ) : (
          <View style={styles.buttonContainer}>
            <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
              <Text style={styles.buttonText}>
                {isEditing ? 'Mettre à jour' : 'Enregistrer'}
              </Text>
            </TouchableOpacity>

            {isEditing && (
              <TouchableOpacity style={styles.deleteButton} onPress={handleDelete}>
                <Text style={styles.buttonText}>Supprimer le produit</Text>
              </TouchableOpacity>
            )}

            <TouchableOpacity style={styles.cancelButton} onPress={() => navigation.goBack()}>
              <Text style={styles.cancelButtonText}>Annuler</Text>
            </TouchableOpacity>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f7',
  },
  scrollContent: {
    padding: 20,
  },
  title: {
    fontSize: 22,
    fontWeight: '700',
    color: '#1c1c1e',
    marginBottom: 20,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#3a3a3c',
    marginBottom: 6,
  },
  input: {
    backgroundColor: '#fff',
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 10,
    fontSize: 15,
    borderWidth: 1,
    borderColor: '#e1e1e8',
    marginBottom: 16,
  },
  textArea: {
    height: 90,
    textAlignVertical: 'top',
  },
  row: {
    flexDirection: 'row',
  },
  flex1: {
    flex: 1,
  },
  buttonContainer: {
    marginTop: 10,
    gap: 10,
  },
  saveButton: {
    backgroundColor: '#007AFF',
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: 'center',
  },
  deleteButton: {
    backgroundColor: '#FF3B30',
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: 'center',
  },
  cancelButton: {
    paddingVertical: 12,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  cancelButtonText: {
    color: '#8e8e93',
    fontSize: 15,
  },
});

export default ProductDetailScreen;