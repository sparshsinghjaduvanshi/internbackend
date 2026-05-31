import comment from "../models/comment.js";
import mongoose from "mongoose";
import translate from "translate-google";


export const postcomment = async (req, res) => {
  const { commentbody } = req.body;

  const validCommentRegex =
    /^[a-zA-Z0-9\s.,!?]+$/;

  if (
    !validCommentRegex.test(
      commentbody
    )
  ) {

    return res.status(400)
      .json({
        message:
          "Special characters are not allowed",
      });
  }
  const commentdata = req.body;
  const postcomment =
    new comment(commentdata);
  try {
    const savedComment =
      await postcomment.save();
    res.status(200).json({
      comment: savedComment,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "Something went wrong",
    });
  }
};

export const getallcomment = async (req, res) => {
  const { videoid } = req.params;
  try {
    const commentvideo = await comment.find({ videoid: videoid });
    return res.status(200).json(commentvideo);
  } catch (error) {
    console.error(" error:", error);
    return res.status(500).json({ message: "Something went wrong" });
  }
};
export const deletecomment = async (req, res) => {
  const { id: _id } = req.params;
  if (!mongoose.Types.ObjectId.isValid(_id)) {
    return res.status(404).send("comment unavailable");
  }
  try {
    await comment.findByIdAndDelete(_id);
    return res.status(200).json({ comment: true });
  } catch (error) {
    console.error(" error:", error);
    return res.status(500).json({ message: "Something went wrong" });
  }
};

export const editcomment = async (req, res) => {
  const { id: _id } = req.params;
  const { commentbody } = req.body;
  if (!mongoose.Types.ObjectId.isValid(_id)) {
    return res.status(404).send("comment unavailable");
  }
  try {
    const updatecomment = await comment.findByIdAndUpdate(_id, {
      $set: { commentbody: commentbody },
    });
    res.status(200).json(updatecomment);
  } catch (error) {
    console.error(" error:", error);
    return res.status(500).json({ message: "Something went wrong" });
  }
};

export const likeComment = async (req, res) => {
  try {

    const commentDoc =
      await comment.findById(
        req.params.id
      );

    if (!commentDoc) {

      return res.status(404)
        .json({
          message:
            "Comment not found",
        });
    }

    const { userId } = req.body;

    if (
      commentDoc.likedBy.includes(
        userId
      )
    ) {
      return res.status(400).json({
        message: "Already liked",
      });
    }

    commentDoc.likedBy.push(
      userId
    );
    commentDoc.likes += 1;

    await commentDoc.save();

    return res.status(200)
      .json(commentDoc);

  } catch (error) {

    console.log(error);

    return res.status(500)
      .json({
        message:
          "Something went wrong",
      });
  }
};

export const dislikeComment = async (req, res) => {

  try {

    const commentDoc =
      await comment.findById(
        req.params.id
      );

    if (!commentDoc) {

      return res.status(404)
        .json({
          message:
            "Comment not found",
        });
    }

    const { userId } = req.body;

    if (
      commentDoc.dislikedBy.includes(
        userId
      )
    ) {
      return res.status(400).json({
        message: "Already disliked",
      });
    }

    commentDoc.dislikedBy.push(
      userId
    );
    commentDoc.dislikes += 1;

    if (
      commentDoc.dislikes >= 2
    ) {

      await comment.findByIdAndDelete(
        commentDoc._id
      );

      return res.status(200)
        .json({
          deleted: true,
        });
    }

    await commentDoc.save();

    return res.status(200)
      .json(commentDoc);

  } catch (error) {

    console.log(error);

    return res.status(500)
      .json({
        message:
          "Something went wrong",
      });
  }
};

export const translateComment = async (req, res) => {
  try {

    const { text, targetLanguage } = req.body;

    const translatedText =
      await translate(
        text,
        {
          to: targetLanguage,
        }
      );

    return res.status(200).json({
      translatedText,
    });

  } catch (error) {

    console.log(error);

    return res.status(500).json({
      message: "Translation failed",
    });
  }
};
