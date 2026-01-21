import { getGuild, updateGuild } from "../../services/guildService.js";

export function toggleAntiSpam(guildId) {
  const guild = getGuild(guildId);

  guild.settings.antispam ??= {};
  guild.settings.antispam.enabled = !guild.settings.antispam.enabled;

  updateGuild(guildId, guild.settings);

  return guild.settings.antispam.enabled;
}
