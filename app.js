const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const path = require('path');
const { connectDB } = require('./config/db');
// Import du dossier models (charge automatiquement index.js)
const { sequelize } = require('./models/Index'); 

// --- IMPORTS DES ROUTES ---
const serviceRoutes = require('./routes/serviceRoutes');
const messageRoutes = require('./routes/messageRoutes');
const authRoutes = require('./routes/authRoutes');
const adminRoutes = require('./routes/adminRoutes');
const reviewRoutes = require('./routes/reviewRoutes'); // Route des avis

const app = express();

console.log('====================================');
console.log('   DÉMARRAGE SERVEUR KRIBICONNECT   ');
console.log('====================================');

// --- CONFIGURATION CORS ---
// Liste des origines autorisées (Local + Production)
const allowedOrigins = [
  'https://kribi-connect.vercel.app', // Ton Frontend déployé
  'http://localhost:5173',            // Vite local
  'http://localhost:3000'             // React Create App local
];

app.use(cors({
  origin: function (origin, callback) {
    // Autoriser les requêtes sans origine (ex: Postman, Mobile apps) ou si l'origine est dans la liste
    if (!origin || allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true, // Important pour les cookies/sessions
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// --- MIDDLEWARES ---
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// --- CONFIGURATION FICHIERS STATIQUES (UPLOADS) ---
// Rend le dossier 'server/uploads' accessible publiquement via l'URL /uploads
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// --- DÉFINITION DES ROUTES API ---
app.use('/api/auth', authRoutes);         // Login, Register, Profils
app.use('/api/services', serviceRoutes);  // Articles, Services
app.use('/api/messages', messageRoutes);  // Chat, Uploads fichiers
app.use('/api/admin', adminRoutes);       // Tableau de bord Admin
app.use('/api/reviews', reviewRoutes);    // Avis et Notations

// Route de base pour vérifier l'état de l'API
app.get('/', (req, res) => {
  res.send('API Kribiconnect en ligne (v1.0) - Auth, Chat, Admin & Reviews actifs');
});

// --- DÉMARRAGE DU SERVEUR ---
// Si on n'est pas en production (Vercel gère le démarrage en prod), on lance le serveur manuellement
if (process.env.NODE_ENV !== 'production') {
  const PORT = process.env.PORT || 5000;
  
  const startServer = async () => {
    try {
      // 1. Connexion à la Base de Données
      await connectDB();
      
      // 2. Synchronisation des Modèles
      // 'alter: true' met à jour les tables existantes (ajoute colonnes manquantes, crée tables manquantes comme Reviews)
      await sequelize.sync({ alter: true }); 
      console.log('--- [Database] Tables synchronisées et mises à jour (alter: true)');
      
      // 3. Écoute du port
      app.listen(PORT, () => {
        console.log(`\n>>> Serveur prêt sur http://localhost:${PORT}`);
        console.log(`>>> Dossier uploads servi sur http://localhost:${PORT}/uploads/\n`);
      });
    } catch (error) {
      console.error('!!! Erreur fatale au démarrage:', error);
    }
  };

  startServer();
}

// Export pour Vercel (Serverless function)
module.exports = app;