import { SlashCommandBuilder } from "discord.js";
import { executeConfig } from "./configSlash.js";
import { executeToggle } from "./toggleSlash.js";

export const data = new SlashCommandBuilder()
  .setName("antispam")
  .setDescription("Anti-spam system controls")
  .addSubcommand(sub =>
    sub
      .setName("config")
      .setDescription("Manage anti-spam settings from the dashboard")
  )
  .addSubcommand(sub =>
    sub
      .setName("toggle")
      .setDescription("Enable or disable anti-spam")
  );

export async function execute(interaction) {
  const sub = interaction.options.getSubcommand();

  if (sub === "config") return executeConfig(interaction);
  if (sub === "toggle") return executeToggle(interaction);
}
