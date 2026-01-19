import { getGuild, updateGuild } from "./guildService.js";

export function getConfig(guildId, key, defaultValue = null) {
  const guild = getGuild(guildId);
  return guild.settings[key] ?? defaultValue;
}

export function setConfig(guildId, key, value) {
  const guild = getGuild(guildId);
  guild.settings[key] = value;
  updateGuild(guildId, guild.settings);
}
