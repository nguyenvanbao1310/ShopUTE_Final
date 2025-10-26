"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("user_coupons", {
      id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      userId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: "Users", // tên bảng users thật trong DB
          key: "id",
        },
        onDelete: "CASCADE",
        onUpdate: "CASCADE",
      },
      couponId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: "Coupons", // tên bảng coupons thật trong DB
          key: "id",
        },
        onDelete: "CASCADE",
        onUpdate: "CASCADE",
      },
      usedAt: {
        type: Sequelize.DATE,
        allowNull: true,
      },
      createdAt: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
      },
      updatedAt: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal("CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP"),
      },
    });

    // ✅ unique index để ngăn user dùng cùng 1 coupon nhiều lần
    await queryInterface.addConstraint("user_coupons", {
      fields: ["userId", "couponId"],
      type: "unique",
      name: "uniq_user_coupon",
    });
  },

  async down(queryInterface) {
    await queryInterface.dropTable("user_coupons");
  },
};
