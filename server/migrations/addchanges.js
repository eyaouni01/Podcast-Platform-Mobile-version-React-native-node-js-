'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('users', 'status', {
      type: Sequelize.DataTypes.ENUM('active', 'blocked'), 
      defaultValue: 'active', 
      allowNull: false
    });
    await queryInterface.addColumn('users', 'numPodcasts', {
      type: Sequelize.DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('users', 'status');
    await queryInterface.removeColumn('users', 'numPodcasts');
  }
};
