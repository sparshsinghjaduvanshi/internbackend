import express from "express";

import {
  getDownloadedVideos,
} from "../controllers/downloadhistory.js";

const router = express.Router();

router.get("/:userId", getDownloadedVideos);

export default router;