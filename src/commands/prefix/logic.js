import { getGuild, updateGuild } from "../../services/guildService.js";

export async function prefixLogic({ guildId, member, args }) {
  const guild = await await getGuild(guildId);
  const current = guild.settings?.prefix || "!";

  if (!args[0]) {
    return {
      ok: true,
      message: `Current prefix is \`${current}\``
    };
  }

  if (!member.permissions.has("Administrator")) {
    return {
      ok: false,
      message: "You need **Administrator** permission."
    };
  }

  const newPrefix = args[0];
  if (newPrefix.length > 5) {
    return {
      ok: false,
      message: "Prefix too long (max 5 chars)."
    };
  }
 
  guild.settings.prefix = newPrefix;
  updateGuild(guildId, guild.settings);

  return {
    ok: true,
    message: `Prefix updated to \`${newPrefix}\``
  };
}
