export async function formatEmoji(emoji: any) {
    if (!emoji) {
        return "";
    }

    return `<:${emoji.name}:${emoji.id}> `
}