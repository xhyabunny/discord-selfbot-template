import { Client, Message } from 'xhyabunny-selfbot-v13';
import { writeFileSync, readFileSync } from 'fs';
import config from '../config';

export default async function admin(msg: Message, args: string[], client: Client) {
    switch (args[2]) {
        case "add":
            const u = client.users.cache.get(args[3]) || msg.mentions.users.first();
            if (u) {
                if (!args[4]) {
                    try { (await msg.edit('add alias')).react('❌') } catch (error) { return null }
                    return
                }
                try {
                    let currentUsers = JSON.parse(readFileSync('./src/databases/admins.json', 'utf-8'));
                    const newUser = {
                        alias: args[4],
                        id: u.id
                    };
                    currentUsers.push(newUser);
                    writeFileSync('./src/databases/admins.json', JSON.stringify(currentUsers, null, 2));

                    try { await msg.react('✅'); } catch (error) { return null }
                } catch (error) {
                    try { await msg.react('‼') } catch (error) { return null }
                    console.log(error);
                }
            } else {
                try { await msg.react('❌') } catch (error) { return null }
            }
            break;
        case "show":
            try {
                let currentUsers = JSON.parse(readFileSync('./src/databases/admins.json', 'utf-8'));
                try { await msg.edit(`${currentUsers.map((user: any, index: number) => `${index + 1} -> ${user.alias} -> ${user.id}`).join('\n')}`) } catch (error) { return null }
            } catch (error) {
                try { await msg.react('‼') } catch (error) { return null }
                console.log(error);
            }
            break;
        case "remove":

            const currentUsers = JSON.parse(readFileSync('./src/databases/admins.json', 'utf-8'));
            let selectedUserIndex: number = -1;

            if (!args[3]) return

            selectedUserIndex = currentUsers.findIndex((user: any) => user.alias === args[3]);

            if (selectedUserIndex === -1) {
                try { await msg.react('❌') } catch (error) { return null }
                return
            }

            try {
                const filteredUsers = currentUsers.filter(user => user.alias !== args[3])
                writeFileSync('./src/databases/admins.json', JSON.stringify(filteredUsers, null, 2));
                try { await msg.react('✅'); } catch (error) { return null }
            } catch (error) {
                try { await msg.react('‼') } catch (error) { return null }
                console.log(error);
            }

            break;
        default:
            try { (await msg.react('❌')).message.edit(`invalid argument \`${args[2]}\` please use \`${config.prefix} help\``) } catch ( error ) { return null }
            return
    }
}
