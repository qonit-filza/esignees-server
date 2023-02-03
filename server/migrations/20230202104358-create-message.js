'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Messages', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      message: {
        allowNull : false,
        type: Sequelize.STRING
      },
      status: {
        type: Sequelize.STRING
      },
      UserIdSender: {
        type: Sequelize.INTEGER,
        references: {
          model: "Users",
          key : "id"
        },
        onUpdate: "CASCADE",
        onDelete: "CASCADE",
      },
      UserIdReceiver: {
        allowNull : false,
        type: Sequelize.INTEGER,
        references: {
          model: "Users",
          key : "id"
        },
        onUpdate: "CASCADE",
        onDelete: "CASCADE",
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('Messages');
  }
};