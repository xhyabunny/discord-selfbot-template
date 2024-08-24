import { readdirSync, statSync } from "fs";
import { Message } from 'xhyabunny-selfbot-v13';
import { join } from "path";
import config from '../config';

const PAGE_SIZE = 2000; // Límite de caracteres para los mensajes

function splitIntoPages(content: string, pageSize: number): string[] {
    const pages: string[] = [];
    let currentPage = '';
    
    content.split('\n').forEach(line => {
        if ((currentPage + line + '\n').length > pageSize) {
            pages.push(currentPage);
            currentPage = line + '\n';
        } else {
            currentPage += line + '\n';
        }
    });
    
    if (currentPage) {
        pages.push(currentPage);
    }
    
    return pages;
}

export function dir(msg: Message) {
    try {
        const items = readdirSync(config.currentDirectory);
        const directories = items.filter(item => statSync(join(config.currentDirectory, item)).isDirectory());
        const files = items.filter(item => statSync(join(config.currentDirectory, item)).isFile());

        const dirContent = directories.length > 0 ? '📂 `'+directories.join("`\n📂 `")+'`\n' : '';
        const fileContent = files.length > 0 ? '📄 `'+files.join("`\n📄 `")+'`\n' : '';

        const content = `🗂 \`${config.currentDirectory}\`\n${dirContent}${fileContent}`;
        const pages = splitIntoPages(content, PAGE_SIZE);

        pages.forEach((page) => {
            msg.reply(page);
        });
    } catch (error) {
        msg.reply(`Error listing directories: ${error.message}`);
    }
}
