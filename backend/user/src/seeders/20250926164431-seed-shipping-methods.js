"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert("shipping_methods", [
      {
        name: "Shopee Express - Nhanh",
        fee: 15000,
        estimatedDays: "1-2 ngày",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: "Shopee Express - Tiết Kiệm",
        fee: 10000,
        estimatedDays: "3-5 ngày",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: "Giao Hàng Tiết Kiệm",
        fee: 12000,
        estimatedDays: "2-4 ngày",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: "Giao Hàng Nhanh",
        fee: 18000,
        estimatedDays: "1-3 ngày",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ]);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete("shipping_methods", null, {});
  },
};
