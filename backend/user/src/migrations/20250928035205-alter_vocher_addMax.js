"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn("vouchers", "maxDiscountValue", {
      type: Sequelize.DECIMAL(12, 2),
      allowNull: true,
      after: "minOrderValue", // (MySQL hỗ trợ, Postgres thì bỏ qua)
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn("vouchers", "maxDiscountValue");
  },
};
