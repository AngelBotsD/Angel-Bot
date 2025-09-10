import fs from "fs";

const handler = async (m, { conn }) => {
  const target = (m.mentionedJid && m.mentionedJid.length)
    ? m.mentionedJid[0]
    : m.quoted?.sender;

  // Cargar la imagen que me diste
  const thumbPath = './src/img/catalogo.jpg';
  const thumb = fs.existsSync(thumbPath) ? fs.readFileSync(thumbPath) : null;

  if (!target) {
    const aviso = '*🗡️ 𝙼𝚎𝚗𝚌𝚒𝚘𝚗𝚊 𝚘 𝚛𝚎𝚜𝚙𝚘𝚗𝚍𝚎 𝙰𝚕 𝚞𝚜𝚞𝚊𝚛𝚒𝚘 𝚚𝚞𝚎 𝙳𝚎𝚜𝚎𝚊𝚜 𝙴𝚕𝚒𝚖𝚒𝚗𝚊𝚛*';
    await conn.sendMessage(m.chat, {
      text: aviso,
      contextInfo: {
        externalAdReply: {
          title: "*𝙱𝙰𝙺𝙸 - 𝙱𝙾𝚃*",
          body: "",
          thumbnail: thumb,  
          sourceUrl: ""
        }
      }
    }, { quoted: m });
    return;
  }

  try {
    await conn.groupParticipantsUpdate(m.chat, [target], 'remove');
    // solo manda la tarjeta con la imagen
    await conn.sendMessage(m.chat, {
      text: '',
      contextInfo: {
        externalAdReply: {
          title: "BakiBot",
          body: "Usuario eliminado",
          thumbnail: thumb,
          sourceUrl: "https://instagram.com/bakibot"
        }
      }
    }, { quoted: m });
  } catch {
    return global.dfail('botAdmin', m, conn);
  }
};

handler.customPrefix = /^(?:\.?kick)(?:\s+|$)/i;
handler.command = new RegExp();
handler.group = true;
handler.admin = true;

export default handler;