import { muteLogic } from "./logic.js";

export const name = "mute";

export async function execute(message, args) {
  // Permission check (early)
  if (!message.member) return;

  const target =
    message.mentions.members.first() ||
    message.guild.members.cache.get(args[0]);

  if (!target) {
    return message.reply("❌ Usage: `!mute @user [reason]`");
  }

  const reason = args.slice(1).join(" ");

  const result = await muteLogic({
    guild: message.guild,
    executor: message.member,
    target,
    reason
  });

  if (result.ok) {
    await message.reply({ embeds: [result.embed] });
  } else {
    await message.reply(result.message);
  }
}
