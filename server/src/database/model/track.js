const { DataTypes } = require('sequelize');
const sequelize = require('../index');

// Tester la connexion à la base de données
try {
    sequelize.authenticate();
    console.log('Connexion à la base de données réussie.');
  } catch (error) {
    console.error('Impossible de se connecter à la base de données:', error);
}

//pist url
// Modèle de la table track
const Track = sequelize.define('track', {
    title: {
      type: DataTypes.STRING,
      allowNull: false
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    podcastId: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    nbView: {
        type: DataTypes.INTEGER,
        defaultValue: 0
    },
    listeningTime: {
        type: DataTypes.FLOAT,
        defaultValue: 0
    },
    trackUrl: {
      type: DataTypes.STRING,
      allowNull: false
    }
  }, {
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at'
  });

  Track.associate = function(models) {
    Track.belongsTo(models.Podcast, { foreignKey: 'PodcastId' });
};

  
sequelize.sync(); // Cette ligne synchronise les modèles avec la base de données


module.exports = { sequelize, Track };