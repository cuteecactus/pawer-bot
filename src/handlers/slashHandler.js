import fs from "fs";
import path from "path";
import { pathToFileURL } from "url";

export const slashCommands = new Map();

export async function loadSlashCommands(client) {
  const base = path.resolve("src/commands");
  const data = [];

  for (const dir of fs.readdirSync(base)) {
    const file = path.join(base, dir, "slash.js");
    if (!fs.existsSync(file)) continue;

    const mod = await import(pathToFileURL(file).href);
    slashCommands.set(mod.data.name, mod);
    data.push(mod.data.toJSON());
  }

  // Guild-only registration (FAST updates)
  await client.application.commands.set(data, process.env.GUILD_ID);
  console.log("Slash commands registered (guild)");
}

export async function handleSlash(interaction) {
  if (!interaction.isChatInputCommand()) return;

  const command = slashCommands.get(interaction.commandName);
  if (!command) return;

  await command.execute(interaction);
}
