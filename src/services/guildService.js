import { statements } from "../database/db.js";

const guildCache = new Map();

export function loadGuild(guildId) {
  let guild = statements.getGuild.get(guildId);

  if (!guild) {
    statements.insertGuild.run(guildId, Date.now());
    guild = statements.getGuild.get(guildId);
  }

  guild.settings = guild.settings
    ? JSON.parse(guild.settings)
    : {};

  guildCache.set(guildId, guild);
  return guild;
}

export function getGuild(guildId) {
  return guildCache.get(guildId) || loadGuild(guildId);
}

export function updateGuild(guildId, settings) {
  const json = JSON.stringify(settings);
  statements.updateGuild.run(json, guildId);

  const cached = guildCache.get(guildId);
  if (cached) cached.settings = settings;
}
