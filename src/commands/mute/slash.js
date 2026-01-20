import { SlashCommandBuilder } from "discord.js";
import { muteLogic } from "./logic.js";

export const data = new SlashCommandBuilder()
  .setName("mute")
  .setDescription("Mute a user using the configured mute role")
  .addUserOption(opt =>
    opt
      .setName("target")
      .setDescription("User to mute")
      .setRequired(true)
  )
  .addStringOption(opt =>
    opt
      .setName("reason")
      .setDescription("Reason for the mute")
      .setRequired(false)
  );

export async function execute(interaction) {
  const target = interaction.options.getMember("target");
  const reason = interaction.options.getString("reason");

  const result = await muteLogic({
    guild: interaction.guild,
    executor: interaction.member,
    target,
    reason
  });

  if (result.ok) {
    await interaction.reply({ embeds: [result.embed] });
  } else {
    await interaction.reply({ content: result.message, ephemeral: true });
  }
}
