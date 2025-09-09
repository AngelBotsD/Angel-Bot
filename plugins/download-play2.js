// Plugins/music/play2.js
import axios from "axios";
import yts from "yt-search";
import fs from "fs";
import path from "path";
import ffmpeg from "fluent-ffmpeg";
import { promisify } from "util";
import { pipeline } from "stream";

const streamPipe = promisify(pipeline);

export const command = ["play2"];

export const play2 = async (msg, { conn, args }) => {
  const pref = global.prefixes?.[0] || ".";
  const text = args.join(" ");

  if (!text) {
    return conn.sendMessage(msg.key.remoteJid, { text: `✳️ Usa:\n${pref}play2 <término> [audio/video]\nEj: *${pref}play2* bad bunny audio` }, { quoted: msg });
  }

  // Determinar tipo de descarga
  const type = args[args.length - 1].toLowerCase();
  const isAudio = type === "audio";

  // Busca el video
  const res = await yts(text);
  const video = res.videos[0];
  if (!video) return conn.sendMessage(msg.key.remoteJid, { text: "❌ Sin resultados." }, { quoted: msg });

  const { url: videoUrl, title, timestamp: duration, views, author, thumbnail } = video;

  // Preview con info
  const caption = `
❦𝑳𝑨 𝑺𝑼𝑲𝑰 𝑩𝑶𝑻❦

📀 Info del video:
❥ Título: ${title}
❥ Duración: ${duration}
❥ Vistas: ${views.toLocaleString()}
❥ Autor: ${author}
❥ Link: ${videoUrl}

🎬 Descargando ${isAudio ? "audio" : "video"}...
`.trim();

  await conn.sendMessage(msg.key.remoteJid, { image: { url: thumbnail }, caption }, { quoted: msg });

  try {
    const tmp = path.join("./tmp"); 
    if (!fs.existsSync(tmp)) fs.mkdirSync(tmp, { recursive: true });

    if (isAudio) {
      // Audio MP3 usando la API de Neoxr
      const api = `https://api.neoxr.eu/api/youtube?url=${encodeURIComponent(videoUrl)}&type=audio&quality=128kbps&apikey=russellxz`;
      const res = await axios.get(api);
      if (!res.data?.status || !res.data.data?.url) throw new Error("No se pudo obtener el audio");

      const inFile = path.join(tmp, `${Date.now()}_in.m4a`);
      const outFile = path.join(tmp, `${Date.now()}_out.mp3`);
      const dl = await axios.get(res.data.data.url, { responseType: "stream" });
      await streamPipe(dl.data, fs.createWriteStream(inFile));

      await new Promise((r, e) => ffmpeg(inFile).audioCodec("libmp3lame").audioBitrate("128k").format("mp3").save(outFile).on("end", r).on("error", e));

      await conn.sendMessage(msg.key.remoteJid, { audio: fs.readFileSync(outFile), mimetype: "audio/mpeg", fileName: `${title}.mp3` }, { quoted: msg });

      fs.unlinkSync(inFile);
      fs.unlinkSync(outFile);

    } else {
      // Video MP4 usando la API de Neoxr
      const qualities = ["720p", "480p", "360p"];
      let urlVideo = null;
      for (let q of qualities) {
        try {
          const r = await axios.get(`https://api.neoxr.eu/api/youtube?url=${encodeURIComponent(videoUrl)}&type=video&quality=${q}&apikey=russellxz`);
          if (r.data?.status && r.data.data?.url) { urlVideo = r.data.data.url; break; }
        } catch {}
      }
      if (!urlVideo) throw new Error("No se pudo obtener el video");

      const file = path.join(tmp, `${Date.now()}_vid.mp4`);
      const dl = await axios.get(urlVideo, { responseType: "stream" });
      await streamPipe(dl.data, fs.createWriteStream(file));

      await conn.sendMessage(msg.key.remoteJid, { video: fs.readFileSync(file), mimetype: "video/mp4", fileName: `${title}.mp4`, caption: `🎬 Aquí tienes tu video~ 💫\n© La Suki Bot` }, { quoted: msg });

      fs.unlinkSync(file);
    }

  } catch (e) {
    console.error("Error en play2:", e);
    await conn.sendMessage(msg.key.remoteJid, { text: "❌ Error al descargar el contenido." }, { quoted: msg });
  }
};