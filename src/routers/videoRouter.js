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
videoRouter.get("/:id/edit", edit);
videoRouter.get("/:id/delete", deletevideo);

export default videoRouter;
