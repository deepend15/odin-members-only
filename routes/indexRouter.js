import { Router } from "express";

const indexRouter = Router();

indexRouter.get("/log-out", (req, res, next) => {
  req.logout((err) => {
    if (err) {
      return next(err);
    }
    res.redirect("/");
  });
});

indexRouter.get("/", (req, res) => {
  res.render("index", {
    title: "AnonTales",
  });
});

export default indexRouter;
