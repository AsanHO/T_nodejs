import express from "express";
import { join, login } from "../controllers/userController";
import { trend } from "../controllers/videoController";

const globalRouter = express.Router();

globalRouter.get("/", trend);
globalRouter.get("/join", join);
globalRouter.get("/login", login);

export default globalRouter;
