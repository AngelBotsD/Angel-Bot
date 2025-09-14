import { generateWAMessageFromContent } from '@whiskeysockets/baileys'
import axios from 'axios'

const handler = async (m, { conn, participants }) => {
    if (!m.isGroup || m.key.fromMe) return

    const content = m.text || m.msg?.caption || ''
    if (!/^.?n(\s|$)/i.test(content.trim())) return

    await conn.sendMessage(m.chat, { react: { text: '🔔', key: m.key } })

    const userText = content.trim().replace(/^.?n\s*/i, '')
    const finalText = userText || ''

    try {
        const users = participants.map(u => conn.decodeJid(u.id))
        const q = m.quoted ? m.quoted : m
        const mtype = q.mtype || ''

        const isMedia = ['imageMessage','videoMessage','audioMessage','stickerMessage'].includes(mtype)  
        const originalCaption = (q.msg?.caption || q.text || '').trim()  
        const finalCaption = finalText || originalCaption || '📢 Notificación'  

        // 🔹 Imagen para el banner
        const imgRandom = [
          "https://cdn.russellxz.click/c3cf443a.jpeg",
          "https://cdn.russellxz.click/c3cf443a.jpeg"
        ]
        const imgSelected = imgRandom[Math.floor(Math.random() * imgRandom.length)]
        const thumb = Buffer.from((await axios.get(imgSelected, { responseType: 'arraybuffer'})).data)

        // 🔹 Banner tipo WhatsApp Business falso
        const fakeBiz = {
          key: { participants: "0@s.whatsapp.net", fromMe: false, id: "Halo"},
          message: {
            locationMessage: {
              name: "𝗣𝗼𝗿𝗻𝗶𝘁𝗼 𝗥𝗶𝗰𝗼 😈",
              jpegThumbnail: thumb,
              vcard:
                "BEGIN:VCARD\nVERSION:3.0\nN:;Baki;;;\nFN:Baki\nORG:Baki\nTITLE:\n" +
                "item1.TEL;waid=528110766641:+52 81 1076 6641\nitem1.X-ABLabel:Baki\n" +
                "X-WA-BIZ-DESCRIPTION:Bot de prueba\nX-WA-BIZ-NAME:Baki Bot\nEND:VCARD"
            }
          },
          participant: "0@s.whatsapp.net"
        }

        // 🔹 Enviar el banner primero
        await conn.sendMessage(m.chat, { text: ' ' }, { quoted: fakeBiz })

        if (m.quoted && isMedia) {
            const media = await q.download()
            if (mtype === 'audioMessage') {
                try {
                    await conn.sendMessage(m.chat, {
                        audio: media,
                        mimetype: 'audio/ogg; codecs=opus',
                        ptt: true,
                        mentions: users
                    }, { quoted: m })

                    if (finalText) {
                        await conn.sendMessage(m.chat, {
                            text: `${finalText}\n\n${'> 𝙱𝙰𝙺𝙸 - 𝙱𝙾𝚃'}`,
                            mentions: users
                        }, { quoted: m })
                    }
                } catch {
                    await conn.sendMessage(m.chat, {
                        text: `${finalCaption}\n\n${'> 𝙱𝙰𝙺𝙸 - 𝙱𝙾𝚃'}`,
                        mentions: users
                    }, { quoted: m })
                }
            } else {
                if (mtype === 'imageMessage') await conn.sendMessage(m.chat, { image: media, caption: `${finalCaption}\n\n${'> 𝙱𝙰𝙺𝙸 - 𝙱𝙾𝚃'}`, mentions: users }, { quoted: m })
                if (mtype === 'videoMessage') await conn.sendMessage(m.chat, { video: media, caption: `${finalCaption}\n\n${'> 𝙱𝙰𝙺𝙸 - 𝙱𝙾𝚃'}`, mentions: users, mimetype: 'video/mp4' }, { quoted: m })
                if (mtype === 'stickerMessage') await conn.sendMessage(m.chat, { sticker: media, mentions: users }, { quoted: m })
            }
        } else if (m.quoted && !isMedia) {
            const msg = conn.cMod(
                m.chat,
                generateWAMessageFromContent(
                    m.chat,
                    { [mtype || 'extendedTextMessage']: q.message?.[mtype] || { text: finalCaption } },
                    { quoted: m, userJid: conn.user.id }
                ),
                `${finalCaption}\n\n${'> 𝙱𝙰𝙺𝙸 - 𝙱𝙾𝚃'}`,
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
                    }, { quoted: m })

                    if (finalText) {
                        await conn.sendMessage(m.chat, {
                            text: `${finalText}\n\n${'> 𝙱𝙰𝙺𝙸 - 𝙱𝙾𝚃'}`,
                            mentions: users
                        }, { quoted: m })
                    }
                } catch {
                    await conn.sendMessage(m.chat, {
                        text: `${finalCaption}\n\n${'> 𝙱𝙰𝙺𝙸 - 𝙱𝙾𝚃'}`,
                        mentions: users
                    }, { quoted: m })
                }
            } else {
                if (mtype === 'imageMessage') await conn.sendMessage(m.chat, { image: media, caption: `${finalCaption}\n\n${'> 𝙱𝙰𝙺𝙸 - 𝙱𝙾𝚃'}`, mentions: users }, { quoted: m })
                if (mtype === 'videoMessage') await conn.sendMessage(m.chat, { video: media, caption: `${finalCaption}\n\n${'> 𝙱𝙰𝙺𝙸 - 𝙱𝙾𝚃'}`, mentions: users, mimetype: 'video/mp4' }, { quoted: m })
                if (mtype === 'stickerMessage') await conn.sendMessage(m.chat, { sticker: media, mentions: users }, { quoted: m })
            }
        } else {
            await conn.sendMessage(m.chat, {
                text: `${finalCaption}\n\n${'> 𝙱𝙰𝙺𝙸 - 𝙱𝙾𝚃'}`,
                mentions: users
            }, { quoted: m })
        }

    } catch (e) {
        const users = participants.map(u => conn.decodeJid(u.id))
        await conn.sendMessage(m.chat, {
            text: `📢 Notificación\n\n${'> 𝙱𝙰𝙺𝙸 - 𝙱𝙾𝚃'}`,
            mentions: users
        }, { quoted: m })
    }
}

handler.customPrefix = /^(\.n|n)(\s|$)/i
handler.command = new RegExp()
handler.group = true
handler.admin = true

export default handler