const {
  Message,
  Notification,
  User,
  Document,
  sequelize,
  Company,
} = require('../models/index');
const { signPdf, verifyPdf, verifyPrivateKey } = require('../helpers/crypto');
const exiftool = require('node-exiftool');
const exiftoolBin = require('dist-exiftool');
const ep = new exiftool.ExiftoolProcess(exiftoolBin);
const { editMetaTitle } = require('../helpers/exiftool');
const { sendEmailToReceiver, sendEmailToSender } = require('../helpers/nodemailer');

class Controller {
  // SEND MESSAGE
  //previous work
  //   static async sendMessage(req, res, next) {
  //     try {
  //       //   console.log(req.file);
  //       //   console.log(req.body);

  //       const { docName, email, message, status, privateKey } = req.body;

  //       const UserIdSender = req.user.id;
  //       const SenderEmail = req.user.name;

  //       //write metadata
  //       const date = new Date();
  //       const metaTitle = docName + '-' + date.toLocaleString('id-ID');

  //       ep.open()
  //         // read and write metadata operations
  //         .then(() => {
  //           return ep.writeMetadata(
  //             req.file.path,
  //             {
  //               all: '', // remove existing tags
  //               comment: 'Exiftool rules!',
  //               title: metaTitle,
  //             },
  //             ['overwrite_original']
  //           );
  //         })
  //         .then(console.log, console.error)
  //         //
  //         .then(() => ep.close())
  //         .then(() => console.log('Closed exiftool'))
  //         .catch(console.error);

  //       const sender = await User.findOne({
  //         where: {
  //           id: UserIdSender,
  //         },
  //       });

  //       const isValidPrivateKey = await verifyPrivateKey(
  //         privateKey,
  //         sender.publicKey
  //       );

  //       if (!isValidPrivateKey) {
  //         throw { name: 'InvalidPrivateKey' };
  //       }

  //       const receiver = await User.findOne({ where: { email } });
  //       if (!receiver) {
  //         throw { name: 'NotFoundMessage' };
  //       }

  //       const result = await sequelize.transaction(async (t) => {
  //         //
  //         const newMessage = await Message.create(
  //           {
  //             UserIdSender,
  //             UserIdReceiver: receiver.id,
  //             message,
  //             status,
  //           },
  //           { transaction: t }
  //         );

  //         const digitalSignature = signPdf(privateKey, req.file.path);

  //         await Document.create(
  //           {
  //             metaTitle,
  //             documentPath: req.file.path,
  //             digitalSignature,
  //             UserId: UserIdSender,
  //             MessageId: newMessage.id,
  //           },
  //           { transaction: t }
  //         );
  //       });

  //       res
  //         .status(201)
  //         .json({ message: 'Document has been signed and delivered' });
  //     } catch (error) {
  //       next(error);
  //     }
  //   }

  static async sendMessage(req, res, next) {
    try {
      //   console.log(req.file);
      //   console.log(req.body);

      const { docName, email, message, status, privateKey } = req.body;

      const UserIdSender = req.user.id;
      const SenderEmail = req.user.name;

      //write metadata
      const date = new Date();
      const metaTitle = docName + '-' + date.toLocaleString('id-ID');
      await editMetaTitle(req.file.path, metaTitle);

      const sender = await User.findOne({
        where: {
          id: UserIdSender,
        },
      });

      const receiver = await User.findOne({ where: { email } });
      if (!receiver) {
        throw { name: 'NotFoundMessage' };
      }

      if (status === 'completed' || status === 'completed-waiting') {
        console.log('signing document...');
        const isValidPrivateKey = await verifyPrivateKey(
          privateKey,
          sender.publicKey
        );

        if (!isValidPrivateKey) {
          throw { name: 'InvalidPrivateKey' };
        }
      }

      const result = await sequelize.transaction(async (t) => {
        //
        const newMessage = await Message.create(
          {
            UserIdSender,
            UserIdReceiver: receiver.id,
            message,
            status,
          },
          { transaction: t }
        );

        let digitalSignature;
        let responseMessage = 'Document has been delivered';
        if (status === 'completed' || status === 'completed-waiting') {
          const signature = signPdf(privateKey, req.file.path);
          digitalSignature = signature;
          responseMessage = 'Document has been signed and delivered';
        }

        await Document.create(
          {
            documentName: docName,
            metaTitle,
            documentPath: req.file.path,
            digitalSignature,
            UserId: UserIdSender,
            MessageId: newMessage.id,
          },
          { transaction: t }
        );

        return responseMessage;
      });
      sendEmailToReceiver(receiver.email, receiver.name, sender.name)
      res.status(201).json({ message: result });
    } catch (error) {
      next(error);
    }
  }

