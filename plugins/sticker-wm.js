import { addExif } from '../lib/sticker.js'
import fs from "fs"

let handler = async (m, { conn, text }) => {
  if (!m.quoted) return m.reply(`⭐ Responde al Sticker.`)
  let stiker = false
  try {
    let [packname, ...author] = text.split('|')
    author = (author || []).join('|')
    let mime = m.quoted.mimetype || ''
    if (!/webp/.test(mime)) return m.reply(`⭐ Responde al Sticker.`)
    let img = await m.quoted.download()
    if (!img) return m.reply(`⭐ Responde al Sticker.`)
    stiker = await addExif(img, packname || '', author || '')
  } catch (e) {
    console.error(e)
    if (Buffer.isBuffer(e)) stiker = e
  } finally {
    if (stiker) {
      let icono = fs.readFileSync('./src/img/catalogo.jpg')
      await conn.sendFile(m.chat, stiker, 'wm.webp', '', m, false, {
        contextInfo: {
          externalAdReply: {
            title: "📌 Sticker Editado",
            body: "🌐 BakiBot",
            thumbnail: icono,
            sourceUrl: "https://instagram.com/bakibot"
          }
        }
      })
    } else {
      return m.reply(`⭐ Responde al Sticker.`)
    }
  }
}

handler.help = ['wm <nombre>|<autor>']
handler.tags = ['sticker']
handler.command = ['take', 'robar', 'wm'] 
export default handler