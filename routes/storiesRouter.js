import { Router } from "express";
import * as storiesController from "../controllers/storiesController.js";

const storiesRouter = Router();

storiesRouter.get("/create-story", storiesController.createStoryGet);
storiesRouter.post("/create-story", storiesController.createStoryPost);
storiesRouter.get("/view-story/:storyId/edit", storiesController.editStoryGet);
storiesRouter.post(
  "/view-story/:storyId/edit",
  storiesController.editStoryPost,
);
storiesRouter.get("/view-story/:storyId", storiesController.viewStoryGet);
storiesRouter.get("/", storiesController.storiesGet);

export default storiesRouter;
