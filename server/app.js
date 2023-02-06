if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}
const cloudinary = require("cloudinary").v2;
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const multer = require("multer");

cloudinary.config({
  cloud_name: "dcbdbvpoj",
  api_key: "888229724611886",
  api_secret: "mjjZOvlGYDF_WuW6QTbwctERLWY",
});

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: "testMulter",
  },
});
const upload = multer({ storage: storage });

const express = require("express");
const app = express();
const port = process.env.PORT || 3000;
const cors = require("cors");
const router = require("./routers");
const { errorHandler } = require("./middlewares/errorHandler");
// const storage = multer.diskStorage({
//     destination: (req, file, cb) => {
//       cb(null, './uploads/');
//     },
//     filename: (req, file, cb) => {
//       cb(null, file.originalname + '-' + Date.now() + '.jpg');
//     },
//   });
//   const upload = multer({ storage: storage });

app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(router);
app.use(errorHandler);

// app.listen(port, () => {
//   console.log(`Esigness app listening on port ${port}`);
// })

module.exports = app;

// , upload.single("ktpImage")
