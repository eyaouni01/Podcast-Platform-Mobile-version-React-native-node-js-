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
const Report = sequelize.define('report', {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      reason: {
        type: DataTypes.STRING,
        allowNull: false
      },status: {
        type: DataTypes.ENUM('active', 'blocked'), 
        defaultValue: 'active', 
        allowNull: false
      },
      podcastId: {
        type: DataTypes.INTEGER,
        allowNull: false
      },
      
       title: {
      type: DataTypes.STRING,
      allowNull: false
      },
        author: {
        type: DataTypes.STRING,
        allowNull: false
  }
  });

  Report.associate = function(models) {
    Report.belongsTo(models.Podcast, { foreignKey: 'PodcastId' });
};

  
sequelize.sync(); // Cette ligne synchronise les modèles avec la base de données


module.exports = { sequelize, Report };