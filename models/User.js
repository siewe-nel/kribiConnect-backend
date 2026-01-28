const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');

const User = sequelize.define('user', {
  id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
  name: { type: DataTypes.STRING, allowNull: false },
  email: { type: DataTypes.STRING, allowNull: false, unique: true },
  password: { type: DataTypes.STRING, allowNull: false },
  role: { 
    type: DataTypes.ENUM('client', 'provider', 'admin'), 
    defaultValue: 'client' 
  },
  avatar: { 
    type: DataTypes.STRING, 
    defaultValue: null 
  },
  // Nouveau : Pour savoir quand l'utilisateur était là pour la dernière fois
  lastSeen: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  }
});

module.exports = User;