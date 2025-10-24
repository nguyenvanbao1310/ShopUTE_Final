"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("notifications", {
      id: {
        type: Sequelize.INTEGER.UNSIGNED,
        autoIncrement: true,
        primaryKey: true,
      },
      receiver_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: "Users", // tên bảng user thật trong DB
          key: "id",
        },
        onDelete: "CASCADE",
        onUpdate: "CASCADE",
      },
      receiver_role: {
        type: Sequelize.ENUM("user", "admin"),
        allowNull: false,
      },
      type: {
        type: Sequelize.ENUM("ORDER", "COMMENT", "REVIEW", "SYSTEM", "LOYALTY"),
        allowNull: false,
        defaultValue: "SYSTEM",
      },
      title: {
        type: Sequelize.STRING(255),
        allowNull: false,
      },
      message: {
        type: Sequelize.TEXT,
        allowNull: false,
      },
      action_url: {
        type: Sequelize.STRING(255),
        allowNull: true,
      },
      is_read: {
        type: Sequelize.BOOLEAN,
        defaultValue: false,
      },
      send_email: {
        type: Sequelize.BOOLEAN,
        defaultValue: false,
      },
      created_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
      },
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("notifications");
    // Xoá enum khỏi DB nếu cần (đề phòng xung đột khi migrate lại)
    await queryInterface.sequelize.query(
      "DROP TYPE IF EXISTS enum_notifications_receiver_role;"
    );
    await queryInterface.sequelize.query(
      "DROP TYPE IF EXISTS enum_notifications_type;"
    );
  },
};
