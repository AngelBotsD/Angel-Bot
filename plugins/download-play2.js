import yts from 'yt-search';
import fs from 'fs';
import axios from 'axios';
import { downloadWithYtdlp, downloadWithDdownr } from '../lib/downloaders.js';

async function downloadWithApi(apiUrl) {
  console.log(`[API] Intentando descargar desde: ${apiUrl}`);
  const response = await axios.get(apiUrl);
  const result = response.data;
  const downloadUrl = result?.result?.downloadUrl || result?.result?.url || result?.data?.dl || result?.dl;
  if (!downloadUrl) throw new Error(`API ${apiUrl} no devolvió un link válido.`);
  const file = await axios.get(downloadUrl, { responseType: 'arraybuffer' });
  return file.data;
}

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

    await conn.sendMessage(m.chat, { text: `✅ Encontrado: *${title}*.\n⬇️ Descargando video...` }, { quoted: m });

    let videoBuffer;

    // --- yt-dlp ---
    try {
      console.log("[YTDLP] Descargando...");
      const tempFilePath = await downloadWithYtdlp(url, true);
      videoBuffer = fs.readFileSync(tempFilePath);
      fs.unlinkSync(tempFilePath);
      console.log("[YTDLP] Descarga exitosa.");
    } catch (e1) {
      console.error("[YTDLP] Falló:", e1.message);

      // --- ddownr ---
      try {
        console.log("[DDOWNR] Descargando...");
        const downloadUrl = await downloadWithDdownr(url, true);
        const response = await axios.get(downloadUrl, { responseType: 'arraybuffer' });
        videoBuffer = response.data;
        console.log("[DDOWNR] Descarga exitosa.");
      } catch (e2) {
        console.error("[DDOWNR] Falló:", e2.message);

        // --- APIs externas ---
        const fallbackApis = [
          `https://api.siputzx.my.id/api/d/ytmp4?url=${encodeURIComponent(url)}`,
          `https://mahiru-shiina.vercel.app/download/ytmp4?url=${encodeURIComponent(url)}`,
          `https://api.agungny.my.id/api/youtube-video?url=${encodeURIComponent(url)}`
        ];

        let success = false;
        for (const apiUrl of fallbackApis) {
          try {
            videoBuffer = await downloadWithApi(apiUrl);
            console.log(`[API] Descarga exitosa desde: ${apiUrl}`);
            success = true;
            break;
          } catch (e3) {
            console.error(`[API] Falló ${apiUrl}:`, e3.message);
          }
        }

        if (!success) throw new Error("Todos los métodos de descarga fallaron.");
      }
    }

    if (!videoBuffer || videoBuffer.length === 0) throw new Error("El buffer de video está vacío.");

    await conn.sendMessage(m.chat, { text: `✅ Descarga completada. Enviando video...` }, { quoted: m });
    await conn.sendMessage(m.chat, { video: videoBuffer, mimetype: 'video/mp4', caption: title }, { quoted: m });

  } catch (error) {
    console.error("[PLAY2] Error final:", error);
    await conn.sendMessage(m.chat, { text: `❌ Error: ${error.message}` }, { quoted: m });
  }
};

handler.command = ['play2'];
handler.category = 'descargas';
handler.description = 'Busca y descarga un video en formato MP4 usando múltiples métodos.';

export default handler;