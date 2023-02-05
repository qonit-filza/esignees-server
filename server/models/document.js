'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Document extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Document.belongsTo(models.User);
      Document.belongsTo(models.Message);
    }
  }
  Document.init(
    {
      metaTitle: DataTypes.STRING,
      documentPath: DataTypes.STRING,
      digitalSignature: DataTypes.TEXT,
      MessageId: DataTypes.INTEGER,
      UserId: DataTypes.INTEGER,
    },
    {
      sequelize,
      modelName: 'Document',
    }
  );
  return Document;
};
