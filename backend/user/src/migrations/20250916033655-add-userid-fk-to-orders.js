"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addConstraint("Orders", {
      fields: ["userId"],
      type: "foreign key",
      name: "fk_orders_userId", // tên constraint (unique trong DB)
      references: {
        table: "Users",
        field: "id",
      },
      onUpdate: "CASCADE",
      onDelete: "SET NULL",
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeConstraint("Orders", "fk_orders_userId");
  },
};
