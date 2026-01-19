import { statements } from "../database/db.js";

const userCache = new Map();

export function loadUser(guildId, userId) {
  const key = `${guildId}-${userId}`;
  let user = statements.getUser.get(guildId, userId);

  if (!user) {
    statements.insertUser.run(guildId, userId, "{}");
    user = statements.getUser.get(guildId, userId);
  }

  user.data = user.data ? JSON.parse(user.data) : {};
  userCache.set(key, user);
  return user;
}

export function getUser(guildId, userId) {
  const key = `${guildId}-${userId}`;
  return userCache.get(key) || loadUser(guildId, userId);
}

export function updateUser(guildId, userId, data) {
  const json = JSON.stringify(data);
  statements.updateUser.run(json, guildId, userId);

  const key = `${guildId}-${userId}`;
  const cached = userCache.get(key);
  if (cached) cached.data = data;
}

export function autoSaveAll() {
  // Save guilds
  for (const [guildId, guild] of statements.getGuildsCache()) {
    statements.updateGuild.run(JSON.stringify(guild.settings), guildId);
  }

  // Save users
  for (const [key, user] of userCache.entries()) {
    statements.updateUser.run(JSON.stringify(user.data), user.guild_id, user.user_id);
  }
}
