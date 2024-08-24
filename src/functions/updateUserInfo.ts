import { UserObj, UserArray } from '../types';
import { writeFileSync, readFileSync } from 'fs';
import { Client, Presence, User } from 'discord.js-selfbot-v13';
import { presenceEmoji } from './presenceEmoji'
import { formatEmoji } from './formatEmoji'

export async function updateUserInfo(user: User, client: Client) {
    try {
        // Leer el archivo JSON actual
        let currentUsers: UserArray = JSON.parse(readFileSync('./src/databases/users.json', 'utf-8'));

        // Buscar el índice del usuario en el array
        const userIndex = currentUsers.findIndex((u: UserObj) => u.id === user.id);

        // Obtener la presencia del usuario
        let presence: Presence = client.presences.cache.get(user.id);

        if (userIndex !== -1 && presence) {
            // Actualizar la información del usuario
            const updatedUser: UserObj = {
                ...currentUsers[userIndex],
                displayName: user.displayName || null,
                avatarUrl: user.displayAvatarURL(),
                bannerUrl: user.banner || null,
                decoUrl: user.avatarDecorationURL() || null,
                clanBadgeUrl: user.clanBadgeURL() || null,
                userName: user.username,
                isBot: user.bot,
                state: presence.activities[0]?.type === 'CUSTOM' ? presence.activities[0].emoji ? await formatEmoji(presence.activities[0].emoji) + ' '  : presence.activities[0].state ?? 'Unable to fetch' : 'No state',
                status: presence.status,
                activities: presence.activities
                    .filter(activity => activity.type !== 'CUSTOM')
                    .map(activity => ({
                        type: activity.type.toString(),
                        name: activity.name,
                        state: activity.state || "No state",
                        platform: activity.platform || "No platform"
                    }))
            };

            // Reemplazar el usuario en el array
            currentUsers[userIndex] = updatedUser;

            // Escribir el array actualizado en el archivo JSON
            writeFileSync('./src/databases/users.json', JSON.stringify(currentUsers, null, 2));
            console.log(`📂  Inside data :: ${user.username} ${currentUsers[userIndex].alias ? 'alias ' + currentUsers[userIndex].alias + ' ' : ''}got updated.`);
        } else {
            console.log(`🌐 Outside data :: ${user.username} id ${user} got updated.`);
        }
    } catch (error) {
        console.error('Error al actualizar la información del usuario:', error);
    }
}