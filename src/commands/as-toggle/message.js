
import { toggleAntiSpam } from "./logic.js";
export const name = "astoggle";

export async function execute(message, args) {
  if (!message.member.permissions.has("ManageGuild"))
    return message.reply("❌ You need Manage Server permission.");

  const enabled = toggleAntiSpam(message.guild.id);
  message.reply(`🛡️ Anti-spam is now **${enabled ? "ENABLED" : "DISABLED"}**`);
}
