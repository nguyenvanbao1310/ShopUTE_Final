"use strict";

const bcrypt = require("bcryptjs");

module.exports = {
  async up(queryInterface, Sequelize) {
    // Hash mật khẩu "13102004Bao"
    const hashedPassword = await bcrypt.hash("13102004Bao", 10);

    return queryInterface.bulkInsert("Users", [
      {
        email: "nguyenhoanggiaphong12@gmail.com",
        password: hashedPassword,
        firstName: "Bao",
        lastName: "Nguyen",
        phone: "0768640214",
        otp: null,
        otpExpire: null,
        role: "admin",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ]);
  },

  async down(queryInterface, Sequelize) {
    return queryInterface.bulkDelete("Users", null, {});
  },
};
