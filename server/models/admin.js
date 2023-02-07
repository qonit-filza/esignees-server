'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Admin extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  Admin.init({
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notNull: {
          msg: `name cant be null`,
        },
        notEmpty: {
          msg: `name cant be empty`,
        },
      },
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notNull: {
          msg: `email is required`,
        },
        notEmpty: {
          msg: `email is cant be empty`,
        },
        isEmail: {
          msg: `Email is not valid`,
        }
      }
    },
    phone: DataTypes.STRING,
    password: {
      type: DataTypes.STRING,
      validate: {
        notEmpty: {
          msg: `password cant be empty`,
        },
      }
    },
  }, {
    sequelize,
    modelName: 'Admin',
  });
  return Admin;
};