// Si tu testes sur Émulateur Android : http://10.0.2.2:3000/api
// Si tu testes sur Simulateur iOS : http://localhost:3000/api
// Si tu testes sur Expo Go / Téléphone physique : http://<TON_IP_LOCALE>:3000/api

const API_URL = 'http://localhost:3000/api';

export const getProducts = async (search?: string, category?: string) => {
  const params = new URLSearchParams();
  if (search) params.append('search', search);
  if (category && category !== 'ALL') params.append('category', category);

  const response = await fetch(`${API_URL}/products?${params.toString()}`);
  if (!response.ok) throw new Error('Erreur réseau');
  return response.json();
};

export const getLowStockProducts = async () => {
  const response = await fetch(`${API_URL}/products/low-stock`);
  if (!response.ok) throw new Error('Erreur réseau');
  return response.json();
};