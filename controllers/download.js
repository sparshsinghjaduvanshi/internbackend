import User from "../models/Auth.js";
import Video from "../models/video.js";

export const downloadVideo = async (req, res) => {
  await connectDB();
  try {

        const { userId } = req.body;

        const { id } = req.params;

        // Find user
        const user = await User.findById(userId);

        // Find video
        const video = await Video.findById(id);

        if (!user || !video) {
            return res.status(404).json({
                message: "User or Video not found",
            });
        }

        // Premium users => unlimited downloads
        if (user.plan === "free") {

            const today = new Date();

            today.setHours(0, 0, 0, 0);

            // Count today's downloads
            const todaysDownloads =
                user.downloads.filter((download) => {

                    const downloadDate =
                        new Date(download.downloadedAt);

                    downloadDate.setHours(0, 0, 0, 0);

                    return (
                        downloadDate.getTime() ===
                        today.getTime()
                    );
                });

            // Free user limit
            if (todaysDownloads.length >= 1) {

                return res.status(403).json({
                    success: false,
                    message:
                        "Daily download limit reached. Upgrade to premium for unlimited downloads.",
                });
            }
        }

        // Save download history
        user.downloads.push({
            videoId: id,
            downloadedAt: new Date(),
        });

        await user.save();

        return res.status(200).json({
            success: true,
            message: "Download allowed",
            videoUrl: video.videoLink,
        });

    } catch (error) {

        console.error(error);

        return res.status(500).json({
            success: false,
            message: "Server Error",
        });
    }


};
