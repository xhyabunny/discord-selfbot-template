import { Message, Client, MessageAttachment } from 'xhyabunny-selfbot-v13';
import fetch from 'node-fetch'
import { writeFileSync, mkdirSync } from 'fs'

async function downloadFile(msg: Message, file: MessageAttachment) {
    
    const filePath = `./src/downloads/${msg.channel.toString().replace(/[<>:"/\\|?*]+/g, '')}/${msg.id}`;

    try {
        const response = await fetch(file.url);

        if (!response.ok) {
            throw new Error(`Error al intentar descargar el archivo: ${response.statusText}`);
        }

        const buffer = await response.buffer();

        mkdirSync(filePath, { recursive: true });

        writeFileSync(`${filePath}/${file.name}`, buffer);
        try { await msg.react('✅') } catch ( error ) { return null }
    } catch (error) {
        console.error('Error al descargar el archivo:', error);
        try { await msg.react('❌') } catch ( error ) { return null }
    }
}

export default async function save(msg: Message, args: string[], client: Client) {
    if(!args[2]) {
        try { (await msg.react('❌')).message.edit('no message selected') } catch ( error ) { return null }
        return
    }
    if(!args[3]) {
        try { (await msg.react('❌')).message.edit('no option selected') } catch ( error ) { return null }
        return
    }
    const message = await msg.channel.messages.fetch(args[2])
    switch(args[3]) {
        case "files":
            message.attachments.forEach(async (file: MessageAttachment) => await downloadFile(message, file))
            break;
    }
}