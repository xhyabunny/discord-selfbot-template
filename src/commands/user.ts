import { Client, Message } from 'xhyabunny-selfbot-v13';
import { writeFileSync, readFileSync } from 'fs';
import { UserObj, UserArray, ActivityObj } from "../types";
import { presenceEmoji } from "../functions/presenceEmoji";

export default async function user(msg: Message, args: string[], client: Client) {
    switch (args[2]) {
        case "add":
            const u = client.users.cache.get(args[3]) || msg.mentions.users.first();
            if (u) {
                try {
                    let currentUsers = JSON.parse(readFileSync('./src/databases/users.json', 'utf-8'));
                    const timestampMs = u.createdTimestamp;
                    const timestampSeconds = Math.floor(timestampMs / 1000);
                    const existingUserIndex = currentUsers.findIndex((user: UserObj) => user.id === u.id);

                    const newUser = {
                        alias: args[4] ? args[4] : null,
                        displayName: u.displayName,
                        avatarUrl: u.displayAvatarURL(),
                        userName: u.username,
                        id: u.id,
                        createdAt: `\`\`${u.createdAt.getUTCDate()}/${u.createdAt.getMonth()}/${u.createdAt.getUTCFullYear()}\`\` \`\`${u.createdAt.getHours()}hs ${u.createdAt.getMinutes()}Mins\`\`\n-# rel: <t:${timestampSeconds}:R>`,
                        hasNitro: "Not fetched yet",
                        bannerUrl: u.banner ? u.banner : "Not fetched yet",
                        decoUrl: u.avatarDecorationURL(),
                        clanBadgeUrl: u.clanBadgeURL(),
                        isBot: u.bot,
                        state: existingUserIndex !== -1 ? currentUsers[existingUserIndex].state : 'Not fetched yet',
                        activities: existingUserIndex !== -1 ? currentUsers[existingUserIndex].activities : [],
                        status: existingUserIndex !== -1 ? currentUsers[existingUserIndex].status : 'Not fetched yet',
                        note: u.note !== null || u.note !== undefined ? u.note : 'No notes found for ' + u.username,
                        relationship: u.relationship,
                        hexAccent: u.hexAccentColor
                    };

                    if (existingUserIndex !== -1) {
                        // Si el usuario ya existe, sobrescribe los datos
                        currentUsers[existingUserIndex] = newUser;
                    } else {
                        // Si el usuario no existe, agrega uno nuevo
                        currentUsers.push(newUser);
                    }

                    writeFileSync('./src/databases/users.json', JSON.stringify(currentUsers, null, 2));

                    try { await msg.react('✅'); } catch ( error ) { return null }
                } catch (error) {
                    try { await msg.react('‼') } catch ( error ) { return null }
                    console.log(error);
                }
            } else {
                try { await msg.react('❌') } catch ( error ) { return null }
            }
            break;
        case "show":

            const currentUsers: UserArray = JSON.parse(readFileSync('./src/databases/users.json', 'utf-8'));
            let selectedUserIndex: number = -1;

            if (args[3] == '-a') {

                selectedUserIndex = currentUsers.findIndex((user: UserObj) => user.alias === args[4]);

            } else if (args[3] == 'all') {

                if (currentUsers.length <= 0) return (await msg.react('❔')).message.edit('List is empty')

                msg.react('✅')
                return msg.channel.send(
                    `${currentUsers.map((user: any, index: number) => `${index + 1} -> ${user.alias} -> <@${user.id}> -> ${user.id}`).join('\n')}`
                )

            } else {

                if (msg.mentions.users.size > 0) {
                    selectedUserIndex = currentUsers.findIndex((user: UserObj) => user.id === msg.mentions.users.first()?.id);
                } else if (args[3]) {
                    selectedUserIndex = currentUsers.findIndex((user: UserObj) => user.id === args[3]);
                }

            }

            if (selectedUserIndex === -1) {
                return await msg.react('❌');
            }

            const selectedUser = currentUsers[selectedUserIndex];
            await msg.channel.send(`### <@${selectedUser.id}> ${selectedUser.isBot ? '`🤖`' : '`👤`'} 
-# username: \`\`${selectedUser.userName}\`\`
-# id: \`\`${selectedUser.id}\`\`
-# created: ${selectedUser.createdAt}
-# state: ${selectedUser.state !== "" ? selectedUser.state : 'No state'} 
-# status: ${await presenceEmoji(selectedUser.status)}${selectedUser.status}
-# activities: 
${selectedUser.activities.length > 0 ? selectedUser.activities.map(activity => `
-# type: ${activity.type}
-# name: ${activity.name}
-# platform: ${activity.platform}
`).join(' ') : 'No activities found.'}
-# [_](${selectedUser.avatarUrl})
`);
            break;
        case "delete":

            const currentUsersToFilter = JSON.parse(readFileSync('./src/databases/users.json', 'utf-8'));

            if (!args[3]) return

            if (args[3] == '-a') {

                if (currentUsersToFilter.some((user: any) => user.alias === args[4])) {
                    try {
                        const filteredUsers_ = currentUsersToFilter.filter((user: { alias: string; }) => user.alias !== args[4])
                        writeFileSync('./src/databases/users.json', JSON.stringify(filteredUsers_, null, 2));
                        try { await msg.react('✅'); } catch ( error ) { return null }
                    } catch (error) {
                        try { await msg.react('‼') } catch ( error ) { return null }
                        console.log(error);
                    }
                } else {
                    try { await msg.react('❌') } catch ( error ) { return null }
                }
            } else {
                const uToD = client.users.cache.get(args[3]) || msg.mentions.users.first();

                if (uToD && currentUsersToFilter.some((user: any) => user.id === uToD.id)) {
                    try {
                        const filteredUsers_ = currentUsersToFilter.filter((user: { id: string; }) => user.id !== uToD.id)
                        writeFileSync('./src/databases/users.json', JSON.stringify(filteredUsers_, null, 2));
                        try { await msg.react('✅'); } catch ( error ) { return null }
                    } catch (error) {
                        await msg.react('‼');
                        console.log(error);
                    }
                } else {
                    try { await msg.react('❌') } catch ( error ) { return null }
                }
            }

            break;
        default: try { (await msg.react('❌')).message.edit('invalid argument `'+args[2]+'` please suse `@me help`') } catch ( error ) { return null }
    }
}
