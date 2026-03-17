import * as db from "../db/queries.js";
import { body, validationResult, matchedData } from "express-validator";

const storiesGet = (req, res) => {
  res.render("stories/stories", {
    title: "Story Depository",
  });
};

export { storiesGet };
