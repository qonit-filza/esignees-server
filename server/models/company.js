'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Company extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Company.hasMany(models.User, {foreignKey: "CompanyId"})
    }
  }
  Company.init({
    nameCompany: {
      type : DataTypes.STRING,
      allowNull : false,
      validate: {
        notNull: {
          msg: `company name is required`,
        },
        notEmpty: {
          msg: `company name is required`,
        },
      },
    },
    legalName: {
      type : DataTypes.STRING,
      allowNull : false,
      validate: {
        notNull: {
          msg: `legal name company is required`,
        },
        notEmpty: {
          msg: `legal name company is required`,
        },
      },
    },
    address: {
      type : DataTypes.STRING,
      allowNull : false,
      validate: {
        notNull: {
          msg: `address company is required`,
        },
        notEmpty: {
          msg: `address company is required`,
        },
      },
    },
    phoneCompany: {
      type : DataTypes.STRING,
      allowNull : false,
      validate: {
        notNull: {
          msg: `phone number company is required`,
        },
        notEmpty: {
          msg: `phone number company is required`,
        },
      },
    },
    emailCompany: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notNull: {
          msg: `email company is required`,
        },
        notEmpty: {
          msg: `email company is required`,
        },
        isEmail: {
          msg: `email company is not valid`,
        },
      },
      unique: {
        args: true,
        msg: "email company address already in use!",
      },
    },
    industry: DataTypes.STRING,
    companySize: DataTypes.STRING,
    companyInviteCode: DataTypes.STRING,
    status: DataTypes.STRING,
    dueDate: DataTypes.DATE
  }, {
    sequelize,
    modelName: 'Company',
  });
  Company.beforeCreate((item)=>{
    item.companyInviteCode = "E-signess-" + Math.floor(1000000 + Math.random()*9999999)
    item.status = "Free"
    return item
  })
  return Company;
};