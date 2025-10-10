'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.addColumn("Addresses", "phone", {
    type: Sequelize.STRING(20),
    allowNull: false,
    defaultValue: "", // hoặc null nếu muốn cho phép
  });
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.removeColumn("Addresses", "phone");
  }
};
