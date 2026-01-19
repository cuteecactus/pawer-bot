import { SlashCommandBuilder } from "discord.js";
import { roleInfoLogic } from "./logic.js";

export const data = new SlashCommandBuilder()
  .setName("role")
  .setDescription("Get information about a role")
  .addRoleOption(opt =>
    opt
      .setName("target")
      .setDescription("The role to get info for")
      .setRequired(true)
  );

export async function execute(interaction) {
  const role = interaction.options.getRole("target");
  const embed = await roleInfoLogic({ role });
  await interaction.reply({ embeds: [embed] });
}
