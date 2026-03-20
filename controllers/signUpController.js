import * as db from "../db/queries.js";
import { body, validationResult, matchedData } from "express-validator";
import bcrypt from "bcryptjs";

const signUpGet = (req, res) => {
  if (req.query.nav) {
    return res.render("signUp/signUpOrLogIn", {
      title: "Sign Up / Log In",
    });
  }
  res.render("signUp/signUp", {
    title: "Sign Up",
    firstNameValue: "",
    lastNameValue: "",
    usernameValue: "",
    passwordValue: "",
    confirmPasswordValue: "",
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
    .custom(async value => {
      const dupeUser = await db.getUserByUsername(value);
      if (dupeUser) {
        throw new Error;
      }
    }).withMessage("Username already in use. Please choose a different username"),
  body("password")
    .notEmpty().withMessage(`Password ${emptyErr}`)
    .isLength({ min: 8 }).withMessage("Password must be at least 8 characters.")
    .isLength({ max: 255 }).withMessage(`Password ${lengthErr}`)
    .custom(value => {
      const regex = /(?=.*[a-z])/;
      return regex.test(value);
    }).withMessage("Password must contain at least 1 lowercase letter.")
    .custom(value => {
      const regex = /(?=.*[A-Z])/;
      return regex.test(value);
    }).withMessage("Password must contain at least 1 uppercase letter.")
    .custom(value => {
      const regex = /(?=.*\d)/;
      return regex.test(value);
    }).withMessage("Password must contain at least 1 number."),
  body("confirmPassword")
    .notEmpty().withMessage(`Password confirmation ${emptyErr}`)
    .custom((value, { req }) => {
      return value === req.body.password;
    }).withMessage("Passwords do not match."),
];

const signUpPost = [
  validateUser,
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).render("signUp/signUp", {
        title: "Sign Up",
        firstNameValue: req.body.firstName,
        lastNameValue: req.body.lastName,
        usernameValue: req.body.username,
        passwordValue: req.body.password,
        confirmPasswordValue: req.body.confirmPassword,
        errors: errors.array(),
      })
    }
    const { firstName, lastName, username, password } = matchedData(req);
    const hashedPassword = await bcrypt.hash(password, 10);
    await db.addUser(firstName, lastName, username, hashedPassword);
    // log in user immediately upon signup
    const user = await db.getUserByUsername(username);
    req.login(user, (err) => {
      if (err) return next(err);
      return res.redirect("/stories");
    })
  },
];

export { signUpGet, signUpPost };
