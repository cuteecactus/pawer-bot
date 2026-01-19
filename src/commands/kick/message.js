import { kickLogic } from "./logic.js";

export const name = "kick";

export async function execute(message, args) {
  const targetMember = message.mentions.members.first();
  if (!targetMember) {
    return message.reply("❌ Please mention a user to kick: `!kick @user [reason]`");
  }

  const reason = args.slice(1).join(" ");

  const result = await kickLogic({
    guild: message.guild,
    executor: message.member,
    target: targetMember,
    reason
  });

  if (result.ok && result.embed) {
    await message.channel.send({ embeds: [result.embed] });
  } else {
    await message.reply(result.message);
  }
}
