import * as db from "../db/queries.js";
import { body, validationResult, matchedData } from "express-validator";

const myAccountGet = (req, res) => {
  res.render("account/myAccount", {
    title: "My Account",
  });
};

const editAccountGet = (req, res) => {
  res.render("account/editAccount", {
    title: "Edit Account",
  });
};

const editAccountNameGet = (req, res) => {
  res.render("account/editNameOrUsername", {
    title: "Edit Account > Name/Username",
    firstNameValue: req.user.first_name,
    lastNameValue: req.user.last_name,
    usernameValue: req.user.username,
  });
};

const emptyErr = "cannot be empty.";
const lengthErr = "cannot be more than 255 characters.";

const validateUser = [
  body("firstName").trim()
    .notEmpty().withMessage(`First name ${emptyErr}`)
    .isLength({ max: 255 }).withMessage(`First name ${lengthErr}`),
  body("lastName").trim()
    .notEmpty().withMessage(`Last name ${emptyErr}`)
    .isLength({ max: 255 }).withMessage(`Last name ${lengthErr}`),
  body("username").trim()
    .notEmpty().withMessage(`Username ${emptyErr}`)
    .isLength({ max: 255 }).withMessage(`Username ${lengthErr}`)
    .custom(async (value, { req }) => {
      const dupeUser = await db.getUserByUsername(value);
      if (dupeUser) {
        if (dupeUser.id !== req.user.id) {
          throw new Error();
        }
      }
    }).withMessage("Username already in use. Please choose a different username."),
];

const editAccountNamePost = [
  validateUser,
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).render("account/editNameOrUsername", {
        title: "Edit Account > Name/Username",
        firstNameValue: req.body.firstName,
        lastNameValue: req.body.lastName,
        usernameValue: req.body.username,
        errors: errors.array(),
      });
    }
    const { firstName, lastName, username } = matchedData(req);
    await db.updateUserNameOrUsername(
      firstName,
      lastName,
      username,
      req.user.id,
    );
    res.redirect("/my-account");
  },
];

export { myAccountGet, editAccountGet, editAccountNameGet, editAccountNamePost };
