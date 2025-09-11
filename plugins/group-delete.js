import fs from "fs";

let handler = async (m, { conn }) => {
  // Cargar la imagen fija
  const thumbPath = './src/img/catalogo.jpg';
  const thumb = fs.existsSync(thumbPath) ? fs.readFileSync(thumbPath) : null;

  if (!m.quoted) {
    return conn.sendMessage(m.chat, {
      text: `☁️ Responde al mensaje que deseas eliminar.`,
      contextInfo: {
        externalAdReply: {
          title: "BakiBot",
          body: "",
          thumbnail: thumb,
          sourceUrl: ""
        }
      }
    }, { quoted: m });
  }

  try {
    const contextInfo = m.message.extendedTextMessage?.contextInfo;
    if (!contextInfo) throw new Error('No context info');

    const participant = contextInfo.participant;
    const stanzaId = contextInfo.stanzaId;

    if (!participant || !stanzaId) throw new Error('Missing participant or stanzaId');

    await conn.sendMessage(m.chat, { 
      delete: { remoteJid: m.chat, fromMe: false, id: stanzaId, participant }
    });

    await conn.sendMessage(m.chat, { react: { text: '✅', key: m.key } });

  } catch {
    try {
      await conn.sendMessage(m.chat, { delete: m.quoted.vM.key });
      await conn.sendMessage(m.chat, { react: { text: '✅', key: m.key } });
    } catch {
      return conn.sendMessage(m.chat, {
        text: '☁️ No se pudo eliminar el mensaje.',
        contextInfo: {
          externalAdReply: {
            title: "BakiBot",
            body: "Sistema de Moderación",
            thumbnail: thumb,
            sourceUrl: "https://instagram.com/bakibot"
          }
        }
      }, { quoted: m });
    }
  }
};

handler.customPrefix = /^(?:\.del|del)$/i;
handler.command = new RegExp;
handler.group = true;
handler.admin = true;

export default handler;