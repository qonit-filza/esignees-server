const { comparePassword, hashPassword } = require('../helpers/bcrypt');
const { createToken } = require('../helpers/jwt');
const { Admin, User, Company } = require('../models');
const { Op } = require('sequelize');
const { generateKeyPair } = require('../helpers/crypto');
const { sendEmail } = require("../helpers/nodemailer");

class AdminController {
  static async adminLogin(req, res, next) {
    try {
      let { email, password } = req.body;
      if (!email || !password) {
        throw { name: 'BadRequest' };
      }
      let admin = await Admin.findOne({ where: { email } });
      if (!admin) {
        throw { name: 'InvalidCredentials' };
      }

      let compared = comparePassword(password, admin.password);
      if (!compared) {
        throw { name: 'InvalidCredentials' };
      }

      let payload = {
        id: admin.id,
        email,
      };

      let access_token = createToken(payload);
      res.status(200).json({ access_token, email: admin.email });
    } catch (error) {
      console.log(error);
      next(error);
    }
  }

  static async adminRegister(req, res, next) {
    try {
      let { name, email, phone, password } = req.body;
      console.log(req.body);
      let admin = await Admin.create({
        name,
        email,
        phone,
        password: hashPassword(password),
      });
      res.status(201).json({
        id: admin.id,
        name: admin.name,
        email: admin.email,
      });
    } catch (error) {
      next(error);
    }
  }

  static async fetchUser(req, res, next) {
    try {
      let { search } = req.query;
      const paramQuerySQL = {
        include: {
          model: Company,
          as: 'Company',
          attributes: {
            exclude: ['createdAt', 'updatedAt'],
          },
        },
        order: [['createdAt', 'DESC']],
      };

      if (search) {
        paramQuerySQL.where = {
          name: { [Op.iLike]: `%${search}%` },
        };
      }

      let user = await User.findAll(paramQuerySQL);
      console.log(user.length);
      if(user.length === 0) {
        throw {name: "NotFoundUser"}
      }
        res.status(200).json(user);

    } catch (error) {
      next(error);
    }
  }

  static async userDetail(req, res, next) {
    try {
      let { id } = req.params;
      let user = await User.findByPk(id, {
        include: ['Company'],
      });
      res.status(200).json(user);
    } catch (error) {
      next(error);
    }
  }

  static async patchStatus(req, res, next) {
    try {
      let { id } = req.params;
      let { status } = req.body;

      let data = await User.findByPk(id);
      const [privateKey, publicKey] = generateKeyPair();

      await User.update(
        { status: 'Verified', publicKey },
        {
          where: { id },
        }
      );

      sendEmail(data.email, data.name, privateKey)
      res.status(201).json({
        message: `success update status ${data.name} from ${data.status} to verified`,
      });
    } catch (error) {
      next(error);
    }
  }

  static async deleteUser(req, res, next) {
    try {
      let { id } = req.params;
      let data = await User.findByPk(id);

      if (!data) {
        throw { name: 'NotFound' };
      }

      await User.destroy({
        where: { id },
      });

      res.status(200).json({
        message: `${data.name} success to delete`,
      });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = AdminController;
