import express from "express";
import {
  deletevideo,
  edit,
  upload,
  see,
} from "../controllers/videoController copy";

const videoRouter = express.Router();

videoRouter.get("/upload", upload);
videoRouter.get("/:id(\\d+)", see);
videoRouter.get("/:id(\\d+)/edit", edit);
videoRouter.get("/:id(\\d+)/delete", deletevideo);

export default videoRouter;
