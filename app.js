const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const { connectDB } = require('./config/db');
const { sequelize } = require('./models/Index'); 

// --- IMPORTS DES ROUTES ---
const serviceRoutes = require('./routes/serviceRoutes');
const messageRoutes = require('./routes/messageRoutes');
const authRoutes = require('./routes/authRoutes');
const adminRoutes = require('./routes/adminRoutes');
const reviewRoutes = require('./routes/reviewRoutes');

const app = express();

// --- CONFIGURATION CORS ---
const allowedOrigins = [
  'https://kribi-connect.vercel.app',
  'http://localhost:5173',
  'http://localhost:3000'
];

app.use(cors({
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// NOTE : On a supprimé app.use('/uploads'...) car Cloudinary gère les fichiers maintenant.

// --- ROUTES API ---
app.use('/api/auth', authRoutes);
app.use('/api/services', serviceRoutes);
app.use('/api/messages', messageRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/reviews', reviewRoutes);

app.get('/', (req, res) => {
  res.send('API Kribiconnect en ligne (Vercel + Cloudinary + MySQL Cloud)');
});

// --- DÉMARRAGE ---
if (process.env.NODE_ENV !== 'production') {
  const PORT = process.env.PORT || 5000;
  const startServer = async () => {
    try {
      await connectDB();
      await sequelize.sync({ alter: true }); 
      console.log('--- [Database] Tables synchronisées');
      app.listen(PORT, () => {
        console.log(`\n>>> Serveur prêt sur http://localhost:${PORT}`);
      });
    } catch (error) {
      console.error('!!! Erreur fatale:', error);
    }
  };
  startServer();
}

module.exports = app;