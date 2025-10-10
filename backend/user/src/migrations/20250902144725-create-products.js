"use strict";
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("Products", {
      id: { type: Sequelize.INTEGER, autoIncrement: true, primaryKey: true },
      name: { type: Sequelize.STRING(255), allowNull: false },
      description: { type: Sequelize.TEXT, allowNull: true },
      price: { type: Sequelize.DECIMAL(12,2), allowNull: false },
      viewCount: { type: Sequelize.INTEGER, allowNull: false, defaultValue: 0 },
      stock: { type: Sequelize.INTEGER, allowNull: false, defaultValue: 0 },
      status: { type: Sequelize.ENUM("ACTIVE","INACTIVE"), allowNull: false, defaultValue: "ACTIVE" },
      thumbnailUrl: { type: Sequelize.STRING(500), allowNull: true },
      categoryId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: { model: "Categories", key: "id" },
        onUpdate: "CASCADE",
        onDelete: "RESTRICT"
      },
      brand: { type: Sequelize.STRING(100), allowNull: false },
      cpu: { type: Sequelize.STRING(100), allowNull: false },
      ram: { type: Sequelize.STRING(50), allowNull: false },
      storage: { type: Sequelize.STRING(100), allowNull: false },
      gpu: { type: Sequelize.STRING(100), allowNull: false },
      screen: { type: Sequelize.STRING(100), allowNull: false },
      createdAt: { type: Sequelize.DATE, allowNull: false, defaultValue: Sequelize.fn("NOW") },
      updatedAt: { type: Sequelize.DATE, allowNull: false, defaultValue: Sequelize.fn("NOW") }
    });
  },
  async down(queryInterface) {
    await queryInterface.dropTable("Products");
  }
};
