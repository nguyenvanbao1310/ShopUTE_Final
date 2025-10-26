"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("rating_replies", {
      id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
      },
      ratingId: {
        type: Sequelize.INTEGER.UNSIGNED,
        allowNull: false,
        references: { model: "ratings", key: "id" },
        onUpdate: "CASCADE",
        onDelete: "CASCADE",
      },
      adminUserId: {
        type: Sequelize.INTEGER.UNSIGNED,
        allowNull: true,
        references: { model: "Users", key: "id" },
        onUpdate: "SET NULL",
        onDelete: "SET NULL",
      },
      message: {
        type: Sequelize.TEXT,
        allowNull: false,
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
      },
    });

    await queryInterface.addIndex("rating_replies", ["ratingId", "createdAt"], {
      name: "idx_rating_replies_rating_time",
    });
  },

  async down(queryInterface) {
    await queryInterface.removeIndex(
      "rating_replies",
      "idx_rating_replies_rating_time"
    );
    await queryInterface.dropTable("rating_replies");
  },
};

