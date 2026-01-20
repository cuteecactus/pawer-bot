import { SlashCommandBuilder, ChannelType } from "discord.js";
import { moveLogic } from "./logic.js";

export const data = new SlashCommandBuilder()
  .setName("move")
  .setDescription("Move a user to another voice channel")
  .addUserOption(opt =>
    opt
      .setName("target")
      .setDescription("User to move")
      .setRequired(true)
  )
  .addChannelOption(opt =>
    opt
      .setName("channel")
      .setDescription("Voice channel to move the user to")
      .addChannelTypes(ChannelType.GuildVoice)
      .setRequired(true)
  );

export async function execute(interaction) {
  const target = interaction.options.getMember("target");
  const channel = interaction.options.getChannel("channel");

  const result = await moveLogic({
    executor: interaction.member,
    target,
    channel
  });

  if (result.ok) {
    await interaction.reply({ embeds: [result.embed] });
  } else {
    await interaction.reply({ content: result.message, ephemeral: true });
  }
}
