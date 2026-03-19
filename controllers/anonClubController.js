import * as db from "../db/queries.js";
import { body, validationResult, matchedData } from "express-validator";

const anonClubGet = (req, res) => {
  res.render("anonClub/anonClub", {
    title: "anonClub",
  });
};

export { anonClubGet };
