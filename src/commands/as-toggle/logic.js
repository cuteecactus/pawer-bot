import { getGuild, updateGuild } from "../../services/guildService.js";

export async function toggleAntiSpam(guildId) {
  const guild = await getGuild(guildId);

  guild.settings.antispam ??= {};
  guild.settings.antispam.enabled = !guild.settings.antispam.enabled;

  updateGuild(guildId, guild.settings);

  return guild.settings.antispam.enabled;
}
