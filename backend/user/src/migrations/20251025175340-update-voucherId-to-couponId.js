"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    // 1. Xóa khóa ngoại voucherId cũ
    await queryInterface.removeColumn("orders", "voucherId");

    // 2. Tạo khóa ngoại couponId mới
    await queryInterface.addColumn("orders", "couponId", {
      type: Sequelize.INTEGER,
      allowNull: true,
      references: {
        model: "coupons", // ✅ đổi sang bảng coupons
        key: "id",
      },
      onUpdate: "CASCADE",
      onDelete: "SET NULL",
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn("orders", "couponId");
    await queryInterface.addColumn("orders", "voucherId", {
      type: Sequelize.INTEGER,
      allowNull: true,
      references: {
        model: "vouchers",
        key: "id",
      },
      onUpdate: "CASCADE",
      onDelete: "SET NULL",
    });
  },
};
