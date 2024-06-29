'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('reports', 'title', {
      type: Sequelize.STRING,
      allowNull: false
    });

    await queryInterface.addColumn('reports', 'author', {
      type: Sequelize.STRING,
      allowNull: false
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('reports', 'title');
    await queryInterface.removeColumn('reports', 'author');
  }
};
