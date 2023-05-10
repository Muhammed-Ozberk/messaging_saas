'use strict';
module.exports = {
  up: function (queryInterface, Sequelize) {
    return queryInterface.removeColumn('Users', 'type');
  },
  down: function (queryInterface, Sequelize) {
    return queryInterface.addColumn('Users', 'type', {
      type: Sequelize.STRING,
      allowNull: false,
    });
  }
};