// import mongoose from "mongoose";
// const videoSchema = mongoose.Schema(
//   {
//     videotitle: { type: String, required: true },
//     filename: { type: String, required: true },
//     filetype: { type: String, required: true },
//     filename: { type: String, required: true },
//     // filepath: { type: String, required: true },
//     filesize: { type: String, required: true },
//     videochanel: { type: String, required: true },
//     Like: { type: Number, default: 0 },
//     views: { type: Number, default: 0 },
//     uploader: { type: String },
//     videoUrl: String,
//     publicId: String,
//   },
//   {
//     timestamps: true,
//   }
// );

// export default mongoose.models.videofiles || mongoose.model("videofiles", videoSchema);


// // export default mongoose.model("videofiles", videochema);


import mongoose from "mongoose";

const videoSchema = mongoose.Schema(
  {
    videotitle: {
      type: String,
      required: true,
    },

    filename: {
      type: String,
      required: true,
    },

    filetype: {
      type: String,
      required: true,
    },

    filesize: {
      type: String,
      required: true,
    },

    videochanel: {
      type: String,
      required: true,
    },

    Like: {
      type: Number,
      default: 0,
    },

    views: {
      type: Number,
      default: 0,
    },

    uploader: String,

    videoUrl: {
      type: String,
      required: true,
    },

    publicId: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.models.videofiles ||
  mongoose.model("videofiles", videoSchema);