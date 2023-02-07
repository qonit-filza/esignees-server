const { Message, Notification, User } = require("../models/index");

class Controller {
  // SHOW ALL MY NOTIFICATION
  static async showAllNotification(req, res, next) {
    try {
      let { id } = req.user;
      let data = await Notification.findAll({ where: { UserId: id } });
      res.status(200).json(data);
    } catch (error) {
      next(error);
    }
  }

  // SHOW DETAIL NOTIFICATION
  static async detailNotification(req, res, next) {
    try {
      let { id } = req.params;
      let data = await Notification.findByPk(id);
      res.status(200).json(data);
    } catch (error) {
      next(error);
    }
  }

  // EDIT STATUS READ NOTIFICATION
  static async editStatusRead(req, res, next) {
    try {
      let { id } = req.params;
      let data = await Notification.update(
        {
          status: "Read",
        },
        { where: { id } }
      );
      res.status(201).json({ message: "Inbox was read" });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = Controller;
