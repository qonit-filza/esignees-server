const crypto = require('crypto');
const fs = require('fs');

const generateKeyPair = () => {
  const { publicKey, privateKey } = crypto.generateKeyPairSync('rsa', {
    modulusLength: 2048,
    publicKeyEncoding: {
      type: 'spki',
      format: 'der',
    },
    privateKeyEncoding: {
      type: 'pkcs8',
      format: 'der',
    },
  });

  publicKeyString = publicKey.toString('base64');
  privateKeyString = privateKey.toString('base64');

  return [privateKeyString, publicKeyString];
};

const verifyPrivateKey = async (privateKeyString, publicKeyString) => {
  try {
    const privateKey = crypto.createPrivateKey({
      key: Buffer.from(privateKeyString, 'base64'),
      type: 'pkcs8',
      format: 'der',
    });

    const pubKeyObject = crypto.createPublicKey({
      key: privateKey,
      format: 'der',
    });

    const publicKey = pubKeyObject.export({
      format: 'der',
      type: 'spki',
    });

    const extractPublicKeyString = publicKey.toString('base64');

    const status = extractPublicKeyString === publicKeyString ? true : false;

    return status;
  } catch (error) {
    return false;
  }
};

const signPdf = (privateKeyString, docPath) => {
  const privateKey = crypto.createPrivateKey({
    key: Buffer.from(privateKeyString, 'base64'),
    type: 'pkcs8',
    format: 'der',
  });
  const sign = crypto.createSign('SHA256');
  const tobeSigned = fs.readFileSync(docPath);
  sign.update(tobeSigned);
  sign.end();

  const signatureString = sign.sign(privateKey).toString('base64');
  return signatureString;
};

const verifyPdf = (signatureString, publicKeyString, docPath) => {
  const pdfBuffer = fs.readFileSync(docPath);

  const publicKey = crypto.createPublicKey({
    key: Buffer.from(publicKeyString, 'base64'),
    type: 'spki',
    format: 'der',
  });

  const verivy = crypto.createVerify('SHA256');
  verivy.update(pdfBuffer);
  verivy.end();

  const status = verivy.verify(
    publicKey,
    Buffer.from(signatureString, 'base64')
  );

  return status;
};

module.exports = {
  generateKeyPair,
  verifyPrivateKey,
  signPdf,
  verifyPdf,
};
