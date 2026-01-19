import { userInfoLogic } from "./logic.js";

export const name = "user";

export async function execute(message, args) {
  // Check if the first argument is a role mention
  if (args[0] && (args[0].startsWith("<@&") || message.guild.roles.cache.some(r => r.name === args[0]))) {
    return message.reply(
      "⚠️ Please use `/role <role>` to get info about roles. The user command only works for users."
    );
  }

  // If someone mentions a user, use them; otherwise the author
  const member = message.mentions.members.first() || message.member;
  const embed = await userInfoLogic({ member });
  await message.channel.send({ embeds: [embed] });
}
