"use strict";
module.exports = {
  async up(queryInterface, Sequelize) {
    // Xóa cột status cũ
    await queryInterface.removeColumn("Orders", "status");

    // Thêm lại cột status mới (không còn "PAID")
    await queryInterface.addColumn("Orders", "status", {
      type: Sequelize.ENUM("PENDING", "CONFIRMED", "SHIPPED", "COMPLETED", "CANCELLED"),
      allowNull: false,
      defaultValue: "PENDING",
    });
  },

  async down(queryInterface, Sequelize) {
    // Rollback: xóa status mới
    await queryInterface.removeColumn("Orders", "status");

    // Thêm lại status cũ (có "PAID")
    await queryInterface.addColumn("Orders", "status", {
      type: Sequelize.ENUM("PENDING", "PAID", "CANCELLED", "SHIPPED", "COMPLETED"),
      allowNull: false,
      defaultValue: "PENDING",
    });
  },
};
