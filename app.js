import express from "express";
import path from "node:path";
import session from "express-session";
import connectPgSimple from "connect-pg-simple";
import passport from "passport";
import pool from "./db/pool.js";
import signUpRouter from "./routes/signUpRouter.js";
import loginRouter from "./routes/loginRouter.js";
import logoutRouter from "./routes/logoutRouter.js";
import storiesRouter from "./routes/storiesRouter.js";
import anonClubRouter from "./routes/anonClubRouter.js";
import myAccountRouter from "./routes/myAccountRouter.js";
import indexRouter from "./routes/indexRouter.js";
import { CustomNotFoundError } from "./errors/CustomNotFoundError.js";

const app = express();

const __dirname = import.meta.dirname;

app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

const assetsPath = path.join(__dirname, "public");
app.use(express.static(assetsPath));

app.use(express.urlencoded({ extended: true }));

const PGSession = connectPgSimple(session);
app.use(
  session({
    store: new PGSession({
      pool: pool,
    }),
    secret: process.env.SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
      maxAge: 1000 * 60 * 60 * 24,
    },
  }),
);

import "./passportConfig.js";

app.use(passport.session());

app.use((req, res, next) => {
  console.log("Session:", req.session);
  console.log(`Session ID: ${req.session.id}`);
  console.log("User:", req.user);
  res.locals.currentUser = req.user;
  next();
});

// prevent 404 errors from missing favicon; remove if favicon is added
app.get("/favicon.ico", (req, res) => {
  res.status(204).end();
});

app.use("/sign-up", signUpRouter);
app.use("/log-in", loginRouter);
app.use("/log-out", logoutRouter);
app.use("/stories", storiesRouter);
app.use("/anonclub", anonClubRouter);
app.use("/my-account", myAccountRouter);
app.use("/", indexRouter);

// 404 error
app.use((req, res, next) => {
  next(new CustomNotFoundError("Page not found."));
});

// error handler
app.use((err, req, res, next) => {
  console.log("Request URL:", req.url);
  console.error(err);
  if (err.statusCode) {
    res.status(err.statusCode).render("404error");
  } else {
    res.status(500).send("Internal Server Error");
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, (error) => {
  if (error) throw error;
  console.log(`Listening on port ${PORT}!`);
});
