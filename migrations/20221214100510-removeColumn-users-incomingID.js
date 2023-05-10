'use strict';
module.exports = {
  up: function (queryInterface, Sequelize) {
    return queryInterface.removeColumn('Users', 'incomingID');
  },
  down: function (queryInterface, Sequelize) {
    return queryInterface.addColumn('Users', 'incomingID', {
      type: Sequelize.STRING,
      allowNull: false,
    });
  }
};