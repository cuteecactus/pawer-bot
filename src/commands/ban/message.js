import { banLogic } from "./logic.js";

export const name = "ban";

export async function execute(message, args) {
  // Require a mention
  const targetMember = message.mentions.members.first();
  if (!targetMember) {
    return message.reply("❌ Please mention a user to ban: `!ban @user [reason]`");
  }

  const reason = args.slice(1).join(" "); // everything after mention

  const result = await banLogic({
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
