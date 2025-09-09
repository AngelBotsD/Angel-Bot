import yts from 'yt-search';
import ytdl from 'ytdl-core';
import fs from 'fs';
import path from 'path';

let handler = async (m, { conn, args }) => {
  if (!args || args.length === 0)
    return conn.sendMessage(m.chat, { text: "Por favor, escribe el nombre del video." }, { quoted: m });

  const query = args.join(' ');
  console.log('[PLAY2] Comando recibido, query:', query);

  let waitingMsg = await conn.sendMessage(m.chat, { text: `🎶 Buscando "${query}"...` }, { quoted: m });

  try {
    // --- Buscar video ---
    const searchResults = await yts(query);
    if (!searchResults.videos.length) throw new Error("No se encontraron resultados.");

    const videoInfo = searchResults.videos[0];
    const { title, url } = videoInfo;

    await conn.sendMessage(m.chat, { text: `✅ Encontrado: *${title}*\n⬇️ Descargando video...` }, { quoted: m });

    // --- Descargar con ytdl-core ---
    const tempFilePath = path.join('./tmp', `${Date.now()}.mp4`);
    if (!fs.existsSync('./tmp')) fs.mkdirSync('./tmp');

    console.log('[YTDL] Descargando video...');
    await new Promise((resolve, reject) => {
      ytdl(url, { quality: 'highestvideo' })
        .pipe(fs.createWriteStream(tempFilePath))
        .on('finish', resolve)
        .on('error', reject);
    });

    console.log('[YTDL] Descarga completada.');

    // --- Leer buffer ---
    const videoBuffer = fs.readFileSync(tempFilePath);

    await conn.sendMessage(m.chat, { text: `✅ Descarga completada. Enviando video...` }, { quoted: m });
    await conn.sendMessage(m.chat, { video: videoBuffer, mimetype: 'video/mp4', caption: title }, { quoted: m });

    // --- Limpiar ---
    fs.unlinkSync(tempFilePath);

  } catch (error) {
    console.error('[PLAY2] Error final:', error);
    await conn.sendMessage(m.chat, { text: `❌ Error: ${error.message}` }, { quoted: m });
  }
};

handler.command = ['play2'];
handler.category = 'descargas';
handler.description = 'Busca y descarga un video en formato MP4 directamente con ytdl-core.';

export default handler;