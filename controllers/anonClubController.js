import * as db from "../db/queries.js";
import { body, validationResult } from "express-validator";

const anonClubGet = (req, res) => {
  res.render("anonClub/anonClub", {
    title: "anonClub",
  });
};

const validatePassword = [
  body("password")
    .notEmpty().withMessage("Password is required.")
    .custom((value) => {
      return value === process.env.ANON_CLUB_PW;
    }).withMessage("Incorrect password."),
];

const anonClubPost = [
  validatePassword,
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).render("anonClub/anonClub", {
        title: "anonClub",
        errors: errors.array(),
      });
    }
    const currentUserID = req.user.id;
    await db.addMembershipStatus(currentUserID);
    res.redirect("/anonClub/joined");
  },
];

const anonClubJoinedGet = (req, res) => {
  res.render("anonClub/anonClubJoinSuccess", {
    title: "anonClub",
  });
};

export { anonClubGet, anonClubPost, anonClubJoinedGet };
