import video from "../models/video.js";
import connectDB from "../utils/connectDB.js";
import cloudinary from "../utils/cloudinary.js";
import streamifier from "streamifier";

export const uploadvideo = async (req, res) => {
  await connectDB();

  try {
    if (!req.file) {
      return res.status(400).json({
        message: "Please upload a video",
      });
    }

    const result = await new Promise((resolve, reject) => {
      const stream = cloudinary.uploader.upload_stream(
        {
          resource_type: "video",
          folder: "yourtube",
        },
        (error, result) => {
          if (error) reject(error);
          else resolve(result);
        }
      );

      streamifier
        .createReadStream(req.file.buffer)
        .pipe(stream);
    });

    const file = new video({
      videotitle: req.body.videotitle,

      filename: req.file.originalname,
      filetype: req.file.mimetype,
      filesize: req.file.size,

      videochanel: req.body.videochanel,
      uploader: req.body.uploader,

      videoUrl: result.secure_url,
      publicId: result.public_id,
    });

    await file.save();

    return res.status(201).json(file);

  } catch (error) {
    console.error(error);

    return res.status(500).json({
      message: "Upload failed",
    });
  }
};
// export const getallvideo = async (req, res) => {
//   try {
//     const files = await video.find();
//     return res.status(200).send(files);
//   } catch (error) {
//     console.error(" error:", error);
//     return res.status(500).json({ message: "Something went wrong" });
//   }
// };

export const getallvideo = async (req, res) => {
  await connectDB(); // ← add this line
  try {
    const files = await video.find();
    return res.status(200).send(files);
  } catch (error) {
    return res.status(500).json({ message: "Something went wrong" });
  }
};