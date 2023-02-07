'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Companies', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      nameCompany: {
        allowNull : false,
        type: Sequelize.STRING
      },
      legalName: {
        allowNull : false,
        type: Sequelize.STRING
      },
      address: {
        allowNull : false,
        type: Sequelize.STRING
      },
      phoneCompany: {
        allowNull : false,
        type: Sequelize.STRING
      },
      emailCompany: {
        allowNull : false,
        type: Sequelize.STRING,
        unique : true
      },
      industry: {
        type: Sequelize.STRING
      },
      companySize: {
        type: Sequelize.STRING
      },
      companyInviteCode: {
        type: Sequelize.STRING
      },
      status: {
        type: Sequelize.STRING
      },
      dueDate: {
        type: Sequelize.DATE
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
    await queryInterface.dropTable('Companies');
  }
};