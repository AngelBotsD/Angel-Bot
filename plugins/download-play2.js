import fetch from 'node-fetch';
import yts from 'yt-search';

let apis = [
  {
    name: "v2-api",
    url: (videoUrl) => `https://api.v2.my.id/api/ytmp4?url=${encodeURIComponent(videoUrl)}&quality=360`,
    extract: (data) => data?.result?.download?.url
  },
  {
    name: "another-api",
    url: (videoUrl) => `https://api.zenkey.my.id/api/download/ytmp4?apikey=zenkey&url=${encodeURIComponent(videoUrl)}&quality=360`,
    extract: (data) => data?.result?.download?.url
  }
];

let handler = async (m, { conn, args, usedPrefix, command }) => {
    if (!args[0]) return m.reply(`Escribe el nombre o título del video\nEjemplo: ${usedPrefix + command} karma police`);

    let query = args.join(' ');

    // Buscar en YouTube
    let searchResult = await yts(query);
    let video = searchResult.videos.length > 0 ? searchResult.videos[0] : null;

    if (!video) return m.reply('No encontré ningún video con ese nombre.');

    let videoUrl = video.url;
    let downloadUrl;

    // Intentar cada API hasta que funcione
    for (let api of apis) {
        try {
            let res = await fetch(api.url(videoUrl));
            let data = await res.json();
            downloadUrl = api.extract(data);
            if (downloadUrl) break;
        } catch (e) {
            console.log(`Error con API ${api.name}:`, e.message);
        }
    }

    if (!downloadUrl) return m.reply('No se pudo obtener el video. Intenta otra búsqueda o más tarde.');

    // Enviar video
    await conn.sendMessage(m.chat, {
        video: { url: downloadUrl },
        caption: `🎬 ${video.title}\n${video.url}`,
        mimetype: 'video/mp4'
    }, { quoted: m });
};

handler.command = /^(play2|video)$/i;
export default handler;