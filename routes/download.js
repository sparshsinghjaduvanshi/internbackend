import express from "express";
import { downloadVideo } from "../controllers/download.js";

const router = express.Router();

router.post("/video/:id", downloadVideo);

export default router;
