import { timeoutLogic } from "./logic.js";

export const name = "timeout";

export async function execute(message, args) {
  const targetMember = message.mentions.members.first();
  if (!targetMember) {
    return message.reply("❌ Please mention a user to timeout: `!timeout @user <duration> [reason]`");
  }

  const duration = args[1]; // e.g., 10m
  const reason = args.slice(2).join(" "); // optional

  const result = await timeoutLogic({
    guild: message.guild,
    executor: message.member,
    target: targetMember,
    duration,
    reason
  });

  if (result.ok && result.embed) {
    await message.channel.send({ embeds: [result.embed] });
  } else {
    await message.reply(result.message);
  }
}
