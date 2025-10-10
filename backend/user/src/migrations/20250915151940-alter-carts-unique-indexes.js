"use strict";

module.exports = {
  async up(queryInterface) {
    await queryInterface.addIndex("Carts", ["deviceId"], { unique: true, name: "uniq_carts_deviceId" });
    await queryInterface.addIndex("Carts", ["userId"],   { unique: true, name: "uniq_carts_userId" });
  },

  async down(queryInterface) {
    await queryInterface.removeIndex("Carts", "uniq_carts_userId");
    await queryInterface.removeIndex("Carts", "uniq_carts_deviceId");
  },
};
