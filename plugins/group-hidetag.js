import { generateWAMessageFromContent } from '@whiskeysockets/baileys'
import axios from 'axios'

const handler = async (m, { conn, participants }) => {
  if (!m.isGroup || m.key.fromMe) return

  const content = m.text || m.msg?.caption || ''
  if (!/^.?n(\s|$)/i.test(content.trim())) return

  await conn.sendMessage(m.chat, { react: { text: '🔔', key: m.key } })

  const userText = content.trim().replace(/^.?n\s*/i, '')
  const finalText = userText || '📢 Notificación'
  const users = participants.map(u => conn.decodeJid(u.id))

  // 🟢 Miniatura personalizada
  const imgSelected = "https://cdn.russellxz.click/c3cf443a.jpeg"
  const thumb = Buffer.from((await axios.get(imgSelected, { responseType: 'arraybuffer'})).data)

  // 🟢 Fake estilo Business + icono externalAdReply
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
    const q = m.quoted ? m.quoted : m
    const mtype = q.mtype || ''
    const isMedia = ['imageMessage','videoMessage','audioMessage','stickerMessage'].includes(mtype)
    const originalCaption = (q.msg?.caption || q.text || '').trim()
    const finalCaption = finalText || originalCaption || '📢 Notificación'

    const ext = {
      contextInfo: {
        externalAdReply: {
          title: "𝐏𝐎𝐋𝐕𝐎𝐑𝐀 𝐁𝐎𝐓 🔥",
          body: "𝐏𝐎𝐋𝐕𝐎𝐑𝐀 𝐁𝐎𝐓 🔥",
          thumbnailUrl: imgSelected,
          sourceUrl: '',
          renderLargerThumbnail: true
        },
        mentionedJid: users
      }
    }

    if (m.quoted && isMedia) {
      if (mtype === 'audioMessage') {
        try {
          const media = await q.download()
          await conn.sendMessage(m.chat, { 
            audio: media, mimetype: 'audio/ogg; codecs=opus', ptt: true, mentions: users, ...ext 
          }, { quoted: fkontak })
          if (finalText) {
            await conn.sendMessage(m.chat, { text: finalText, mentions: users, ...ext }, { quoted: fkontak })
          }
        } catch {
          await conn.sendMessage(m.chat, { text: finalCaption, mentions: users, ...ext }, { quoted: fkontak })
        }
      } else {
        const media = await q.download()
        if (mtype === 'imageMessage') {
          await conn.sendMessage(m.chat, { image: media, caption: finalCaption, mentions: users, ...ext }, { quoted: fkontak })
        } else if (mtype === 'videoMessage') {
          await conn.sendMessage(m.chat, { video: media, caption: finalCaption, mentions: users, mimetype: 'video/mp4', ...ext }, { quoted: fkontak })
        } else if (mtype === 'stickerMessage') {
          await conn.sendMessage(m.chat, { sticker: media, mentions: users, ...ext }, { quoted: fkontak })
        }
      }
    } else if (m.quoted && !isMedia) {
      const msg = conn.cMod(
        m.chat,
        generateWAMessageFromContent(
          m.chat,
          { [mtype || 'extendedTextMessage']: q.message?.[mtype] || { text: finalCaption } },
          { quoted: fkontak, userJid: conn.user.id }
        ),
        finalCaption,
        conn.user.jid,
        { mentions: users }
      )
      msg.message[mtype || 'extendedTextMessage'].contextInfo = ext.contextInfo
      await conn.relayMessage(m.chat, msg.message, { messageId: msg.key.id })
    } else if (!m.quoted && isMedia) {
      if (mtype === 'audioMessage') {
        try {
          const media = await m.download()
          await conn.sendMessage(m.chat, { 
            audio: media, mimetype: 'audio/ogg; codecs=opus', ptt: true, mentions: users, ...ext 
          }, { quoted: fkontak })
          if (finalText) {
            await conn.sendMessage(m.chat, { text: finalText, mentions: users, ...ext }, { quoted: fkontak })
          }
        } catch {
          await conn.sendMessage(m.chat, { text: finalCaption, mentions: users, ...ext }, { quoted: fkontak })
        }
      } else {
        const media = await m.download()
        if (mtype === 'imageMessage') {
          await conn.sendMessage(m.chat, { image: media, caption: finalCaption, mentions: users, ...ext }, { quoted: fkontak })
        } else if (mtype === 'videoMessage') {
          await conn.sendMessage(m.chat, { video: media, caption: finalCaption, mentions: users, mimetype: 'video/mp4', ...ext }, { quoted: fkontak })
        } else if (mtype === 'stickerMessage') {
          await conn.sendMessage(m.chat, { sticker: media, mentions: users, ...ext }, { quoted: fkontak })
        }
      }
    } else {
      await conn.sendMessage(m.chat, { text: finalCaption, mentions: users, ...ext }, { quoted: fkontak })
    }
  } catch (e) {
    await conn.sendMessage(m.chat, { text: '📢 Notificación', mentions: users }, { quoted: fkontak })
  }
}

handler.customPrefix = /^(\.n|n)(\s|$)/i
handler.command = new RegExp
handler.group = true
handler.admin = true

export default handler