'use strict';
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('Messages', {
      id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true,
      },
      messageID: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4, // Or Sequelize.UUIDV1
        allowNull: false,
      },
      conversationID: {
        type: Sequelize.UUID,
        allowNull: false,
      },
      senderID: {
        type: Sequelize.UUID,
        allowNull: false,
      },
      messageType: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      content: {
        type: Sequelize.STRING,
        allowNull: false,
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
    return queryInterface.dropTable('Messages');
  }
};
