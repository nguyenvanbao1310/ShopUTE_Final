'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    const table = 'users';
    const column = 'isActive';
    // Check existence by try-catch addColumn for idempotency in some environments
    try {
      await queryInterface.addColumn(table, column, {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: true,
        after: 'role',
      });
    } catch (e) {
      // ignore if already exists
    }
  },
  async down(queryInterface) {
    try {
      await queryInterface.removeColumn('users', 'isActive');
    } catch (e) {
      // ignore if doesn't exist
    }
  },
};

