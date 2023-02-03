'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Contacts', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      UserIdOwner: {
        type: Sequelize.INTEGER,
        references: {
          model: "Users",
          key : "id"
        },
        onUpdate: "CASCADE",
        onDelete: "CASCADE",
      },
      UserIdContact: {
        type: Sequelize.INTEGER,
        allowNull : false,
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
    await queryInterface.dropTable('Contacts');
  }
};