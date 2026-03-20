import { Router } from "express";

const logoutRouter = Router();

logoutRouter.get("/", (req, res, next) => {
  if (req.query.success) {
    return res.render("logout");
  }
  if (req.query.accountDeleted) {
    return res.render("logout", {
      accountDeleted: true,
    });
  }
  req.logout((err) => {
    if (err) {
      return next(err);
    }
    res.redirect("/log-out?success=true");
  });
});

export default logoutRouter;
