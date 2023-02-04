'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Signature extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Signature.belongsTo(models.User);
    }
  }
  Signature.init(
    {
      signatureImage: DataTypes.STRING,
      UserId: DataTypes.INTEGER,
    },
    {
      sequelize,
      modelName: 'Signature',
    }
  );
  return Signature;
};
