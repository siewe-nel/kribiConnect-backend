const { Sequelize } = require('sequelize');
const pg = require('pg'); // Utilisé pour PostgreSQL (similaire à mysql2 pour mysql)
require('dotenv').config();

/**
 * Note : Pour utiliser PostgreSQL avec Sequelize, assurez-vous d'avoir installé :
 * npm install sequelize pg pg-hstore
 */

console.log('--- [Config] Initialisation de la connexion Sequelize (PostgreSQL)...');

// URL de connexion Supabase fournie
const DATABASE_URL = process.env.DATABASE_URL || 'postgresql://postgres.pvtodattzfsnuinroixl:TtZhFchhvAGLfNg0@aws-1-eu-west-3.pooler.supabase.com:5432/postgres';

const sequelize = new Sequelize(DATABASE_URL, {
  dialect: 'postgres',
  dialectModule: pg, // Nécessaire pour le déploiement sur des environnements type Vercel
  logging: false,
  pool: {
    max: 5,
    min: 0,
    acquire: 30000,
    idle: 10000
  },
  dialectOptions: {
    ssl: {
      require: true,
      rejectUnauthorized: false // Indispensable pour se connecter à Supabase à distance
    }
  }
});

/**
 * Fonction pour tester la connexion à la base de données
 */
const connectDB = async () => {
  try {
    await sequelize.authenticate();
    console.log('--- [Config] Connexion à PostgreSQL réussie !');

    // On attend que la synchronisation soit finie
    await sequelize.sync({ alter: true });
    console.log("✅ Tables synchronisées avec succès");

  } catch (error) {
    console.error('--- [Config] Erreur de connexion ou de synchro:', error);
  }
};

module.exports = { sequelize, connectDB };
