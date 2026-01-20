import { statements } from "../database/db.js";

const guildCache = new Map();

export function loadGuild(guildId) {
  let guild = statements.getGuild.get(guildId);

  if (!guild) {
    statements.insertGuild.run(guildId, Date.now());
    guild = statements.getGuild.get(guildId);
  }

  guild.settings = guild.settings ? JSON.parse(guild.settings) : {};
  guildCache.set(guildId, guild);
  return guild;
}

export function getGuild(guildId) {
  return guildCache.get(guildId) || loadGuild(guildId);
}

export function updateGuild(guildId, newSettings) {
  const guild = getGuild(guildId);

  // 🔥 MERGE, don't overwrite
  const mergedSettings = {
    ...guild.settings,
    ...newSettings
  };

  statements.updateGuild.run(JSON.stringify(mergedSettings), guildId);

  guild.settings = mergedSettings;
  guildCache.set(guildId, guild);
}
