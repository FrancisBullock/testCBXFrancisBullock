# Application de Gestion de Stock (Full Stack Mobile)

Application mobile et API backend pour la gestion et le suivi des stocks de produits en temps réel, développée dans le cadre d'un test technique.

---

## 🛠️ Stack Technique

- **Backend** : Node.js, Express, TypeScript (ESM), Prisma ORM, SQLite
- **Mobile** : React Native, Expo, TypeScript, React Navigation (Stack)
- **Base de données** : SQLite (via Prisma)

---

## 🚀 Fonctionnalités

### Backend (REST API)
- **CRUD complet** des produits (`GET`, `POST`, `PUT`, `DELETE` /api/products)
- **Recherche & Filtres** : Recherche par nom/référence et filtrage par catégorie
- **Gestion du stock bas** : Endpoint dédié pour l'alerte sur le seuil minimum (`minThreshold`)

### Mobile (React Native / Expo)
- **`HomeScreen`** :
  - Liste de tous les produits
  - Barre de recherche en temps réel (nom / référence)
  - Filtres horizontaux par catégorie
  - Badges visuels d'alerte si `quantity <= minThreshold`
- **`ProductDetailScreen`** :
  - Formulaire de création / modification
  - Suppression de produit avec confirmation
  - Validation des champs obligatoires et des quantités

---

## ⚙️ Installation et Lancement

### 1. Prérequis
- Node.js (v18+)
- npm ou yarn

### 2. Démarrage du Backend
```bash
cd backend
npm install
npm run db:push
npm run dev
Le serveur backend démarrera sur http://localhost:3000.


🤝 Transparence & Utilisation de l'IA
Conformément aux bonnes pratiques de développement moderne, ce projet a été conçu et réalisé en tirant parti d'un assistant IA comme outil d'accompagnement :

Cadrage & Architecture : Génération des structures de base pour le serveur Express, le schéma Prisma et la navigation React Native.

Assistance au Débogage : Identification et résolution rapide d'erreurs d'environnement (erreurs d'import ESM TypeScript, gestion de dossiers/fichiers, compilation tsx).

Refactoring & Typage : Harmonisation des interfaces TypeScript entre le backend et le frontend mobile.

Rôle du développeur :

Pilotage et cadrage des besoins.

Validation technique des solutions proposées.

Recette fonctionnelle, tests d'intégration entre l'API REST et l'application Expo Go.
