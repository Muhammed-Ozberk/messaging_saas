'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => queryInterface.addColumn('Users', 'passwordHash', {
    type: Sequelize.STRING(60),
    // Legacy users cannot be assigned a safe password automatically. Seeding fills this value.
    allowNull: true,
  }),
  down: (queryInterface) => queryInterface.removeColumn('Users', 'passwordHash'),
};
