import { Message } from "discord.js-selfbot-v13";

export default async function ping(msg: Message) {
    msg.delete()
    const ping = new Date()
    const message = await msg.channel.send('_');
    if (message) {
        const pong = new Date();
        const pingTime = pong.getTime() - ping.getTime();
        message.edit(`\`🏓 ${pingTime}ms\``);
    }
}