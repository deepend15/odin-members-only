import { Router } from "express";
import passport from "passport";

const loginRouter = Router();

loginRouter.get("/", (req, res) => {
  let usernameValue = "";
  let passwordValue = "";
  let errorMessage;
  if (req.session.loginError) {
    errorMessage = req.session.loginError;
    usernameValue = req.session.username;
    passwordValue = req.session.password;
  }
  res.render("login", {
    title: "Log In",
    usernameValue: usernameValue,
    passwordValue: passwordValue,
    errorMessage: errorMessage,
  });
  delete req.session.loginError;
  delete req.session.username;
  delete req.session.password;
});

loginRouter.post("/", (req, res, next) => {
  // passport.authenticate() func below is more verbose to allow for more control, such as setting the req.session variables
  // see callback info here: https://github.com/jwalton/passport-api-docs?tab=readme-ov-file#passportauthenticatestrategyname-options-callback
  passport.authenticate("local", (err, user, info) => {
    if (err) {
      return next(err);
    }
    if (!user) {
      req.session.loginError = info.message;
      req.session.username = req.body.username;
      req.session.password = req.body.password;
      return res.redirect("/log-in");
    }
    req.login(user, function (err) {
      if (err) {
        return next(err);
      }
      return res.redirect("/stories");
    });
  })(req, res, next);
});

export default loginRouter;
