"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    // Remove isActive from ratings as it is no longer used
    const table = "ratings";
    const column = "isActive";
    // Some dialects error if column doesn't exist; wrap defensively
    try {
      await queryInterface.removeColumn(table, column);
    } catch (e) {
      // no-op if already removed
    }
  },

  async down(queryInterface, Sequelize) {
    // Restore isActive column
    await queryInterface.addColumn("ratings", "isActive", {
      type: Sequelize.BOOLEAN,
      allowNull: false,
      defaultValue: true,
      after: "comment",
    });
  },
};

