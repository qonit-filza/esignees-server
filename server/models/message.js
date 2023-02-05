'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Message extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Message.belongsTo(models.User, { foreignKey: 'UserIdSender' });
      Message.belongsTo(models.User, { foreignKey: 'UserIdReceiver' });
      Message.hasMany(models.Document);
    }
  }
  Message.init(
    {
      message: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notNull: {
            msg: `Please insert your message for your friend`,
          },
          notEmpty: {
            msg: `Please insert your message for your friend`,
          },
        },
      },
      status: DataTypes.STRING,
      UserIdSender: DataTypes.INTEGER,
      UserIdReceiver: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: {
          notNull: {
            msg: `your email friend is required`,
          },
          notEmpty: {
            msg: `your email friend is required`,
          },
        },
      },
    },
    {
      sequelize,
      modelName: 'Message',
    }
  );
  // Message.beforeCreate((item) => {
  //   return (item.status = 'Send');
  // });
  return Message;
};
