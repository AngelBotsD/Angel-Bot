import fs from "fs";

let handler = async (m, { conn }) => {
  // Cargar la imagen fija
  const thumbPath = './src/img/catalogo.jpg';
  const thumb = fs.existsSync(thumbPath) ? fs.readFileSync(thumbPath) : null;

  if (!m.quoted) {
    return conn.sendMessage(m.chat, {
      text: `*🗡️ 𝚁𝚎𝚜𝚙𝚘𝚗𝚍𝚎 𝙰𝚕 𝙼𝚎𝚗𝚜𝚊𝚓𝚎 𝚚𝚞𝚎 𝚍𝚎𝚜𝚎𝚊𝚜 𝙴𝚕𝚒𝚖𝚒𝚗𝚊𝚛*`,
      contextInfo: {
        externalAdReply: {
          title: "𝙱𝙰𝙺𝙸 - 𝙱𝙾𝚃",
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
        text: '*🥹 𝙳𝚎𝚜𝚊𝚏𝚘𝚛𝚝𝚞𝚗𝚊𝚍𝚊𝚖𝚎𝚗𝚝𝚎 𝙽𝚘 𝚜𝚎 𝚙𝚞𝚎𝚍𝚘 𝙴𝚕𝚒𝚖𝚒𝚗𝚊𝚛 𝙴𝚕 𝙼𝚎𝚗𝚜𝚊𝚓𝚎*',
        contextInfo: {
          externalAdReply: {
            title: "𝙱𝙰𝙺𝙸 - 𝙱𝙾𝚃",
            body: "",
            thumbnail: thumb,
            sourceUrl: ""
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