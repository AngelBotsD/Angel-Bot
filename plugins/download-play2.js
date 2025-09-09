import yts from 'yt-search';
import ytdl from 'ytdl-core';
import fs from 'fs';
import path from 'path';

let handler = async (m, { conn, args, usedPrefix, command }) => {
    if (!args || args.length === 0) 
        return m.reply(`⚠️ Ingresa un nombre de canción o video.\nEjemplo: ${usedPrefix + command} karma police`);

    let query = args.join(' ');

    try {
        // Buscar video en YouTube
        let results = await yts(query);
        let video = results.videos[0];

        if (!video) return m.reply('❌ No se encontró ningún video.');

        const videoPath = path.join('./tmp', `${video.videoId}.mp4`);
        if (!fs.existsSync('./tmp')) fs.mkdirSync('./tmp');

        // Descargar video
        const stream = ytdl(video.url, { quality: 'highestvideo' });
        const fileWrite = fs.createWriteStream(videoPath);
        stream.pipe(fileWrite);

        fileWrite.on('finish', async () => {
            // Mandar video
            await conn.sendMessage(m.chat, {
                video: fs.readFileSync(videoPath),
                caption: `🎵 *${video.title}*`
            }, { quoted: m });

            // Borrar video temporal
            fs.unlinkSync(videoPath);
        });

    } catch (e) {
        console.log(e);
        m.reply('❌ Ocurrió un error al descargar o enviar el video.');
    }
};

handler.command = /^play2$/i;
export default handler;