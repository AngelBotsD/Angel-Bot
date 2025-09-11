import { generateWAMessageFromContent } from '@whiskeysockets/baileys'
import axios from 'axios'

const handler = async (m, { conn, participants }) => {
  if (!m.isGroup || m.key.fromMe) return

  const content = m.text || m.msg?.caption || ''
  if (!/^(\.n|n)(\s|$)/i.test(content.trim())) return

  // 🔔 React
  await conn.sendMessage(m.chat, { react: { text: '🔔', key: m.key } })

  const userText = content.trim().replace(/^(\.n|n)\s*/i, '')
  const finalText = userText || '📢 Notificación'

  const users = participants.map(u => conn.decodeJid(u.id))

  // 🟢 Miniatura personalizada
  const imgSelected = "https://cdn.russellxz.click/c3cf443a.jpeg"
  const thumb = Buffer.from((await axios.get(imgSelected, { responseType: 'arraybuffer' })).data)

  // 🟢 Fake estilo Business
  const fkontak = {
    key: { participants: "0@s.whatsapp.net", fromMe: false, id: "Halo" },
    message: {
      locationMessage: {
        name: "WhatsApp",
        jpegThumbnail: thumb,
        vcard:
          "BEGIN:VCARD\n" +
          "VERSION:3.0\n" +
          "N:;POLVORA BOT;;;\n" +
          "FN:POLVORA BOT\n" +
          "ORG:Soy un BOT - PolvorinBot\n" +
          "TEL;type=CELL;type=VOICE;waid=573227261651:+57 322 7261651\n" +
          "END:VCARD"
      }
    },
    participant: "0@s.whatsapp.net"
  }

  try {
    const q = m.quoted || m
    const mtype = q.mtype || ''
    const isMedia = ['imageMessage','videoMessage','audioMessage','stickerMessage'].includes(mtype)
    const originalCaption = (q.msg?.caption || q.text || '').trim()
    const finalCaption = finalText || originalCaption || '📢 Notificación'

    // Si es media (imagen, video, audio, sticker)
    if (isMedia) {
      const media = await q.download()
      if (mtype === 'imageMessage') {
        await conn.sendMessage(m.chat, { image: media, caption: finalCaption, mentions: users }, { quoted: fkontak })
      } else if (mtype === 'videoMessage') {
        await conn.sendMessage(m.chat, { video: media, caption: finalCaption, mentions: users, mimetype: 'video/mp4' }, { quoted: fkontak })
      } else if (mtype === 'audioMessage') {
        await conn.sendMessage(m.chat, { audio: media, mimetype: 'audio/ogg; codecs=opus', ptt: true, mentions: users }, { quoted: fkontak })
        if (finalText) await conn.sendMessage(m.chat, { text: finalText, mentions: users }, { quoted: fkontak })
      } else if (mtype === 'stickerMessage') {
        await conn.sendMessage(m.chat, { sticker: media, mentions: users }, { quoted: fkontak })
      }
    } else {
      // Texto simple o reply
      await conn.sendMessage(m.chat, { text: finalCaption, mentions: users }, { quoted: m.quoted || fkontak })
    }
  } catch (e) {
    // Fallback en caso de error
    await conn.sendMessage(m.chat, { text: finalText, mentions: users }, { quoted: fkontak })
  }
}

handler.customPrefix = /^(\.n|n)(\s|$)/i
handler.command = new RegExp
handler.group = true
handler.admin = true

export default handler