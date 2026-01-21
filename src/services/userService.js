import { pool } from "../database/mysql.js";

const userCache = new Map();

function cacheKey(guildId, userId) {
  return `${guildId}:${userId}`;
}

export async function loadUser(guildId, userId) {
  const key = cacheKey(guildId, userId);

  const [rows] = await pool.query(
    "SELECT data FROM users WHERE guild_id = ? AND user_id = ?",
    [guildId, userId]
  );

  let data;

  if (!rows.length) {
    data = {};
    await pool.query(
      "INSERT INTO users (guild_id, user_id, data) VALUES (?, ?, ?)",
      [guildId, userId, "{}"]
    );
  } else {
    try {
      data = JSON.parse(rows[0].data);
    } catch {
      data = {};
    }
  }

  const user = { guildId, userId, data };
  userCache.set(key, user);
  return user;
}

export async function getUser(guildId, userId) {
  const key = cacheKey(guildId, userId);
  return userCache.get(key) ?? loadUser(guildId, userId);
}

export async function updateUser(guildId, userId, data) {
  await pool.query(
    "UPDATE users SET data = ? WHERE guild_id = ? AND user_id = ?",
    [JSON.stringify(data), guildId, userId]
  );

  const key = cacheKey(guildId, userId);
  const cached = userCache.get(key);
  if (cached) cached.data = data;
}
