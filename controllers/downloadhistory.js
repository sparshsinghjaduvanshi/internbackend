import User from "../models/Auth.js";
import video from "../models/video.js";

export const getDownloadedVideos = async (req, res) => {

    try {

      const { userId } = req.params;

      const user =
        await User.findById(userId);

      if (!user) {

        return res.status(404).json({
          message: "User not found",
        });
      }

      const downloadedVideos =
        await Promise.all(

          user.downloads.map(
            async (download) => {

              const videoData =
                await video.findById(
                  download.videoId
                );

              return {
                ...download._doc,
                videoid: videoData,
              };
            }
          )
        );

      return res
        .status(200)
        .json(downloadedVideos);

    } catch (error) {

      console.log(error);

      return res.status(500).json({
        message: "Server Error",
      });
    }
  };