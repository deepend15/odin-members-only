import * as db from "../db/queries.js";
import { body, validationResult, matchedData } from "express-validator";

// define validation error messages

// const validateUser = [
//   body functions
// ]

// define async functions for querying db & rendering views

const signUpGet = (req, res) => {
  res.render("signUp", {
    title: "Sign Up",
    firstNameValue: "",
    lastNameValue: "",
    usernameValue: "",
    passwordValue: "",
    confirmPasswordValue: "",
  });
};

export { signUpGet };
