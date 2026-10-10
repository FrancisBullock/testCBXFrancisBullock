import express from 'express';
import cors from 'cors';
import productRoutes from './routes/products.js';

const app = express();
const PORT = process.env.PORT || 3000;

// Middlewares
app.use(cors());
app.use(express.json());

// Endpoint de santé
app.get('/health', (_req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Routes API Produits
app.use('/api/products', productRoutes);

// Démarrage du serveur
app.listen(PORT, () => {
  console.log(`✅ Serveur backend démarré sur http://localhost:${PORT}`);
});