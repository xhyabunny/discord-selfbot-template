import config from '../config';
import { Message } from 'xhyabunny-selfbot-v13';
import { join } from 'path';
import { statSync, readFileSync, readdirSync, createWriteStream, unlinkSync } from 'fs';
import { pipeline } from 'stream';
import { promisify } from 'util';
import archiver from 'archiver';

const MAX_FILE_SIZE_MB = 25; // Tamaño máximo del archivo en MB
const pipelinePromise = promisify(pipeline);

async function zipDirectory(directoryPath: string, zipFilePath: string) {
    return new Promise<void>((resolve, reject) => {
        const output = createWriteStream(zipFilePath);
        const archive = archiver('zip', { zlib: { level: 9 } });

        output.on('close', () => resolve());
        archive.on('error', (err) => reject(err));

        archive.pipe(output);

        const files = readdirSync(directoryPath);

        files.forEach((file) => {
            const fullPath = join(directoryPath, file);
            const stats = statSync(fullPath);
            if (stats.isFile()) {
                archive.file(fullPath, { name: file });
            }
        });

        archive.finalize();
    });
}

export async function send(msg: Message, args: string[]) {
    try {
        const filePath = join(config.currentDirectory, args.slice(2).join(' '));
        const stats = statSync(filePath);

        if (stats.isFile()) {
            // Verificar el tamaño del archivo
            const fileSizeMB = stats.size / (1024 * 1024); // Convertir bytes a MB
            if (fileSizeMB > MAX_FILE_SIZE_MB) {
                try { await msg.react('❌') } catch ( error ) { return null }
                await msg.channel.send('EXCEEDED LIMIT 25 MB.');
                return;
            }

            const fileBuffer = readFileSync(filePath);
            try { await msg.react('✅'); } catch ( error ) { return null }
            await msg.channel.send({ files: [{ attachment: fileBuffer, name: args.slice(2).join('_') }] });

        } else if (stats.isDirectory()) {
            const zipFilePath = join(config.currentDirectory, `${args.slice(2).join('_')}.zip`);
            await zipDirectory(filePath, zipFilePath);

            const zipStats = statSync(zipFilePath);
            const zipSizeMB = zipStats.size / (1024 * 1024); // Convertir bytes a MB

            if (zipSizeMB > MAX_FILE_SIZE_MB) {
                try { await msg.react('❌') } catch ( error ) { return null }
                await msg.channel.send('EXCEEDED LIMIT 25 MB.');
                unlinkSync(zipFilePath); // Borrar el archivo ZIP
                return;
            }

            try { await msg.react('✅'); } catch ( error ) { return null }
            await msg.channel.send({ files: [{ attachment: zipFilePath, name: `${args.slice(2).join('_')}.zip` }] });
            unlinkSync(zipFilePath); // Borrar el archivo ZIP después de enviarlo

        } else {
            try { await msg.react('❌') } catch ( error ) { return null }
            await msg.channel.send('ENOENT');
        }
    } catch (error) {
        try { await msg.react('❌') } catch ( error ) { return null }
        console.error('Error:', error);
    }
}
