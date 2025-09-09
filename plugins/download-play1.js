import fetch from "node-fetch";
import yts from "yt-search";

let handler = async (m, { conn, usedPrefix, command, text }) => {

    if (!text) return m.reply(`Ingresa un texto para buscar en YouTube\n> *Ejemplo:* ${usedPrefix + command} 4 Babys`);

    try {
        // Buscar en YouTube
        let api = await (await fetch(`https://delirius-apiofc.vercel.app/search/ytsearch?q=${text}`)).json();
        let results = api.data[0];

        let txt = `✨ *Título:* ${results.title}\n⌛ *Duración:* ${results.duration}\n📎 *Link:* ${results.url}\n📆 *Publicado:* ${results.publishedAt}`;
        let img = results.image;

        // Enviar info de la canción
        await conn.sendMessage(m.chat, { image: { url: img }, caption: txt }, { quoted: m });

        // Reaccionar con 🕒 mientras se procesa la descarga
        await conn.sendMessage(m.chat, { react: { text: '🕒', key: m.key } });

        // Descargar audio
        let api2 = await (await fetch(`https://api.vreden.my.id/api/ytmp3?url=${results.url}`)).json();

        // Enviar audio
        await conn.sendMessage(m.chat, { audio: { url: api2.result.download.url }, mimetype: 'audio/mpeg' }, { quoted: m });

        // Cambiar reacción a ✅ después de enviar
        await conn.sendMessage(m.chat, { react: { text: '✅', key: m.key } });

    } catch (e) {
        m.reply(`*No encontramos resultados para tu búsqueda* ${e.message}`);
        // Reacción de error
        await conn.sendMessage(m.chat, { react: { text: '✖️', key: m.key } });
    }
}

handler.command = ['play1'];

export default handler;