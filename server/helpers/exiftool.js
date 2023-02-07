const exiftool = require('node-exiftool');
const exiftoolBin = require('dist-exiftool');
const ep = new exiftool.ExiftoolProcess(exiftoolBin);

const editMetaTitle = async (filePath, newMetaTitle) => {
  try {
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
    console.log('Closed exif tool');
  } catch (error) {
    console.log(error);
    next(error);
  }
};

const readMetaData = async (filePath) => {
  try {
    await ep.open();
    const metaData = await ep.readMetadata(filePath, ['-File:all']);
    await ep.close();
    console.log('Closed exif tool');

    return metaData.data[0];
  } catch (error) {
    console.log(error);
    next(error);
  }
};

module.exports = { editMetaTitle, readMetaData };
