import { Router } from "express";
import * as storiesController from "../controllers/storiesController.js";

const storiesRouter = Router();

storiesRouter.get("/create-story", storiesController.createStoryGet);
storiesRouter.get("/", storiesController.storiesGet);

export default storiesRouter;
