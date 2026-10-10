import { Router } from 'express';
import type { Request, Response } from 'express';
import { prisma } from '../db.js';

const router = Router();

// 1. GET /api/products — Récupérer la liste (recherche + filtre)
router.get('/', async (req: Request, res: Response): Promise<void> => {
  try {
    const search = typeof req.query.search === 'string' ? req.query.search : undefined;
    const category = typeof req.query.category === 'string' ? req.query.category : undefined;

    const where: any = {};

    if (search) {
      where.OR = [
        { name: { contains: search } },
        { reference: { contains: search } },
      ];
    }

    if (category && category !== 'ALL') {
      where.category = category;
    }

    const products = await prisma.product.findMany({
      where,
      orderBy: { updatedAt: 'desc' },
    });

    res.json(products);
  } catch (error) {
    res.status(500).json({ error: 'Erreur lors de la récupération des produits' });
  }
});

// 2. GET /api/products/low-stock — Alertes de stock bas
router.get('/low-stock', async (_req: Request, res: Response): Promise<void> => {
  try {
    const products = await prisma.product.findMany();
    const lowStockProducts = products.filter((p: any) => p.quantity <= p.minThreshold);
    res.json(lowStockProducts);
  } catch (error) {
    res.status(500).json({ error: 'Erreur lors de la récupération du stock bas' });
  }
});

// 3. GET /api/products/:id — Détail d'un produit
router.get('/:id', async (req: Request, res: Response): Promise<void> => {
  try {
    const id = req.params.id as string;
    const product = await prisma.product.findUnique({ where: { id } });

    if (!product) {
      res.status(404).json({ error: 'Produit non trouvé' });
      return;
    }

    res.json(product);
  } catch (error) {
    res.status(500).json({ error: 'Erreur lors de la récupération du produit' });
  }
});

// 4. POST /api/products — Créer un produit
router.post('/', async (req: Request, res: Response): Promise<void> => {
  try {
    const { name, reference, description, category, quantity, minThreshold } = req.body;

    const newProduct = await prisma.product.create({
      data: {
        name: String(name),
        reference: String(reference),
        description: description ? String(description) : null,
        category: String(category),
        quantity: Number(quantity) || 0,
        minThreshold: Number(minThreshold) || 5,
      },
    });

    res.status(201).json(newProduct);
  } catch (error) {
    res.status(400).json({ error: 'Erreur lors de la création du produit' });
  }
});

// 5. PUT /api/products/:id — Modifier un produit
router.put('/:id', async (req: Request, res: Response): Promise<void> => {
  try {
    const id = req.params.id as string;
    const { name, reference, description, category, quantity, minThreshold } = req.body;

    const updatedProduct = await prisma.product.update({
      where: { id },
      data: {
        name: String(name),
        reference: String(reference),
        description: description ? String(description) : null,
        category: String(category),
        quantity: Number(quantity),
        minThreshold: Number(minThreshold),
      },
    });

    res.json(updatedProduct);
  } catch (error) {
    res.status(400).json({ error: 'Erreur lors de la mise à jour' });
  }
});

// 6. DELETE /api/products/:id — Supprimer un produit
router.delete('/:id', async (req: Request, res: Response): Promise<void> => {
  try {
    const id = req.params.id as string;
    await prisma.product.delete({ where: { id } });
    res.status(204).send();
  } catch (error) {
    res.status(400).json({ error: 'Erreur lors de la suppression' });
  }
});

export default router;