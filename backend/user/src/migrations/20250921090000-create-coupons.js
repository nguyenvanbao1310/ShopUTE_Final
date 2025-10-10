'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('coupons', {
      id: { type: Sequelize.INTEGER, autoIncrement: true, primaryKey: true },
      code: { type: Sequelize.STRING(50), allowNull: false, unique: true },
      userId: {
        type: Sequelize.INTEGER,
        allowNull: true,
        references: { model: 'users', key: 'id' },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL',
      },
      type: { type: Sequelize.ENUM('PERCENT', 'AMOUNT'), allowNull: false, defaultValue: 'PERCENT' },
      value: { type: Sequelize.DECIMAL(10, 2), allowNull: false },
      minOrderAmount: { type: Sequelize.DECIMAL(14, 2), allowNull: true },
      expiresAt: { type: Sequelize.DATE, allowNull: true },
      isUsed: { type: Sequelize.BOOLEAN, allowNull: false, defaultValue: false },
      usedAt: { type: Sequelize.DATE, allowNull: true },
      createdAt: { allowNull: false, type: Sequelize.DATE, defaultValue: Sequelize.literal('CURRENT_TIMESTAMP') },
      updatedAt: { allowNull: false, type: Sequelize.DATE, defaultValue: Sequelize.literal('CURRENT_TIMESTAMP') },
    });
  },
  async down(queryInterface) {
    await queryInterface.dropTable('coupons');
  },
};

