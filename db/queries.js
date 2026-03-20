import pool from "./pool.js";

async function getUserByUsername(username) {
  const { rows } = await pool.query("SELECT * FROM users WHERE username = $1", [
    username,
  ]);
  return rows[0];
}

async function getUserByID(id) {
  const { rows } = await pool.query("SELECT * FROM users WHERE id = $1", [id]);
  return rows;
}

async function addUser(firstName, lastName, username, password) {
  await pool.query(
    "INSERT INTO users (first_name, last_name, username, password) VALUES ($1, $2, $3, $4)",
    [firstName, lastName, username, password],
  );
}

async function addStoryAndReturnStoryID(userID, title, story) {
  await pool.query(
    "INSERT INTO stories (user_id, title, story, time) VALUES ($1, $2, $3, CURRENT_TIMESTAMP)",
    [userID, title, story],
  );
  const { rows } = await pool.query(
    "SELECT id FROM stories WHERE user_id = $1 ORDER BY time DESC LIMIT 1",
    [userID],
  );
  return rows[0].id;
}

async function getAllStories() {
  const { rows } = await pool.query(
    `SELECT
      stories.id AS story_id,
      users.username,
      stories.title,
      stories.story,
      stories.time
    FROM stories
    INNER JOIN users ON users.id = stories.user_id
    ORDER BY time DESC`,
  );
  return rows;
}

async function getStoriesByUserID(id) {
  const { rows } = await pool.query(
    `SELECT
      stories.id AS story_id,
      users.username,
      stories.title,
      stories.story,
      stories.time
    FROM stories
    INNER JOIN users ON users.id = stories.user_id
    WHERE stories.user_id = $1
    ORDER BY time DESC`,
    [id],
  );
  return rows;
}

async function getStoryByStoryID(id) {
  const { rows } = await pool.query(
    `SELECT
      stories.id AS story_id,
      users.username,
      stories.title,
      stories.story,
      stories.time
    FROM stories
    INNER JOIN users ON users.id = stories.user_id
    WHERE stories.id = $1`,
    [id],
  );
  return rows[0];
}

async function addMembershipStatus(userID) {
  await pool.query("UPDATE users SET member = TRUE WHERE id = $1", [userID]);
}

async function updateUserNameOrUsername(firstName, lastName, username, userID) {
  await pool.query(
    "UPDATE users SET first_name = $1, last_name = $2, username = $3 WHERE id = $4",
    [firstName, lastName, username, userID],
  );
}

export {
  getUserByUsername,
  getUserByID,
  addUser,
  addStoryAndReturnStoryID,
  getAllStories,
  getStoriesByUserID,
  getStoryByStoryID,
  addMembershipStatus,
  updateUserNameOrUsername,
};
