const { Sequelize } = require('sequelize');

require('dotenv').config();

const dbtest = process.env.db || 'eveytest'; // le nom de la base de données pour les tests
const user = process.env.user || 'root';
const password = process.env.password || '12345';
const host = process.env.host || 'localhost';
const dialect = process.env.dialect|| 'mysql';

// Connexion à la base de données de test
const sequelize = new Sequelize( dbtest, user, password, {
    host: host,
    dialect: dialect,
    logging: false,
});

// Exporter l'instance Sequelize pour l'utiliser dans d'autres fichiers
module.exports = sequelize;