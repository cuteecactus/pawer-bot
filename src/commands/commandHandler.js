import fs from "fs";
import path from "path";
import { pathToFileURL } from "url";

export const commands = new Map();

export async function loadCommands() {
  const commandsPath = path.resolve("src/commands");
  const commandFiles = fs
    .readdirSync(commandsPath)
    .filter(f => f.endsWith(".js"));

  for (const file of commandFiles) {
    const filePath = path.join(commandsPath, file);
    const fileUrl = pathToFileURL(filePath).href;

    const mod = await import(fileUrl);
    if (!mod.name || !mod.execute) continue;

    commands.set(mod.name, mod.execute);
    console.log(`Loaded command: ${mod.name}`);
  }
}
