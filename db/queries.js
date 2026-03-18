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

async function addStory(userID, title, story) {
  await pool.query(
    "INSERT INTO stories (user_id, title, story, time) VALUES ($1, $2, $3, CURRENT_TIMESTAMP)",
    [userID, title, story],
  );
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
    ORDER BY time`,
  );
  return rows;
}

export { getUserByUsername, getUserByID, addUser, addStory, getAllStories };
