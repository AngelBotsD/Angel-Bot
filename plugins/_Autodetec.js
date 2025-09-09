let WAMessageStubType = (await import(global.baileys)).default
import { readdirSync, unlinkSync, existsSync, promises as fs, rmSync } from 'fs';
import path from 'path';

export async function before(m, { conn, participants}) {
  if (!m.messageStubType || !m.isGroup) return
  let usuario = `@${m.sender.split`@`[0]}`
  let fkontak = { "key": { "participants":"0@s.whatsapp.net", "remoteJid": "status@broadcast", "fromMe": false, "id": "Halo" }, "message": { "contactMessage": { "vcard": `BEGIN:VCARD\nVERSION:3.0\nN:Sy;Bot;;;\nFN:y\nitem1.TEL;waid=${m.sender.split('@')[0]}:${m.sender.split('@')[0]}\nitem1.X-ABLabel:Ponsel\nEND:VCARD` }}, "participant": "0@s.whatsapp.net" }
  let chat = global.db.data.chats[m.chat]
  let users = participants.map(u => conn.decodeJid(u.id))
  const groupAdmins = participants.filter(p => p.admin)
  const listAdmin = groupAdmins.map((v, i) => `*» ${i + 1}. @${v.id.split('@')[0]}*`).join('\n')

  if (chat.detect && m.messageStubType == 2) {

    const chatId = m.isGroup ? m.chat : m.sender;
    const uniqid = chatId.split('@')[0];
    const sessionPath = './BakoSession/';
    const files = await fs.readdir(sessionPath);
    let filesDeleted = 0;
    for (const file of files) {
      if (file.includes(uniqid)) {
        await fs.unlink(path.join(sessionPath, file));
        filesDeleted++;
        console.log(`⚠️ Eliminación session (PreKey) que provocan el undefined en el chat`);
      }
    }
  } else if (chat.detect && m.messageStubType == 21) {
    await this.sendMessage(m.chat, { text: `${usuario} \`𝙷𝙰 𝙲𝙰𝙼𝙱𝙸𝙰𝙳𝙾 𝙴𝙻 𝙽𝙾𝙼𝙱𝚁𝙴 𝙳𝙴𝙻 𝙶𝚁𝚄𝙿𝙾 𝙰:\`\n\n> *${m.messageStubParameters[0]}*`, mentions: [m.sender], mentions: [...groupAdmins.map(v => v.id)] }, { quoted: fkontak, ephemeralExpiration: 24*60*100, disappearingMessagesInChat: 24*60*100})
  } else if (chat.detect && m.messageStubType == 22) {
    await this.sendMessage(m.chat, { text: `${usuario} \`𝙷𝙰 𝙲𝙰𝙼𝙱𝙸𝙰𝙳𝙾 𝙻𝙰 𝙵𝙾𝚃𝙾 𝙳𝙴𝙻 𝙶𝚁𝚄𝙿𝙾\``, mentions: [m.sender] }, { quoted: fkontak, ephemeralExpiration: 24*60*100, disappearingMessagesInChat: 24*60*100}) 
  } else if (chat.detect && m.messageStubType == 24) {
    await this.sendMessage(m.chat, { text: `${usuario} > 𝙽𝚄𝙴𝚅𝙰 𝙳𝙴𝚂𝙲𝚁𝙸𝙿𝙲𝙸𝙾́𝙽:\n\n${m.messageStubParameters[0]}`, mentions: [m.sender] }, { quoted: fkontak, ephemeralExpiration: 24*60*100, disappearingMessagesInChat: 24*60*100})
  } else if (chat.detect && m.messageStubType == 25) {
    await this.sendMessage(m.chat, { text: `📌 𝙰𝙷𝙾𝚁𝙰 *${m.messageStubParameters[0] == 'on' ? '𝚂𝙾𝙻𝙾 𝙰𝙳𝙼𝙸𝙽𝚂' : '𝚃𝙾𝙳𝙾𝚂'}* 𝙿𝚄𝙴𝙳𝙴𝙽 𝙴𝙳𝙸𝚃𝙰𝚁 𝙻𝙰 𝙸𝙽𝙵𝙾𝚁𝙼𝙰𝙲𝙸𝙾́𝙽 𝙳𝙴𝙻 𝙶𝚁𝚄𝙿𝙾`, mentions: [m.sender] }, { quoted: fkontak, ephemeralExpiration: 24*60*100, disappearingMessagesInChat: 24*60*100})
  } else if (chat.detect && m.messageStubType == 26) {
    await this.sendMessage(m.chat, { text: `𝙶𝚁𝚄𝙿𝙾 *${m.messageStubParameters[0] == 'on' ? '𝙲𝙴𝚁𝚁𝙰𝙳𝙾 🔒' : '𝙰𝙱𝙸𝙴𝚁𝚃𝙾 🔓'}*\n ${m.messageStubParameters[0] == 'on' ? '𝚂𝙾𝙻𝙾 𝙰𝙳𝙼𝙸𝙽𝚂 𝙿𝚄𝙴𝙳𝙴𝙽 𝙴𝚂𝙲𝚁𝙸𝙱𝙸𝚁' : '𝚈𝙰 𝚃𝙾𝙳𝙾𝚂 𝙿𝚄𝙴𝙳𝙴𝙽 𝙴𝚂𝙲𝚁𝙸𝙱𝙸𝚁'} 𝙴𝙽 𝙴𝚂𝚃𝙴 𝙶𝚁𝚄𝙿𝙾`, mentions: [m.sender] }, { quoted: fkontak, ephemeralExpiration: 24*60*100, disappearingMessagesInChat: 24*60*100})
  } else if (chat.detect && m.messageStubType == 29) {
    await this.sendMessage(m.chat, { text: `@${m.messageStubParameters[0].split`@`[0]} 𝙿𝚁𝙾𝙼𝙾𝚅𝙸𝙳𝙾\n\n📌 𝙰𝚄𝚃𝙾𝚁 ${usuario}`, mentions: [m.sender, m.messageStubParameters[0], ...groupAdmins.map(v => v.id)] }, { quoted: fkontak, ephemeralExpiration: 24*60*100, disappearingMessagesInChat: 24*60*100})
  } else if (chat.detect && m.messageStubType == 30) {
    await this.sendMessage(m.chat, { text: `@${m.messageStubParameters[0].split`@`[0]} 𝚁𝙴𝙼𝙾𝚅𝙸𝙳𝙾\n\n📌 𝙰𝚄𝚃𝙾𝚁 ${usuario}`, mentions: [m.sender, m.messageStubParameters[0], ...groupAdmins.map(v => v.id)] }, { quoted: fkontak, ephemeralExpiration: 24*60*100, disappearingMessagesInChat: 24*60*100})
  } else if (chat.detect && m.messageStubType == 72) {
    await this.sendMessage(m.chat, { text: `${usuario} 𝙲𝙰𝙼𝙱𝙸𝙾 𝙻𝙰 𝙳𝚄𝚁𝙰𝙲𝙸𝙾́𝙽 𝙳𝙴 𝙻𝙾𝚂 𝙼𝙴𝙽𝚂𝙰𝙹𝙴𝚂 𝚃𝙴𝙼𝙿𝙾𝚁𝙰𝙻𝙴𝚂 𝙰 *@${m.messageStubParameters[0]}*`, mentions: [m.sender] }, { quoted: fkontak, ephemeralExpiration: 24*60*100, disappearingMessagesInChat: 24*60*100})
  } else if (chat.detect && m.messageStubType == 123) {
    await this.sendMessage(m.chat, { text: `${usuario} 𝙳𝙴𝚂𝙰𝙲𝚃𝙸𝚅𝙾́ 𝙻𝙾𝚂 𝙼𝙴𝙽𝚂𝙰𝙹𝙴𝚂 𝚃𝙴𝙼𝙿𝙾𝚁𝙰𝙻𝙴𝚂.`, mentions: [m.sender] }, { quoted: fkontak, ephemeralExpiration: 24*60*100, disappearingMessagesInChat: 24*60*100})
  } else {
    console.log({messageStubType: m.messageStubType,
    messageStubParameters: m.messageStubParameters,
    type: WAMessageStubType[m.messageStubType], 
    })
  }
}