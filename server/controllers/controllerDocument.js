const {
  Message,
  Notification,
  User,
  Document,
  sequelize,
  Company,
} = require('../models/index');
const { readMetaData } = require('../helpers/exiftool');
const { verifyPdf } = require('../helpers/crypto');

class Controller {
  static async getDocumentById(req, res, next) {
    try {
      const { id } = req.params;

      const data = await Document.findByPk(id);
      if (!data) {
        throw { name: 'NotFoundMessage' };
      }

      res.download(`./${data.documentPath}`);
    } catch (error) {
      console.log(error);
      next(error);
    }
  }

  static async verifyDocument(req, res, next) {
    try {
      const { Title } = await readMetaData(req.file.path);

      if (!Title) {
        throw { name: 'InvalidDocumentOrSignature' };
      }

      const document = await Document.findOne({
        where: {
          metaTitle: Title,
        },
        include: [
          {
            model: User,
          },
          { model: Message, include: Document },
        ],
      });

      if (!document) {
        throw { name: 'InvalidDocumentOrSignature' };
      }

      const docMessage = await Message.findByPk(document.MessageId, {
        include: {
          model: Document,
          include: {
            model: User,
          },
        },
      });

      let type;
      if (
        docMessage.Documents.length > 1 &&
        docMessage.Documents[0].digitalSignature !== null &&
        docMessage.Documents[1].metaTitle === Title
      ) {
        type = 'signWithOther';
      } else {
        type = 'nonSignWithOther';
      }
      let message;

      if (type === 'signWithOther') {
        const tempSignInfo = [];

        const statusPdf1 = verifyPdf(
          document.digitalSignature,
          document.User.publicKey,
          req.file.path
        );
        if (!statusPdf1) {
          throw { name: 'InvalidDocumentOrSignature' };
        }
        tempSignInfo.push({
          name: document.User.name,
          email: document.User.email,
          createdAt: document.createdAt,
        });

        const statusPdf2 = verifyPdf(
          docMessage.Documents[0].digitalSignature,
          docMessage.Documents[0].User.publicKey,
          docMessage.Documents[0].documentPath
        );
        if (!statusPdf2) {
          throw { name: 'InvalidDocumentOrSignature' };
        }
        tempSignInfo.push({
          name: docMessage.Documents[0].User.name,
          email: docMessage.Documents[0].User.email,
          createdAt: docMessage.Documents[0].createdAt,
        });

        message = tempSignInfo.map((el) => {
          return {
            signedBy: el.name,
            signedByEmail: el.email,
            signedDate: el.createdAt,
          };
        });
      } else {
        const status = verifyPdf(
          document.digitalSignature,
          document.User.publicKey,
          req.file.path
        );
        if (!status) {
          throw { name: 'InvalidDocumentOrSignature' };
        }

        message = [
          {
            signedBy: document.User.name,
            signedByEmail: document.User.email,
            signedDate: document.createdAt,
          },
        ];
      }

      res.status(201).json({ status: 'Verified', detail: message });
    } catch (error) {
      console.log(error);
      next(error);
    }
  }
}

module.exports = Controller;
