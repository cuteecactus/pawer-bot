import { unmuteLogic } from "./logic.js";

export const name = "unmute";

export async function execute(message, args) {
  const target =
    message.mentions.members.first() ||
    message.guild.members.cache.get(args[0]);

  if (!target) {
    return message.reply("❌ Usage: `!unmute @user`");
  }

  const result = await unmuteLogic({
    guild: message.guild,
    executor: message.member,
    target
  });

  if (result.ok) {
    await message.reply({ embeds: [result.embed] });
  } else {
    await message.reply(result.message);
  }
}
