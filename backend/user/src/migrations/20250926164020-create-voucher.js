"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("vouchers", {
      id: {
        type: Sequelize.INTEGER.UNSIGNED,
        autoIncrement: true,
        primaryKey: true,
      },
      code: {
        type: Sequelize.STRING(50),
        allowNull: false,
        unique: true,
      },
      discountType: {
        type: Sequelize.ENUM("PERCENT", "FIXED"),
        allowNull: false,
      },
      discountValue: {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: false,
      },
      minOrderValue: {
        type: Sequelize.DECIMAL(12, 2),
        allowNull: true,
      },
      expiredAt: {
        type: Sequelize.DATE,
        allowNull: false,
      },
      createdAt: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
      },
      updatedAt: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
      },
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("vouchers");
  },
};
