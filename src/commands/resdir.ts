import { Message } from 'discord.js-selfbot-v13';
import config from '../config';

export function resdir(msg: Message) {
    try {
        config.currentDirectory = config.startDir
    } catch (error) {
        msg.reply(`Error reseting directory: ${error.message}`);
    }
}