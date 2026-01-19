import { untimeoutLogic } from "./logic.js";

export const name = "untimeout";
export const aliases = ["untime"]; // optional short alias

export async function execute(message, args) {
  const targetMember = message.mentions.members.first();
  if (!targetMember) {
    return message.reply("❌ Please mention a user to remove timeout: `!untimeout @user`");
  }

  const result = await untimeoutLogic({
    executor: message.member,
    target: targetMember
  });

  if (result.ok && result.embed) {
    await message.channel.send({ embeds: [result.embed] });
  } else {
    await message.reply(result.message);
  }
}
