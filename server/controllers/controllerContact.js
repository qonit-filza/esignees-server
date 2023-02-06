const { User, Contact } = require("../models/index");

class Controller {
  // CREATE CONTACT
  static async createContact(req, res, next) {
    try {
      let UserIdOwner = req.user.id;
      let { email } = req.body;
      let userFriend = await User.findOne({ where: { email } });
      if (!userFriend) {
        throw { name: "NotFoundUser" };
      }
      let UserIdContact = userFriend.id;
      let data = await Contact.create({
        UserIdOwner,
        UserIdContact,
      });
      res.status(201).json(data);
    } catch (error) {
      next(error);
    }
  }

  // SHOW ALL CONTACT
  static async showAllContact(req, res, next) {
    try {
      let { id } = req.user;
      let contact = await Contact.findAll({ where: { UserIdOwner: id } });
      // if (!contact.length) {
      //   let data = await Contact.findAll({ where: { UserIdContact: id }});
      //   return res.status(200).json(data)
      // }
      res.status(200).json(contact);
    } catch (error) {
      next(error);
    }
  }

  // Contact Detail
  static async contactDetail(req, res, next) {
    try {
      let { id } = req.params;
      let userId = req.user.id;
      let find = await Contact.findByPk(id);
      if (!find) {
        throw { name: "NotFoundContact" };
      }
      let user = await User.findByPk(find.UserIdContact);
      if (user.id == userId) {
        let data = await User.findByPk(find.UserIdOwner);
        return res.status(200).json(data);
      }
      res.status(200).json(user);
    } catch (error) {
      next(error);
    }
  }

  // DELETE CONTACT
  static async deleteContact(req, res, next) {
    try {
      let { id } = req.params;
      let find = await Contact.findByPk(id);
      if (!find) {
        throw { name: "NotFoundContact" };
      }
      await Contact.destroy({ where: { id } });
      res.status(201).json({ message: "success delete contact" });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = Controller;
