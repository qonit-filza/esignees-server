const {
  Message,
  Notification,
  User,
  Document,
  sequelize,
  Company,
} = require("../models/index");

class Controller {
  static async getDocumentById(req, res, next) {
    try {
      const { id } = req.params;

      const data = await Document.findByPk(id);
      if (!data) {
        throw { name: "NotFoundMessage" };
      }

      res.download(`./${data.documentPath}`);
    } catch (error) {
      console.log(error);
      next(error);
    }
  }
}

module.exports = Controller;
