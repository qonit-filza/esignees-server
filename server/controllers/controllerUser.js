const { User, Company, sequelize } = require('../models/index');
const { createToken, decodedToken } = require('../helpers/jwt');
const { comparePassword, hashPassword } = require('../helpers/bcrypt');

class Controller {
  // REGISTER COMPANY AND USER OR USER ONLY
  static async registerCompany(req, res, next) {
    try {
      const {
        nameCompany,
        legalName,
        address,
        phoneCompany,
        emailCompany,
        industry,
        companySize,
        companyInviteCode,
        name,
        email,
        phone,
        password,
        jobTitle,
        ktpId,
        ktpImage,
      } = req.body;

      if (!companyInviteCode) {
        let result = await sequelize.transaction(async (t) => {
          let data = await Company.create(
            {
              nameCompany,
              legalName,
              address,
              phoneCompany,
              emailCompany,
              industry,
              companySize,
            },
            { transaction: t }
          );
          let userCompany = await User.create(
            {
              name,
              role: 'admin',
              email,
              phone,
              password,
              jobTitle,
              ktpId,
              ktpImage,
              CompanyId: data.id,
            },
            { transaction: t }
          );
        });
        return res.status(201).json({
          message:
            'Dear, Your company and account is in verification process. log-in after we send notification in your email',
        });
      }
      let findCompany = await Company.findOne({ where: { companyInviteCode } });
      if (!findCompany) {
        throw { name: 'NotFoundCompany' };
      }
      let user = await User.create({
        name,
        role: 'staff',
        email,
        phone,
        password,
        jobTitle,
        ktpId,
        ktpImage,
        CompanyId: findCompany.id,
      });
      return res.status(201).json({
        message:
          'Dear, ' +
          user.name +
          '. Your account is in verification process. log-in after we send notification in your email',
      });
    } catch (error) {
      next(error);
    }
  }

  // LOGIN USER
  static async login(req, res, next) {
    try {
      let { email, password } = req.body;
      if (!email || !password) {
        throw { name: 'BadRequest' };
      }

      let user = await User.findOne({ where: { email } });
      if (!user) {
        throw { name: 'InvalidCredentials' };
      }
      // if (user.status === "Unverified") {
      //   throw { name: "OnProcess" };
      // }

      let compare = comparePassword(password, user.password);
      if (!compare) {
        throw { name: 'InvalidCredentials' };
      }
      let payload = {
        id: user.id,
      };

      let access_token = createToken(payload);
      res
        .status(200)
        .json({ access_token, email: user.email, role: user.role });
    } catch (error) {
      next(error);
    }
  }

  // PROFILE DETAIL
  static async profileDetail(req, res, next) {
    try {
      let { access_token } = req.headers;
      let decode = decodedToken(access_token);
      let user = await User.findByPk(decode.id);
      res.status(200).json({
        name: user.name,
        email: user.email,
        phone: user.phone,
        jobTitle: user.jobTitle,
      });
    } catch (error) {
      next(error);
    }
  }

  // EDIT PROFILE
  static async editProfile(req, res, next) {
    try {
      let { access_token } = req.headers;
      let { name, email, password, phone, jobTitle } = req.body;
      let decode = decodedToken(access_token);
      let user = await User.findByPk(decode.id);
      if (!user) {
        throw { name: 'NotFoundUser' };
      }
      let edit = await User.update(
        {
          name,
          email,
          password: hashPassword(password),
          phone,
          jobTitle,
        },
        { where: { id: user.id } }
      );
      res
        .status(201)
        .json({ message: 'success edit your account ' + user.name });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = Controller;
