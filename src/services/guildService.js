import { pool } from "../database/mysql.js";

const guildCache = new Map();

const DEFAULT_SETTINGS = {
  prefix: "!",
  antispam: {
    enabled: true,
    warnBeforePunish: true,
    whitelist: {
      roles: [],
      users: [],
      channels: []
    }
  }
};

export async function loadGuild(guildId) {
  const [rows] = await pool.query(
    "SELECT settings FROM guilds WHERE guild_id = ?",
    [guildId]
  );

  let settings;

  if (!rows.length) {
    settings = structuredClone(DEFAULT_SETTINGS);

    await pool.query(
      "INSERT INTO guilds (guild_id, settings, created_at) VALUES (?, ?, ?)",
      [guildId, JSON.stringify(settings), Date.now()]
    );
  } else {
    settings = JSON.parse(rows[0].settings);
  }

  const guild = { id: guildId, settings };
  guildCache.set(guildId, guild);
  return guild;
}

export async function getGuild(guildId) {
  return guildCache.get(guildId) ?? loadGuild(guildId);
}

export async function updateGuild(guildId, settings) {
  await pool.query(
    "UPDATE guilds SET settings = ? WHERE guild_id = ?",
    [JSON.stringify(settings), guildId]
  );

  const cached = guildCache.get(guildId);
  if (cached) cached.settings = settings;
}
