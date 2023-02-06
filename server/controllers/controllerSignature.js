const { User, Company, sequelize, Signature } = require('../models/index');
const { createToken, decodedToken } = require('../helpers/jwt');
const cloudinary = require('cloudinary').v2;

cloudinary.config({
  cloud_name: 'dh0pchr2t',
  api_key: '283556788176273',
  api_secret: '4WrYWBFF8qX_1yQKPCf8S7n1yS4',
});

class Controller {
  static async createSignature(req, res, next) {
    try {
      let { access_token } = req.headers;
      let { signatureImage } = req.body;
      let decode = decodedToken(access_token);
      let user = await User.findByPk(decode.id);
      if (!user) {
        throw { name: 'NotFoundUser' };
      }

      const result = await cloudinary.uploader.upload(signatureImage, {
        use_filename: true,
        unique_filename: false,
        overwrite: true,
      });
      console.log(result.url);

      const addToDatabase = await Signature.create({
        signatureImage: result.url,
        UserId: user.id,
      });

      console.log(addToDatabase);

      res.status(201).json({ message: 'Your signature has been saved' });
    } catch (error) {
      next(error);
    }
  }

  static async getSignature(req, res, next) {
    try {
      let { access_token } = req.headers;
      let decode = decodedToken(access_token);
      let user = await User.findByPk(decode.id);
      if (!user) {
        throw { name: 'NotFoundUser' };
      }

      const signature = await Signature.findOne({
        where: {
          UserId: user.id,
        },
      });

      //if null need to add signature

      res.status(200).json({ signature: signature.signatureImage });
    } catch (error) {
      console.log(error);
      next(error);
    }
  }

  static async editSignature() {}

  static async deleteSignature() {}
}

module.exports = Controller;
