"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.sequelize.query(`
      ALTER TABLE orders
      MODIFY COLUMN status ENUM(
        'PENDING',
        'CONFIRMED',
        'PREPARING',
        'SHIPPED',
        'COMPLETED',
        'CANCELLED',
        'CANCEL_REQUESTED'
      ) NOT NULL DEFAULT 'PENDING';
    `);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.sequelize.query(`
      ALTER TABLE orders
      MODIFY COLUMN status ENUM(
        'PENDING',
        'CONFIRMED',
        'SHIPPED',
        'COMPLETED',
        'CANCELLED'
      ) NOT NULL DEFAULT 'PENDING';
    `);
  },
};
