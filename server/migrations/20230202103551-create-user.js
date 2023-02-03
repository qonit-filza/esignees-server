'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Users', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      name: {
        allowNull : false,
        type: Sequelize.STRING
      },
      role: {
        type: Sequelize.STRING
      },
      email: {
        allowNull : false,
        unique : true,
        type: Sequelize.STRING
      },
      phone: {
        allowNull : false,
        type: Sequelize.STRING
      },
      password: {
        allowNull : false,
        type: Sequelize.STRING
      },
      jobTitle: {
        allowNull : false,
        type: Sequelize.STRING
      },
      ktpId: {
        allowNull : false,
        type: Sequelize.STRING
      },
      publicKey: {
        type: Sequelize.STRING
      },
      ktpImage: {
        allowNull : false,
        type: Sequelize.STRING
      },
      status: {
        type: Sequelize.STRING
      },
      CompanyId: {
        type: Sequelize.INTEGER,
        references: {
          model: "Companies",
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
    await queryInterface.dropTable('Users');
  }
};