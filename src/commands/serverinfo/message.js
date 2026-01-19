import { serverInfoLogic } from "./logic.js"

export const name = "server"

export async function execute(message, args) {
    const result = await serverInfoLogic({ guild: message.guild });
    await message.reply({ embeds: [result] });
}

