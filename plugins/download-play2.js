import yts from 'yt-search';
import fs from 'fs';
import axios from 'axios';
import { downloadWithYtdlp, downloadWithDdownr } from '../lib/downloaders.js';

// Helper para descargar vía API
async function downloadWithApi(apiUrl) {
  console.log(`[API] Intentando descargar desde: ${apiUrl}`);
  const response = await axios.get(apiUrl);
  const result = response.data;
  const downloadUrl = result?.result?.downloadUrl || result?.result?.url || result?.data?.dl || result?.dl;
  if (!downloadUrl) throw new Error(`API ${apiUrl} no devolvió un link válido.`);
  const file = await axios.get(downloadUrl, { responseType: 'arraybuffer' });
  return file.data;
}

const play2Command = {
  name: "play2",
  command: ['play2'],
  category: "descargas",
  description: "Busca y descarga un video en formato MP4 usando múltiples métodos.",

  async execute({ sock, msg, args }) {
    if (args.length === 0) 
      return sock.sendMessage(msg.key.remoteJid, { text: "Por favor, proporciona el nombre de un video." }, { quoted: msg });

    const query = args.join(' ');
    let waitingMsg;

    try {
      waitingMsg = await sock.sendMessage(msg.key.remoteJid, { text: `🎶 Buscando "${query}"...` }, { quoted: msg });

      // --- Buscar video ---
      const searchResults = await yts(query);
      if (!searchResults.videos.length) throw new Error("No se encontraron resultados.");

      const videoInfo = searchResults.videos[0];
      const { title, url } = videoInfo;

      await sock.sendMessage(msg.key.remoteJid, { text: `✅ Encontrado: *${title}*.\n⬇️ Descargando video...` }, { quoted: msg });

      let videoBuffer;

      // --- Intentar descarga con yt-dlp ---
      try {
        console.log("[YTDLP] Intentando descargar...");
        const tempFilePath = await downloadWithYtdlp(url, true); // true = video
        videoBuffer = fs.readFileSync(tempFilePath);
        fs.unlinkSync(tempFilePath);
        console.log("[YTDLP] Descarga exitosa.");
      } catch (e1) {
        console.error("[YTDLP] Falló:", e1.message);

        // --- Intentar descarga con ddownr ---
        try {
          console.log("[DDOWNR] Intentando descargar...");
          const downloadUrl = await downloadWithDdownr(url, true);
          const response = await axios.get(downloadUrl, { responseType: 'arraybuffer' });
          videoBuffer = response.data;
          console.log("[DDOWNR] Descarga exitosa.");
        } catch (e2) {
          console.error("[DDOWNR] Falló:", e2.message);

          // --- Intentar con APIs externas ---
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

          if (!success) throw new Error("Todos los métodos de descarga de video fallaron.");
        }
      }

      if (!videoBuffer || videoBuffer.length === 0) throw new Error("El buffer de video está vacío.");

      await sock.sendMessage(msg.key.remoteJid, { text: `✅ Descarga completada. Enviando video...` }, { quoted: msg });
      await sock.sendMessage(msg.key.remoteJid, { video: videoBuffer, mimetype: 'video/mp4', caption: title }, { quoted: msg });

    } catch (error) {
      console.error("[PLAY2] Error final:", error);
      await sock.sendMessage(msg.key.remoteJid, { text: `❌ Error: ${error.message}` }, { quoted: msg });
    }
  }
};

export default play2Command;