"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn("orders", "discountAmount", {
      type: Sequelize.DECIMAL(14, 2),
      allowNull: true,
    });
    await queryInterface.addColumn("orders", "shippingFee", {
      type: Sequelize.DECIMAL(14, 2),
      allowNull: true,
    });
    await queryInterface.addColumn("orders", "finalAmount", {
      type: Sequelize.DECIMAL(14, 2),
      allowNull: true,
    });
    await queryInterface.addColumn("orders", "usedPoints", {
      type: Sequelize.INTEGER.UNSIGNED,
      allowNull: false,
      defaultValue: 0,
    });
    await queryInterface.addColumn("orders", "pointsDiscountAmount", {
      type: Sequelize.DECIMAL(14, 2),
      allowNull: true,
    });
    await queryInterface.addColumn("orders", "voucherId", {
      type: Sequelize.INTEGER.UNSIGNED,
      allowNull: true,
      references: {
        model: "vouchers",
        key: "id",
      },
      onUpdate: "CASCADE",
      onDelete: "SET NULL",
    });
    await queryInterface.addColumn("orders", "shippingMethodId", {
      type: Sequelize.INTEGER.UNSIGNED,
      allowNull: true,
      references: {
        model: "shipping_methods",
        key: "id",
      },
      onUpdate: "CASCADE",
      onDelete: "SET NULL",
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn("orders", "discountAmount");
    await queryInterface.removeColumn("orders", "shippingFee");
    await queryInterface.removeColumn("orders", "finalAmount");
    await queryInterface.removeColumn("orders", "usedPoints");
    await queryInterface.removeColumn("orders", "pointsDiscountAmount");
    await queryInterface.removeColumn("orders", "voucherId");
    await queryInterface.removeColumn("orders", "shippingMethodId");
  },
};
