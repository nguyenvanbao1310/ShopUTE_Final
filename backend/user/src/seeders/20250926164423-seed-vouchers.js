"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert("vouchers", [
      {
        code: "SALE10K",
        discountType: "FIXED",
        discountValue: 10000,
        minOrderValue: 50000,
        expiredAt: new Date("2025-12-31"),
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        code: "SALE20P",
        discountType: "PERCENT",
        discountValue: 20,
        minOrderValue: 100000,
        expiredAt: new Date("2025-12-31"),
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        code: "FREESHIP",
        discountType: "FIXED",
        discountValue: 15000,
        minOrderValue: 0,
        expiredAt: new Date("2025-12-31"),
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ]);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete("vouchers", null, {});
  },
};
