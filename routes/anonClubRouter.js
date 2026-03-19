import { Router } from "express";
import * as anonClubController from "../controllers/anonClubController.js";

const anonClubRouter = Router();

anonClubRouter.get("/joined", anonClubController.anonClubJoinedGet);
anonClubRouter.get("/", anonClubController.anonClubGet);
anonClubRouter.post("/", anonClubController.anonClubPost);

export default anonClubRouter;
