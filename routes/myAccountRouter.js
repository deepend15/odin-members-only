import { Router } from "express";
import * as myAccountController from "../controllers/myAccountController.js";

const myAccountRouter = Router();

myAccountRouter.get(
  "/edit/name-username",
  myAccountController.editAccountNameGet,
);
myAccountRouter.post(
  "/edit/name-username",
  myAccountController.editAccountNamePost,
);
myAccountRouter.get(
  "/edit/password",
  myAccountController.editAccountPasswordGet,
);
myAccountRouter.post(
  "/edit/password",
  myAccountController.editAccountPasswordPost,
);
myAccountRouter.get("/edit", myAccountController.editAccountGet);
myAccountRouter.get("/admin-status", myAccountController.updateAdminStatusGet);
myAccountRouter.post(
  "/admin-status",
  myAccountController.updateAdminStatusPost,
);
myAccountRouter.get("/", myAccountController.myAccountGet);

export default myAccountRouter;