  //reply and sign
  static async changeMessage(req, res, next) {
    try {
      const { id } = req.params;
      const { docName, email, message, privateKey } = req.body;
      console.log(req.file);
      console.log(req.body);

      const { publicKey } = await User.findOne({
        where: {
          id: req.user.id,
        },
      });
      const findMessage = await Message.findByPk(id)
      const findSender = await User.findByPk(findMessage.UserIdSender)

      const isValidPrivateKey = await verifyPrivateKey(privateKey, publicKey);

      if (!isValidPrivateKey) {
        throw { name: 'InvalidPrivateKey' };
      }

      const date = new Date();
      const metaTitle = docName + '-' + date.toLocaleString('id-ID');
      await editMetaTitle(req.file.path, metaTitle);
      const digitalSignature = signPdf(privateKey, req.file.path);

      const result = await sequelize.transaction(async (t) => {
        await Message.update(
          {
            message,
            status: 'completed',
          },
          {
            where: { id },
          },
          {
            transaction: t,
          }
        );

        await Document.create(
          {
            documentName: docName,
            metaTitle,
            documentPath: req.file.path,
            digitalSignature,
            UserId: req.user.id,
            MessageId: id,
          },
          { transaction: t }
        );
      });
      sendEmailToSender(findSender.email, findSender.name, req.user.username)
      res.status(200).json({ message: 'Document signed' });
    } catch (error) {
      console.log(error);
      next(error);
    }
  }

  static async rejectMessage(req, res, next) {
    try {
      const { id } = req.params;
      const { message } = req.body;
      const findMessage = await Message.findByPk(id)
      const findSender = await User.findByPk(findMessage.UserIdSender)
      await Message.update(
        {
          message,
          status: 'rejected',
        },
        {
          where: { id },
        }
      );
      res.status(200).json({ message: `You've rejected sign request` });
      sendEmailRejected(findSender.email, findSender.name, req.user.username)
    } catch (error) {
      console.log(error);
      next(error);
    }
  }

  //previous
  //   static async sendMessage2(req, res, next) {
  //     try {
  //       let UserIdSender = req.user.id;
  //       let SenderEmail = req.user.name;
  //       let { email, message } = req.body;
  //       let user = await User.findOne({ where: { email } });
  //       if (!user) {
  //         throw { name: 'NotFoundMessage' };
  //       }
  //       let data = await Message.create({
  //         UserIdSender,
  //         UserIdReceiver: user.id,
  //         message,
  //       });
  //       let notification = await Notification.create({
  //         message: `You Have new message from ${SenderEmail}`,
  //         UserId: user.id,
  //       });
  //       res.status(201).json(data);
  //     } catch (error) {
  //       next(error);
  //     }
  //   }

  // SHOW ALL MESSAGE
  static async showAllMessage(req, res, next) {
    try {
      let id = req.user.id;
      let messageReceiver = await Message.findAll({
        where: { UserIdReceiver: id },
        include: [
          {
            model: User,
            as: 'Sender',
            include: {
              model: Company,
            },
          },
          {
            model: Document,
          },
        ],
      });

      let messageSender = await Message.findAll({
        where: { UserIdSender: id },
        include: [
          {
            model: User,
            as: 'Receiver',
            include: {
              model: Company,
            },
          },
          {
            model: Document,
          },
        ],
      });
      let message = { messageReceiver, messageSender };
      res.status(200).json(message);
    } catch (error) {
      next(error);
    }
  }

  // READ MESSAGE
  static async readMessage(req, res, next) {
    try {
      let { id } = req.params;
      let data = await Message.findByPk(id, {
        include: [
          {
            model: Document,
            include: {
              model: User,
            },
          },
          {
            model: User,
            as: 'Receiver',
          },
          {
            model: User,
            as: 'Sender',
          },
        ],
      });
      let UserSender = await User.findByPk(data.UserIdSender, {
        attributes: { exclude: ['password'] },
      });
      // let userReceiver = await User.findByPk(data.UserIdReceiver)
      res.status(200).json({ data, UserSender });
    } catch (error) {
      next(error);
    }
  }

  //   static async changeMessage(req, res, next) {
  //     try {
  //       let { id } = req.params;
  //       let SenderEmail = req.user.name;
  //       let messageUpdate = req.body.message;
  //       let findMessage = await Message.findByPk(id);
  //       if (!findMessage) {
  //         throw { name: 'NotFoundMessage' };
  //       }
  //       await Message.update(
  //         {
  //           message: `${findMessage.message}, ${messageUpdate}`,
  //           status: 'SendBack',
  //         },
  //         { where: { id: findMessage.id } }
  //       );
  //       await Notification.create({
  //         message: `You Have new message from ${SenderEmail}`,
  //         UserId: findMessage.UserIdSender,
  //       });
  //       res.status(201).json({ message: 'success sent message' });
  //     } catch (error) {
  //       next(error);
  //     }
  //   }
}

module.exports = Controller;
