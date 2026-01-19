import { userInfoLogic } from "./logic.js";

export const name = "user";

export async function execute(message, args) {
  // If someone mentions a user, use them; otherwise the author
  const member = message.mentions.members.first() || message.member;
  const embed = await userInfoLogic({ member });
  await message.channel.send({ embeds: [embed] });
}
