import * as db from "../db/queries.js";
import { body, validationResult, matchedData } from "express-validator";

const storiesGet = async (req, res) => {
  if (req.query.currentUser) {
    if (req.user) {
      const stories = await db.getStoriesByUserID(req.user.id);
      return res.render("stories/stories", {
        title: "Story Depository",
        stories: stories,
        currentUserStories: true,
        h2Content: `${req.user.username} - My Stories`,
      });
    }
  }
  const stories = await db.getAllStories();
  console.log("Stories: ", stories);
  console.log(stories[0].time);
  let h2Content;
  if (req.user) h2Content = `👋 Hello, ${req.user.username}!`;
  res.render("stories/stories", {
    title: "Story Depository",
    stories: stories,
    h2Content: h2Content,
  });
};

const createStoryGet = (req, res) => {
  res.render("stories/createStory", {
    title: "Create Story",
  });
};

const emptyErr = "cannot be empty.";

const validateStory = [
  body("title").trim()
    .notEmpty().withMessage(`Title ${emptyErr}`)
    .isLength({ max: 75 }).withMessage("Title cannot be more than 75 characters."),
  body("story")
    .notEmpty().withMessage(`Story ${emptyErr}`),
];

const createStoryPost = [
  validateStory,
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).render("stories/createStory", {
        title: "Create Story",
        titleValue: req.body.title,
        storyText: req.body.story,
        errors: errors.array(),
      });
    }
    const { title, story } = matchedData(req);
    const activeUserID = req.user.id;
    await db.addStory(activeUserID, title, story);
    console.log(
      `Added: user ID ${activeUserID}, title: ${title}, story: ${story}`,
    );
    res.redirect("/stories");
  },
];

// TODO NEXT:
// --Change res.redirect logic in createStoryPost (& remove console.log)

export { storiesGet, createStoryGet, createStoryPost };
