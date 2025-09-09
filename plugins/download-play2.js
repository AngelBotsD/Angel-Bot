import { default as yts } from 'yt-search';

let handler = async (m, { conn, args, usedPrefix, command }) => {
    if (!args || args.length === 0) 
        return m.reply(`⚠️ Ingresa un nombre de canción o video.\nEjemplo: ${usedPrefix + command} karma police`);

    let query = args.join(' ');
    
    try {
        // Buscar el video en YouTube
        let results = await yts(query);
        let video = results.videos[0];

        if (!video) return m.reply('❌ No se encontró ningún video.');

        // Mandar video
        conn.sendMessage(m.chat, { 
            video: { url: video.url }, 
            caption: `🎵 *${video.title}*\n🔗 ${video.url}` 
        }, { quoted: m });

    } catch (e) {
        console.log(e);
        m.reply('❌ Ocurrió un error al buscar el video.');
    }
};

handler.command = /^play2$/i;
export default handler;