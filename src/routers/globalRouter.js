import express from "express";
import { join, login } from "../controllers/userController";
import { search, trend } from "../controllers/videoController copy";

const globalRouter = express.Router();

globalRouter.get("/", trend);
globalRouter.get("/join", join);
globalRouter.get("/login", login);
globalRouter.get("/search", search);

export default globalRouter;
