const exiftool = require('node-exiftool');
const exiftoolBin = require('dist-exiftool');
const ep = new exiftool.ExiftoolProcess(exiftoolBin);

const editMetaTitle = async (docName, filePath) => {
  try {
    const date = new Date();
    const newMetaTitle =
      ' cobaterakhir' + docName + '-' + date.toLocaleString('id-ID');

    await ep.open();
    const write = await ep.writeMetadata(
      filePath,
      {
        all: '', // remove existing tags
        comment: 'Exiftool rules!',
        title: newMetaTitle,
      },
      ['overwrite_original']
    );

    console.log(write);
    await ep.close();
    console.log('Closing exif tool');
  } catch (error) {
    console.log(error);
  }
};

module.exports = editMetaTitle;
