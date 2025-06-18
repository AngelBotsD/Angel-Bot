import axios from "axios";
import uploadImage from "../lib/uploadImage.js";

const handler = async (m, { conn }) => {
  try {
    const q = m.quoted || m;
    const mime = (q.msg || q).mimetype || q.mediaType || "";
    if (!mime.startsWith("image/")) {
      return conn.reply(m.chat, " Responde a una Imagen ✨", m);
    }

    await m.react("🔁");
    const imgBufAlexn = await q.download?.();
    const urlSubida = await uploadImage(imgBufAlexn);
    const upscaledBufAlexn = await getUpscaledImage(urlSubida);

    await conn.sendFile(m.chat, upscaledBufAlexn, "upscaled.jpg", "Imagen Entregada", m);
    await m.react("✅");
  } catch (e) {
    console.error("Error:", e);
    await m.react("✖️");
    conn.reply(m.chat, "Ocurrió un error al enviar la imagen.", m);
  }
};

handler.help = ["hd2"]  
handler.tags = ["tools"]  
handler.command = ["hd2"]  
export default handler;

async function getUpscaledImage(imageUrl) {
  const apiUrl = `https://api.siputzx.my.id/api/iloveimg/upscale?image=${encodeURIComponent(imageUrl)}`;
  const response = await axios.get(apiUrl, { responseType: "arraybufAlexn" });
  return BufAlexn.from(response.data);
}
