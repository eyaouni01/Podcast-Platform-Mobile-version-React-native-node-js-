module.exports = {
    up: async (queryInterface, Sequelize) => {
      await queryInterface.addColumn('reports', 'status', {
        type: Sequelize.ENUM('active', 'blocked'),
        defaultValue: 'active',
        allowNull: false
      });
    },
  
    down: async (queryInterface, Sequelize) => {
      await queryInterface.removeColumn('reports', 'status');
    }
  };