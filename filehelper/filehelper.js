// "use strict";

import multer from "multer";

const storage = multer.memoryStorage();

const filefilter = (req, file, cb) => {

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
    cb(
      new Error(
        "Only MP4, MKV, AVI, MOV and WEBM videos are allowed"
      ),
      false
    );
  }
};

const upload = multer({
  storage: storage,
  fileFilter: filefilter,
  limits: { fileSize: 100 * 1024 * 1024 }, // 100MB
});

export default upload;