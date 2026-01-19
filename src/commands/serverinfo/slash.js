import { SlashCommandBuilder } from "discord.js"
import { serverInfoLogic } from "./logic.js"

export const data = new SlashCommandBuilder ()
.setName("server")
.setDescription("View server information");

export async function execute(interaction) {
    const result = await serverInfoLogic({ guild: interaction.guild });
    await interaction.reply({ embeds: [result] });    
}