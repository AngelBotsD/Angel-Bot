import fetch from 'node-fetch';

let apis = [
  {
    name: "v2-api", // Ejemplo de API que da video
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
    if (!args[0]) return m.reply(`Envía un enlace de YouTube\nEjemplo: ${usedPrefix + command} https://youtu.be/abc123`);

    let videoUrl = args[0];
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

    if (!downloadUrl) return m.reply('No se pudo obtener el video. Intenta otro enlace o más tarde.');

    // Enviar video
    await conn.sendMessage(m.chat, {
        video: { url: downloadUrl },
        caption: 'Aquí tienes tu video 🎬',
        mimetype: 'video/mp4'
    }, { quoted: m });
};

handler.command = /^(play2|video)$/i;
export default handler;