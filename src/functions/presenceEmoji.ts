export async function presenceEmoji(string: string) {
    switch(string) {
        case "online":
            return "`🟢` "
        case "dnd":
            return "`⛔` "
        case "idle":
            return "`🌙` "
        case "offline":
            return "`⚫` "
        default:
            return ""
    }
}