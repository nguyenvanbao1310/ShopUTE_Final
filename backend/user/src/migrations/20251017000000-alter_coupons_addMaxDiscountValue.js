'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn('coupons', 'maxDiscountValue', {
      type: Sequelize.DECIMAL(14, 2),
      allowNull: true,
      after: 'minOrderAmount',
    });
  },

  async down(queryInterface) {
    await queryInterface.removeColumn('coupons', 'maxDiscountValue');
  },
};

