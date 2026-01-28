const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');

const Service = sequelize.define('service', {
  title: { type: DataTypes.STRING, allowNull: false },
  description: { type: DataTypes.TEXT },
  price: { type: DataTypes.STRING, allowNull: false },
  category: { type: DataTypes.STRING },
  // On change 'image' en 'images' qui stockera un tableau JSON d'URLs
  // Ex: ["url1.jpg", "url2.jpg"]
  images: { 
    type: DataTypes.TEXT, 
    defaultValue: '[]',
    get() {
        const rawValue = this.getDataValue('images');
        try {
            return JSON.parse(rawValue || '[]');
        } catch (e) {
            return [];
        }
    },
    set(value) {
        this.setDataValue('images', JSON.stringify(value));
    }
  },
  views: { type: DataTypes.INTEGER, defaultValue: 0 }
});

module.exports = Service;