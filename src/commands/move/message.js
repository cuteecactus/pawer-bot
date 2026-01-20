import { moveLogic } from "./logic.js";

export async function execute(message, args) {
  const target =
    message.mentions.members.first() ||
    message.guild.members.cache.get(args[0]);

  if (!target) {
    return message.reply("❌ Usage: `!move @user <voiceChannelId>`");
  }

  const channelId = args[1];
  if (!channelId) {
    return message.reply("❌ You must provide a voice channel ID.");
  }

  const channel = message.guild.channels.cache.get(channelId);

  const result = await moveLogic({
    executor: message.member,
    target,
    channel
  });

  if (result.ok) {
    await message.reply({ embeds: [result.embed] });
  } else {
    await message.reply(result.message);
  }
}
