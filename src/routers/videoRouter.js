import express from "express";
import {
  getEdit,
  postEdit,
  watch,
  getUpload,
  postUpload,
} from "../controllers/videoController";

const videoRouter = express.Router();

videoRouter.get("/:id([0-9a-f]{24})", watch);
videoRouter.route("/:id([0-9a-f]{24})/edit").get(getEdit).post(postEdit);
videoRouter.route("/upload").get(getUpload).post(postUpload);
//videoRouter.get("/:id(\\d+)/edit", getEdit); 위의 코드와 동일 route를 이용
//videoRouter.post("/:id(\\d+)/edit", postEdit); 하나의 URL에 get,post 둘다 이용할때 유용

export default videoRouter;
