import * as db from "../db/queries.js";
import { body, validationResult, matchedData } from "express-validator";
import bcrypt from "bcryptjs";

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
    }).withMessage(
      "Username already in use. Please choose a different username.",
    ),
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

const editAccountPasswordGet = (req, res) => {
  let confirmationScreen = false;
  if (req.query.confirm) {
    confirmationScreen = true;
  }
  res.render("account/editPassword", {
    title: "Edit Account > Password",
    confirmationScreen: confirmationScreen,
  });
};

const validatePassword = [
  body("password")
    .notEmpty().withMessage(`Password ${emptyErr}`)
    .isLength({ min: 8 }).withMessage("Password must be at least 8 characters.")
    .isLength({ max: 255 }).withMessage(`Password ${lengthErr}`)
    .custom((value) => {
      const regex = /(?=.*[a-z])/;
      return regex.test(value);
    }).withMessage("Password must contain at least 1 lowercase letter.")
    .custom((value) => {
      const regex = /(?=.*[A-Z])/;
      return regex.test(value);
    }).withMessage("Password must contain at least 1 uppercase letter.")
    .custom((value) => {
      const regex = /(?=.*\d)/;
      return regex.test(value);
    }).withMessage("Password must contain at least 1 number."),
  body("confirmPassword")
    .notEmpty().withMessage(`Password confirmation ${emptyErr}`)
    .custom((value, { req }) => {
      return value === req.body.password;
    }).withMessage("Passwords do not match."),
];

const editAccountPasswordPost = [
  validatePassword,
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).render("account/editPassword", {
        title: "Edit Account > Password",
        passwordValue: req.body.password,
        confirmPasswordValue: req.body.confirmPassword,
        confirmationScreen: false,
        errors: errors.array(),
      });
    }
    const { password } = matchedData(req);
    const hashedPassword = await bcrypt.hash(password, 10);
    await db.updatePassword(hashedPassword, req.user.id);
    res.redirect("/my-account/edit/password?confirm=true");
  },
];

const updateAdminStatusGet = (req, res) => {
  let confirmation = false;
  if (req.query.updatedStatus) {
    confirmation = true;
  }
  res.render("account/changeAdminStatus", {
    title: "Admin Users",
    confirmation: confirmation,
  });
};

const validateAdminPassword = [
  body("password")
    .notEmpty().withMessage("Password is required.")
    .custom((value) => {
      return value === process.env.ADMIN_PW;
    }).withMessage("Incorrect password."),
];

const updateAdminStatusPost = [
  validateAdminPassword,
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).render("account/changeAdminStatus", {
        title: "Admin Users",
        confirmation: false,
        errors: errors.array(),
      });
    }
    await db.addAdminStatus(req.user.id);
    res.redirect("/my-account/admin-status?updatedStatus=true");
  },
];

const deleteAccountGet = (req, res) => {
  res.render("account/deleteAccount", {
    title: "Delete Account",
  });
};

const deleteAccountPost = async (req, res, next) => {
  await db.deleteUser(req.user.id);
  // 'stories' table will automatically cascade and delete all the user's stories without having to run an additional SQL command
  req.logout((err) => {
    if (err) {
      return next(err);
    }
    res.redirect("/log-out?accountDeleted=true");
  });
};

export {
  myAccountGet,
  editAccountGet,
  editAccountNameGet,
  editAccountNamePost,
  editAccountPasswordGet,
  editAccountPasswordPost,
  updateAdminStatusGet,
  updateAdminStatusPost,
  deleteAccountGet,
  deleteAccountPost,
};
