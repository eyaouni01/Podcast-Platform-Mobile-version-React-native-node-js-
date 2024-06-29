module.exports = {
    up: (queryInterface, Sequelize) => {
      return queryInterface.changeColumn('tracks', 'listeningTime', {
        type: Sequelize.FLOAT,
        allowNull: false,
        defaultValue: 0.0
      });
    },
    down: (queryInterface, Sequelize) => {
      return queryInterface.changeColumn('tracks', 'listeningTime', {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 0
      });
    }
  };
  