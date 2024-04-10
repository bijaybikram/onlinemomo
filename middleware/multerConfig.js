const multer = require("multer");

const storage = multer.diskStorage({
  // logic to validate the filetype(mimetype)

  destination: function (req, file, cb) {
    const allowedFileTypes = ["image/jpg", "image/jpeg", "image/png"];
    if (!allowedFileTypes.includes(file.mimetype)) {
      cb(new Error("File type not supported!"));
      return;
    }
    // console.log(file.mimetype);
    cb(null, "./uploads/"); // cb(error, success)
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

module.exports = { multer, storage };
