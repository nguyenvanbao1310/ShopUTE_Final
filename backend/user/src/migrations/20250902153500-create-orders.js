"use strict";
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("Orders", {
      id: { type: Sequelize.INTEGER, allowNull: false, autoIncrement: true, primaryKey: true },
      userId: { type: Sequelize.INTEGER, allowNull: true , references: {model: "Users", key: "id",}, onUpdate: "CASCADE", onDelete: "SET NULL",},
      code: { type: Sequelize.STRING(30), allowNull: false, unique: true },
      totalAmount: { type: Sequelize.DECIMAL(14,2), allowNull: false },
      status: { type: Sequelize.ENUM("PENDING","PAID","CANCELLED","SHIPPED","COMPLETED"), allowNull: false, defaultValue: "PENDING" },
      paymentMethod: { type: Sequelize.STRING(30), allowNull: true },
      paymentStatus: { type: Sequelize.ENUM("UNPAID","PAID","REFUNDED"), allowNull: false, defaultValue: "UNPAID" },
      note: { type: Sequelize.TEXT, allowNull: true },
      createdAt: { type: Sequelize.DATE, allowNull: false, defaultValue: Sequelize.fn("NOW") },
      updatedAt: { type: Sequelize.DATE, allowNull: false, defaultValue: Sequelize.fn("NOW") },
    });
  },
  async down(queryInterface) {
    return queryInterface.dropTable("Orders");
  }
};
