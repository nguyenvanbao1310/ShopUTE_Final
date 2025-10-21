"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn("ratings", "isActive", {
      type: Sequelize.BOOLEAN,
      allowNull: false,
      defaultValue: true,
      after: "comment",
    });
    await queryInterface.addColumn("ratings", "containsProfanity", {
      type: Sequelize.BOOLEAN,
      allowNull: false,
      defaultValue: false,
      after: "isActive",
    });
    await queryInterface.addColumn("ratings", "moderationStatus", {
      type: Sequelize.ENUM("PENDING", "REVIEWED"),
      allowNull: false,
      defaultValue: "REVIEWED",
      after: "containsProfanity",
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn("ratings", "moderationStatus");
    await queryInterface.removeColumn("ratings", "containsProfanity");
    await queryInterface.removeColumn("ratings", "isActive");
  },
};

