import { deafenLogic } from "./logic.js";
export const name = "deafen";
export async function execute(message, args) {
  const target =
    message.mentions.members.first() ||
    message.guild.members.cache.get(args[0]);

  if (!target) {
    return message.reply("❌ Usage: `!deafen @user`");
  }

  const result = await deafenLogic({
    executor: message.member,
    target
  });

  if (result.ok) {
    await message.reply({ embeds: [result.embed] });
  } else {
    await message.reply(result.message);
  }
}
