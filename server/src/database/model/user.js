const { DataTypes } = require('sequelize');
const sequelize = require('../index');

// Tester la connexion à la base de données
try {
    sequelize.authenticate();
    console.log('Connexion à la base de données réussie.');
  } catch (error) {
    console.error('Impossible de se connecter à la base de données:', error);
}

// active(true fauls), admin(),
// Modèle de la table user
const User = sequelize.define('user', {
     name: {
      type: DataTypes.STRING,
      allowNull: false
    },role: {
      type: DataTypes.ENUM('user', 'admin'), 
      defaultValue: 'user', 
      allowNull: false
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true
    },
    password: {
      type: DataTypes.STRING,
      allowNull: true
    },
    GoogleId:{
      type: DataTypes.STRING,
      allowNull: true,
    }, status: {
      type: DataTypes.ENUM('active', 'blocked'), 
      defaultValue: 'active', 
      allowNull: false
    },
    numPodcasts: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0
    }, alert: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0
    },
    picture:{
      type: DataTypes.STRING,
      allowNull:true,
    },
  }, {
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at'
  });
  
  User.associate = function(models) {
    User.hasMany(models.Podcast, { as: 'podcasts', foreignKey: 'UserId' });
  };


sequelize.sync(); // Cette ligne synchronise les modèles avec la base de données


module.exports = { sequelize, User };