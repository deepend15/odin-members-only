import { Router } from "express";
import * as anonClubController from "../controllers/anonClubController.js";

const anonClubRouter = Router();

anonClubRouter.get("/", anonClubController.anonClubGet);

export default anonClubRouter;
