import axios from "axios";
import yts from "yt-search";
import fs from "fs";
import path from "path";
import { promisify } from "util";
import { pipeline } from "stream";

const streamPipe = promisify(pipeline);

let handler = async (m, { conn, text }) => {
  if (!text) return conn.sendMessage(m.chat, { text: "✳️ Usa: .play2 <término>" }, { quoted: m });

  // Buscar video
  const search = await yts(text);
  const video = search.videos[0];
  if (!video) return conn.sendMessage(m.chat, { text: "❌ Sin resultados." }, { quoted: m });

  const { url: videoUrl, title, timestamp: duration, views, author, thumbnail } = video;

  // Mensaje preview
  const caption = `
🎬 Título: ${title}
⏱ Duración: ${duration}
👁 Vistas: ${views.toLocaleString()}
🎤 Autor: ${author}
🔗 Link: ${videoUrl}
📥 Descargando video...
  `.trim();

  await conn.sendMessage(m.chat, { image: { url: thumbnail }, caption }, { quoted: m });

  try {
    const tmp = path.join("./tmp");
    if (!fs.existsSync(tmp)) fs.mkdirSync(tmp, { recursive: true });

    // Probar varias calidades
    const qualities = ["720p", "480p", "360p"];
    let urlVideo = null;
    for (let q of qualities) {
      try {
        const res = await axios.get(`https://api.neoxr.eu/api/youtube?url=${encodeURIComponent(videoUrl)}&type=video&quality=${q}&apikey=russellxz`);
        if (res.data?.status && res.data.data?.url) { urlVideo = res.data.data.url; break; }
      } catch {}
    }
    if (!urlVideo) throw new Error("No se pudo obtener el video");

    const file = path.join(tmp, `${Date.now()}_video.mp4`);
    const dl = await axios.get(urlVideo, { responseType: "stream" });
    await streamPipe(dl.data, fs.createWriteStream(file));

    // Enviar video
    await conn.sendMessage(m.chat, {
      video: fs.readFileSync(file),
      mimetype: "video/mp4",
      fileName: `${title}.mp4`,
      caption: `🎬 Aquí tienes tu video~ 💫\n© La Suki Bot`
    }, { quoted: m });

    fs.unlinkSync(file);
  } catch (e) {
    console.error("Error play2:", e);
    await conn.sendMessage(m.chat, { text: "❌ Error al descargar el video." }, { quoted: m });
  }
};

// Configuración del handler
handler.command = /^play2$/i;  // reconoce ".play2"
handler.exp = 0;

export default handler;