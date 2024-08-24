import config from "./config";
import comands from './commands/index';
import { Client, Message, User } from 'xhyabunny-selfbot-v13';
import { updateUserInfo } from './functions/updateUserInfo';
import { readFileSync } from 'fs';

const currentAdmins = JSON.parse(readFileSync('./src/databases/admins.json', 'utf-8'));

const client = new Client({
    messageCacheLifetime: 60,
    restTimeOffset: 0,
    partials: ['MESSAGE', 'CHANNEL', 'REACTION']
});

client.on('ready', async () => {
    console.log(`${client?.user?.username} is ready!`);
});

client.on('messageCreate', (msg: Message) => {
    if (!currentAdmins.some((admin: { id: string }) => admin.id === msg.author.id)) return;
    if (!msg.content.startsWith(config.prefix)) return;
    const args = msg.content.split(' ');
    if (!args.length) return;
    try {
        comands[args[1]](msg, args, client);
    } catch (error) {
        msg.edit(`Unknown command \`${args[1]}\` use \`${config.prefix} help\``);
        msg.react('❌');
    }
});

client.on('presenceUpdate', (oldP, newP) => {
    if (newP.user) {
        updateUserInfo(newP.user, client);
    }
});

client.on('userUpdate', async (oldU, newU) => {
    const user: User = await client.users.fetch(newU.id);
    updateUserInfo(user, client);
});

client.login(config.token);
