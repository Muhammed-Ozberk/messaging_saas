'use strict';
module.exports = {
  up: function (queryInterface, Sequelize) {
    return queryInterface.renameColumn('Conversations', 'isSeen', 'seen');
  },
  down: function (queryInterface, Sequelize) {
    return queryInterface.renameColumn('Conversations', 'seen', 'isSeen');
  }
};
