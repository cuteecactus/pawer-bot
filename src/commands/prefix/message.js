import { prefixLogic } from "./logic.js";

export const name = "prefix";

export async function execute(message, args) {
  const result = await prefixLogic({
    guildId: message.guild.id,
    member: message.member,
    args
  });

  await message.reply(result.message);
}
