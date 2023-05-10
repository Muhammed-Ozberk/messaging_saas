'use strict';
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('Conversations', {
      id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true,
      },
      conversationID: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4, // Or Sequelize.UUIDV1
        allowNull: false,
      },
      userOne: {
        type: Sequelize.UUID,
        allowNull: false,
      },
      userTwo: {
        type: Sequelize.UUID,
        allowNull: false,
      },
      isSeen: {
        type: Sequelize.STRING,
        allowNull: false,
        defaultValue: "false"
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    })
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable('Conversations');
  }
};
