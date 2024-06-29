const { DataTypes } = require('sequelize');
const sequelize = require('../index.js');


// Tester la connexion à la base de données
try {
    sequelize.authenticate();
    console.log('Connexion à la base de données réussie.');
  } catch (error) {
    console.error('Impossible de se connecter à la base de données:', error);
}

//3 collonnes images (petit, moyen, grand) (crop outil),  

// Modèle de la table Podcasts
const Podcast = sequelize.define('podcast', {
    title: {
      type: DataTypes.STRING,
      allowNull: false
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    author: {
      type: DataTypes.STRING,
      allowNull: false
    },
    topic: {
      type: DataTypes.STRING,
      allowNull: false
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: true
    }, status: {
      type: DataTypes.ENUM('active', 'blocked'), 
      defaultValue: 'active', 
      allowNull: false
    },
    imageUrl: {
      type: DataTypes.STRING,
      allowNull: false
    },
    views: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
    allowNull: false
  }
  }, {
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at'
});

Podcast.associate = function(models) {
  Podcast.hasMany(models.Track, { as: 'tracks' });
  Podcast.belongsTo(models.User, { foreignKey: 'userId' });
  Podcast.hasMany(models.Report, { as: 'report' });
};

  

// Synchronise les modèles avec la base de données
async function syncModels() {
    try {
      await sequelize.sync();
      console.log('Models synchronized successfully');
    } catch (error) {
      console.error('Error synchronizing models:', error);
    }
  }
  
  syncModels();

module.exports = { sequelize, Podcast };