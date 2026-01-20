import { setNickLogic } from "./logic.js";

export const name = "setnick";

export async function execute(message, args) {
  const target = message.mentions.members.first();
  if (!target) {
    return message.reply("❌ Usage: `!setnick @user <nickname>` (omit nickname to reset)");
  }

  const nickname = args.slice(1).join(" ");

  const result = await setNickLogic({
    guild: message.guild,
    executor: message.member,
    target,
    nickname: nickname || null
  });

  if (result.ok) {
    await message.reply({ embeds: [result.embed] });
  } else {
    await message.reply(result.message);
  }
}
