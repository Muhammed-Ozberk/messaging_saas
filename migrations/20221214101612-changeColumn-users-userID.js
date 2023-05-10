'use strict';
module.exports = {
  up: function (queryInterface, Sequelize) {
    return queryInterface.changeColumn('Users', 'userID', {
      type: Sequelize.STRING(36),       
      allowNull: false,    
      unique: true,   
    });
  },
  down: function (queryInterface, Sequelize) {
    return queryInterface.changeColumn('Users', 'userID', {
      type: Sequelize.UUID,
      defaultValue: Sequelize.UUIDV4,
      allowNull: false,
    });
  }
};