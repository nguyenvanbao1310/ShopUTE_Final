'use strict';

module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.createTable('ratings', {
      id: {type: Sequelize.INTEGER, autoIncrement: true, primaryKey: true},
      productId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {model: 'Products', key: 'id'},
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      },
      userId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {model: 'Users', key: 'id'},
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      },
      rating: { type: Sequelize.DECIMAL(2, 1), allowNull: false},
      comment: {type: Sequelize.TEXT, allowNull: true},
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
      },
    });
  }, 

  async down (queryInterface, Sequelize) {
    await queryInterface.dropTable('ratings');
  }
};
