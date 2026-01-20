import { clearLogic } from "./logic.js";

export const name = "clear";

export async function execute(message, args) {
    const amount = parseInt(args[0], 10);
    const messageChannel = message.channel;
    
    
    if (isNaN(amount)) {
        return message.reply("❌ Usage: `!clear <amount>` (1–100)");
    }

    const result = await clearLogic({
        executor: message.member,
        channel: message.channel,
        amount
    });

    if (result.ok) {
        const msg = await messageChannel.send({ embeds: [result.embed] });
        setTimeout(() => msg.delete().catch(() => { }), 5000);
    } else {
        await messageChannel.send(result.message);
    }
}
