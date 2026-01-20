import { SlashCommandBuilder } from "discord.js";
import { setMuteLogic } from "./logic.js";

export const data = new SlashCommandBuilder()
  .setName("setmute")
  .setDescription("Set the mute role for this server")
  .addRoleOption(opt =>
    opt
      .setName("role")
      .setDescription("Role to use as the mute role")
      .setRequired(true)
  );

export async function execute(interaction) {
  const role = interaction.options.getRole("role");

  const result = await setMuteLogic({
    guild: interaction.guild,
    executor: interaction.member,
    role
  });

  if (result.ok) {
    await interaction.reply({ embeds: [result.embed] });
  } else {
    await interaction.reply({ content: result.message, ephemeral: true });
  }
}
