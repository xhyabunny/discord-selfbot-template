import { Message } from 'xhyabunny-selfbot-v13';
import { join } from 'path'
import { statSync } from "fs";
import config from '../config';

export function cd(msg: Message, args: string[]) {
    
    try {
        const newPath = join(config.currentDirectory, args.slice(2).join(' '));
        if (statSync(newPath).isDirectory()) {
            config.currentDirectory = newPath;
            msg.reply(`🗂 \`${config.currentDirectory}\``);
        } else {
            msg.reply("Directory doesn't exist or is invalid.");
        }
    } catch (error) {
        msg.reply(`Error changing directory: ${error.message}`);
    }
}