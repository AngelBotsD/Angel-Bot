import { exec } from 'child_process';
import fs from 'fs';
import path from 'path';
import yts from 'yt-search';

let handler = async (m, { conn, args, usedPrefix, command }) => {
    if (!args[0]) return m.reply(`Escribe el nombre del video\nEjemplo: ${usedPrefix + command} karma police`);

    let query = args.join(' ');

    // Buscar en YouTube
    let searchResult = await yts(query);
    let video = searchResult.videos.length > 0 ? searchResult.videos[0] : null;
    if (!video) return m.reply('No encontré ningún video con ese nombre.');

    let videoUrl = video.url;
    let outputFile = path.join('./tmp', `${video.videoId}.mp4`);

    // Crear carpeta tmp si no existe
    if (!fs.existsSync('./tmp')) fs.mkdirSync('./tmp', { recursive: true });

    // Descargar video usando yt-dlp
    let downloadCommand = `yt-dlp -f mp4 -o "${outputFile}" "${videoUrl}"`;

    m.reply(`⏳ Descargando: ${video.title}`);

    exec(downloadCommand, async (err) => {
        if (err) {
            console.error(err);
            return m.reply('❌ Ocurrió un error al descargar el video.');
        }

        // Enviar video al chat
        await conn.sendMessage(m.chat, {
            video: fs.readFileSync(outputFile),
            caption: `🎬 ${video.title}\n${videoUrl}`,
            mimetype: 'video/mp4'
        }, { quoted: m });

        // Borrar archivo temporal
        fs.unlinkSync(outputFile);
    });
};

handler.command = /^(play2|video)$/i;
export default handler;