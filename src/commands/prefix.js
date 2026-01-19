import { getGuild, updateGuild } from "../services/guildService.js";
import { log } from "../services/logger.js"
export const name = "prefix";

export async function execute(message, args) {
    console.log("PREFIX COMMAND FIRED", args);

  if (!message.guild) return;

  const guild = getGuild(message.guild.id);

  // Show current prefix
  if (!args[0]) {
    return message.reply(
      `Current prefix is \`${guild.prefix || "!"}\``
    );
  }

  // Permission check
  if (!message.member.permissions.has("Administrator")) {
    return message.reply("You need **Administrator** permission.");
  }

  const newPrefix = args[0];

  if (newPrefix.length > 5) {
    return message.reply("Prefix too long (max 5 chars).");
  }

  guild.prefix = newPrefix;
  updateGuild(message.guild.id, {
    ...guild.settings,
    prefix: newPrefix
  });

  message.reply(`Prefix updated to \`${newPrefix}\``);
}
