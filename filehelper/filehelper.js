// "use strict";

import multer from "multer";

const storage = multer.diskStorage({

  destination: (req, res, cb) => {
    cb(null, "uploads");
  },

  filename: (req, file, cb) => {
    cb(
      null,
      new Date()
        .toISOString()
        .replace(/:/g, "-")
      + "-" +
      file.originalname
    );
  },
});

const filefilter = ( req, file, cb) => {

  const allowedTypes = [
    "video/mp4",
    "video/x-matroska",
    "video/matroska",
    "video/x-msvideo",
    "video/quicktime",
    "video/webm",
  ];
  console.log(file.mimetype);
  if (
    allowedTypes.includes(
      file.mimetype
    )
  ) {
    cb(null, true);
  } else {
    cb(null, false);
  }
};

const upload = multer({
  storage: storage,
  fileFilter: filefilter,
  limits: { fileSize: 5 * 1024 * 1024 * 1024, },
});

export default upload;