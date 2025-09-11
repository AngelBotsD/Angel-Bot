import { generateWAMessageFromContent } from '@whiskeysockets/baileys'
import * as fs from 'fs'

var handler = async (m, { conn, text, participants }) => {
    let users = participants.map(u => conn.decodeJid(u.id))
    let quoted = m.quoted ? m.quoted : m
    let mime = (quoted.msg || quoted).mimetype || ''
    let isMedia = /image|video|sticker|audio/.test(mime)
    let htextos = text || ''

    if (isMedia && quoted.mtype === 'imageMessage') {
        let mediax = await quoted.download?.()
        conn.sendMessage(m.chat, { image: mediax, mentions: users, caption: htextos }, { quoted: m })

    } else if (isMedia && quoted.mtype === 'videoMessage') {
        let mediax = await quoted.download?.()
        conn.sendMessage(m.chat, { video: mediax, mentions: users, mimetype: 'video/mp4', caption: htextos }, { quoted: m })

    } else if (isMedia && quoted.mtype === 'audioMessage') {
        let mediax = await quoted.download?.()
        conn.sendMessage(m.chat, { audio: mediax, mentions: users, mimetype: 'audio/mp4', fileName: 'Hidetag.mp3' }, { quoted: m })

    } else if (isMedia && quoted.mtype === 'stickerMessage') {
        let mediax = await quoted.download?.()
        conn.sendMessage(m.chat, { sticker: mediax, mentions: users }, { quoted: m })

    } else {
        // Texto plano o mensaje citado
        await conn.relayMessage(
            m.chat, 
            { extendedTextMessage: { text: htextos, contextInfo: { mentionedJid: users }}}, 
            {}
        )
    }
}

handler.command = /^(hidetag|notificar|notify|viso|n)$/i
handler.group = true
handler.admin = true
export default handler