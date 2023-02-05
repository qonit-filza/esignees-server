'use strict';
const { Model } = require('sequelize');
const { hashPassword } = require('../helpers/bcrypt');
module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      User.belongsTo(models.Company, { foreignKey: 'CompanyId' });
      User.hasMany(models.Contact, { foreignKey: 'UserIdOwner' });
      User.hasMany(models.Contact, { foreignKey: 'UserIdContact' });
      User.hasMany(models.Notification, { foreignKey: 'UserId' });
      User.hasMany(models.Message, { foreignKey: 'UserIdSender' });
      User.hasMany(models.Message, { foreignKey: 'UserIdReceiver' });
      User.hasOne(models.Signature);
      User.hasMany(models.Document);
    }
  }
  User.init(
    {
      name: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notNull: {
            msg: `name is required`,
          },
          notEmpty: {
            msg: `name is required`,
          },
        },
      },
      role: DataTypes.STRING,
      email: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notNull: {
            msg: `email is required`,
          },
          notEmpty: {
            msg: `email is required`,
          },
          isEmail: {
            msg: `Email is not valid`,
          },
        },
        unique: {
          args: true,
          msg: 'Email address already in use!',
        },
      },
      phone: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notNull: {
            msg: `phone number is required`,
          },
          notEmpty: {
            msg: `phone number is required`,
          },
        },
      },
      password: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notNull: {
            msg: `password is required`,
          },
          notEmpty: {
            msg: `password is required`,
          },
        },
      },
      jobTitle: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notNull: {
            msg: `Job Title is required`,
          },
          notEmpty: {
            msg: `Job Title is required`,
          },
        },
      },
      ktpId: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notNull: {
            msg: `ID Card number is required`,
          },
          notEmpty: {
            msg: `ID Card number is required`,
          },
        },
      },
      publicKey: DataTypes.TEXT,
      ktpImage: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notNull: {
            msg: `ID Card Image is required`,
          },
          notEmpty: {
            msg: `ID Card Image is required`,
          },
        },
      },
      status: DataTypes.STRING,
      CompanyId: DataTypes.INTEGER,
    },
    {
      sequelize,
      modelName: 'User',
    }
  );
  User.beforeCreate((item) => {
    item.password = hashPassword(item.password);
    item.status = 'Unverified';
    return item;
  });
  return User;
};
