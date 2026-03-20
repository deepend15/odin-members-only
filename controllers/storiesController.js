import * as db from "../db/queries.js";
import { body, validationResult, matchedData } from "express-validator";
import { format } from "date-fns";
import { CustomNotFoundError } from "../errors/CustomNotFoundError.js";

const storiesGet = async (req, res) => {
  if (req.query.currentUser) {
    if (req.user) {
      const stories = await db.getStoriesByUserID(req.user.id);
      stories.forEach((story) => {
        story.formattedDate = format(story.time, "MM/dd/yyyy");
      });
      return res.render("stories/stories", {
        title: "My Stories",
        stories: stories,
        currentUserStories: true,
        h2Content: `${req.user.username} - My Stories`,
      });
    }
  }
  const stories = await db.getAllStories();
  stories.forEach((story) => {
    story.formattedDate = format(story.time, "MM/dd/yyyy");
  });
  console.log("Stories: ", stories);
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
    const storyID = await db.addStoryAndReturnStoryID(
      activeUserID,
      title,
      story,
    );
    
    res.redirect(`/stories/view-story/${storyID}`);
  },
];

const viewStoryGet = async (req, res, next) => {
  const { storyId } = req.params;
  const story = await db.getStoryByStoryID(Number(storyId));
  if (!story) {
    return next(new CustomNotFoundError("Page not found."));
  }
  story.formattedTimestamp = format(story.time, 'MMMM d, yyyy, h:mm a');
  console.log(story);
  res.render("stories/viewStory", {
    story: story,
  });
};

const editStoryGet = async (req, res, next) => {
  const { storyId } = req.params;
  const story = await db.getStoryByStoryID(Number(storyId));
  if (!story) {
    return next(new CustomNotFoundError("Page not found."));
  }
  console.log(story);
  res.render("stories/editStory", {
    title: "Edit Story",
    story: story,
  });
}

const editStoryPost = [
  validateStory,
  async (req, res) => {
    const { storyId } = req.params;
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      const story = await db.getStoryByStoryID(Number(storyId));
      return res.status(400).render("stories/editStory", {
        title: "Edit Story",
        story: story,
        submittedTitle: req.body.title,
        submittedStory: req.body.story,
        errors: errors.array(),
      });
    }
    const { title, story } = matchedData(req);
    await db.editStory(title, story, storyId);
    res.redirect(`/stories/view-story/${storyId}`);
  },
];

export { storiesGet, createStoryGet, createStoryPost, viewStoryGet, editStoryGet, editStoryPost };
