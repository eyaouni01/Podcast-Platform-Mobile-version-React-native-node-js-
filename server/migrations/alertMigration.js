module.exports = {
    up: async (queryInterface, Sequelize) => {
      await queryInterface.addColumn('users', 'alert', {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 0
      });
    },
  
    down: async (queryInterface, Sequelize) => {
      await queryInterface.removeColumn('users', 'alert');
    }
  };