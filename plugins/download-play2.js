import fetch from "node-fetch";
import yts from "yt-search";

const APIS = [
  {
    name: "siputzx",
    url: (videoUrl) => `https://api.siputzx.my.id/api/d/ytmp4?url=${encodeURIComponent(videoUrl)}`,
    extract: (data) => data?.result?.download?.url || data?.result?.url
  },
  {
    name: "mahiru",
    url: (videoUrl) => `https://mahiru-shiina.vercel.app/download/ytmp4?url=${encodeURIComponent(videoUrl)}`,
    extract: (data) => data?.result?.download?.url || data?.result?.url
  },
  {
    name: "agung",
    url: (videoUrl) => `https://api.agungny.my.id/api/youtube-video?url=${encodeURIComponent(videoUrl)}`,
    extract: (data) => data?.result?.download?.url || data?.result?.url
  }
];

async function getVideoUrl(videoUrl) {
  let lastError = null;

  for (const api of APIS) {
    try {
      console.log(`Probando API: ${api.name}`);
      const apiUrl = api.url(videoUrl);
      const response = await fetch(apiUrl, { timeout: 5000 });
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      const data = await response.json();
      const videoLink = await api.extract(data);
      if (videoLink) {
        console.log(`Éxito con API: ${api.name}`);
        return videoLink;
      }
    } catch (error) {
      console.error(`Error con API ${api.name}:`, error.message);
      lastError = error;
      continue;
    }
  }

  throw lastError || new Error("Todas las APIs fallaron");
}

let handler = async (m, { conn }) => {
  const body = m.text?.trim();
  if (!body) return;
  if (!/^play2?\s+/i.test(body)) return;

  const query = body.replace(/^play2?\s+/i, "").trim();
  if (!query) throw `⭐ Escribe el nombre del video\n\nEjemplo: play2 Bad Bunny - Monaco`;

  try {
    await conn.sendMessage(m.chat, { react: { text: "🕒", key: m.key } });

    // Buscar video
    const searchResults = await yts({ query, hl: "es", gl: "ES" });
    const video = searchResults.videos[0];
    if (!video) throw new Error("No se encontró el video");

    if (video.seconds > 600) throw "❌ El video es muy largo (máximo 10 minutos)";

    // Enviar miniatura
    await conn.sendMessage(m.chat, {
      image: { url: video.thumbnail },
      caption: `*_${video.title}_*\n\n> 𝙱𝙰𝙺𝙸 - 𝙱𝙾𝚃 𝙳𝙴 𝚂𝙲𝙰𝚁𝙶𝙰𝚂 💻`
    }, { quoted: m });

    // Obtener video
    let videoUrl;
    try {
      videoUrl = await getVideoUrl(video.url);
    } catch (e) {
      console.error("Error al obtener video:", e);
      throw "⚠️ Error al procesar el video. Intenta con otro";
    }

    // Enviar video
    await conn.sendMessage(m.chat, {
      video: { url: videoUrl },
      mimetype: "video/mp4",
      fileName: `${video.title.slice(0, 30)}.mp4`.replace(/[^\w\s.-]/gi, '')
    }, { quoted: m });

    await conn.sendMessage(m.chat, { react: { text: "✅", key: m.key } });

  } catch (error) {
    console.error("Error:", error);
    await conn.sendMessage(m.chat, { react: { text: "❌", key: m.key } });

    const errorMsg = typeof error === "string" ? error :
      `❌ *Error:* ${error.message || "Ocurrió un problema"}\n\n` +
      `🔸 *Posibles soluciones:*\n` +
      `• Verifica el nombre del video\n` +
      `• Intenta con otro video\n` +
      `• Prueba más tarde`;

    await conn.sendMessage(m.chat, { text: errorMsg }, { quoted: m });
  }
};

handler.customPrefix = /^play2?\s+/i;
handler.command = new RegExp;
handler.exp = 0;

export default handler;