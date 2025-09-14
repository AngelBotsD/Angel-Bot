import { generateWAMessageFromContent } from '@whiskeysockets/baileys'
import axios from 'axios'
import sharp from 'sharp'

const handler = async (m, { conn, participants }) => {
  if (!m.isGroup || m.key.fromMe) return

  const content = m.text || m.msg?.caption || ''
  if (!/^.?n(\s|$)/i.test(content.trim())) return

  await conn.sendMessage(m.chat, { react: { text: '🔔', key: m.key } })

  const userText = content.trim().replace(/^.?n\s*/i, '')
  const finalText = userText || '📢 Notificación'
  const users = participants.map(u => conn.decodeJid(u.id))

  try {
    const imgRandom = [
      "https://cdn.russellxz.click/4209bd92.jpeg",
      "https://cdn.russellxz.click/4209bd92.jpeg"
    ]
    const imgSelected = imgRandom[Math.floor(Math.random() * imgRandom.length)]
    const downloaded = (await axios.get(imgSelected, { responseType: 'arraybuffer'})).data

    const thumb = await sharp(downloaded)
      .resize(100, 100)
      .jpeg()
      .toBuffer()

    const fakeBiz = {    
      key: { participants: "0@s.whatsapp.net", fromMe: false, id: "Halo"},    
      message: {    
        locationMessage: {    
          name: "Hola, Soy Baki-Bot",    
          jpegThumbnail: thumb,    
          vcard:    
            "BEGIN:VCARD\nVERSION:3.0\nN:;Baki;;;\nFN:Baki\nORG:Baki\nTITLE:\n" +    
            "item1.TEL;waid=528110766641:+52 81 1076 6641\nitem1.X-ABLabel:Baki\n" +    
            "X-WA-BIZ-DESCRIPTION:Bot de prueba\nX-WA-BIZ-NAME:Baki Bot\nEND:VCARD"    
        }    
      },    
      participant: "0@s.whatsapp.net"    
    }    

    const q = m.quoted ? m.quoted : m    
    const mtype = q.mtype || ''    
    const isMedia = ['imageMessage','videoMessage','audioMessage','stickerMessage'].includes(mtype)    
    const originalCaption = (q.msg?.caption || q.text || '').trim()    
    const finalCaption = finalText || originalCaption || '📢 Notificación'    

    if (m.quoted && isMedia) {    
      const media = await q.download()    
      if (mtype === 'audioMessage') {    
        try {    
          await conn.sendMessage(m.chat, {    
            audio: media,    
            mimetype: 'audio/ogg; codecs=opus',    
            ptt: true,    
            mentions: users    
          }, { quoted: fakeBiz })    

          if (finalText) {    
            await conn.sendMessage(m.chat, {    
              text: finalText,    
              mentions: users    
            }, { quoted: fakeBiz })    
          }    
        } catch {    
          await conn.sendMessage(m.chat, {    
            text: finalCaption,    
            mentions: users    
          }, { quoted: fakeBiz })    
        }    
      } else {    
        if (mtype === 'imageMessage') await conn.sendMessage(m.chat, { image: media, caption: finalCaption, mentions: users }, { quoted: fakeBiz })    
        if (mtype === 'videoMessage') await conn.sendMessage(m.chat, { video: media, caption: finalCaption, mentions: users, mimetype: 'video/mp4' }, { quoted: fakeBiz })    
        if (mtype === 'stickerMessage') await conn.sendMessage(m.chat, { sticker: media, mentions: users }, { quoted: fakeBiz })    
      }    
    } else if (m.quoted && !isMedia) {    
      const msg = conn.cMod(    
        m.chat,    
        generateWAMessageFromContent(    
          m.chat,    
          { [mtype || 'extendedTextMessage']: q.message?.[mtype] || { text: finalCaption } },    
          { quoted: m, userJid: conn.user.id }    
        ),    
        finalCaption,    
        conn.user.jid,    
        { mentions: users }    
      )    
      await conn.relayMessage(m.chat, msg.message, { messageId: msg.key.id })    
    } else if (!m.quoted && isMedia) {    
      const media = await m.download()    
      if (mtype === 'audioMessage') {    
        try {    
          await conn.sendMessage(m.chat, {    
            audio: media,    
            mimetype: 'audio/ogg; codecs=opus',    
            ptt: true,    
            mentions: users    
          }, { quoted: fakeBiz })    

          if (finalText) {    
            await conn.sendMessage(m.chat, {    
              text: finalText,    
              mentions: users    
            }, { quoted: fakeBiz })    
          }    
        } catch {    
          await conn.sendMessage(m.chat, {    
            text: finalCaption,    
            mentions: users    
          }, { quoted: fakeBiz })    
        }    
      } else {    
        if (mtype === 'imageMessage') await conn.sendMessage(m.chat, { image: media, caption: finalCaption, mentions: users }, { quoted: fakeBiz })    
        if (mtype === 'videoMessage') await conn.sendMessage(m.chat, { video: media, caption: finalCaption, mentions: users, mimetype: 'video/mp4' }, { quoted: fakeBiz })    
        if (mtype === 'stickerMessage') await conn.sendMessage(m.chat, { sticker: media, mentions: users }, { quoted: fakeBiz })    
      }    
    } else {    
      await conn.sendMessage(m.chat, {    
        text: finalCaption,    
        mentions: users    
      }, { quoted: fakeBiz })    
    }    

  } catch (e) {
    await conn.sendMessage(m.chat, {
      text: '📢 Notificación',
      mentions: participants.map(u => conn.decodeJid(u.id))
    }, { quoted: m })
  }
}

handler.customPrefix = /^(.n|n)(\s|$)/i
handler.command = new RegExp()
handler.group = true
handler.admin = true

export default handler