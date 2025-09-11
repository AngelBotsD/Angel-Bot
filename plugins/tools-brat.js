import fetch from "node-fetch"
import fs from "fs"

const handler = async (m, { conn }) => {
  const body = m.text?.trim()
  if (!body) return

  if (!/^brat|.brat\s+/i.test(body)) return

  const text = body.replace(/^(brat|.brat)\s+/i, "").trim()
  if (!text) {
    return m.reply(`☁️ 𝘼𝙂𝙍𝙀𝙂𝘼 𝙏𝙀𝙓𝙏𝙊 𝙋𝘼𝙍𝘼 𝙂𝙀𝙉𝙀𝙍𝘼𝙍 𝙀𝙇 𝙎𝙏𝙄𝘾𝙆𝙀𝙍\n\nEjemplo: brat angelito`)
  }

  try {
    await conn.sendMessage(m.chat, { react: { text: "⌛", key: m.key } })

    const url = `https://api.siputzx.my.id/api/m/brat?text=${encodeURIComponent(text)}`
    const res = await fetch(url)
    const buffer = await res.buffer()

    let icono = fs.readFileSync('./src/img/catalogo.jpg')

    await conn.sendMessage(m.chat, { 
      sticker: buffer,
      contextInfo: {
        externalAdReply: {
          title: "📌 Generador BRAT",
          body: "",
          thumbnail: icono,
          sourceUrl: ""
        }
      }
    }, { quoted: m })

    await conn.sendMessage(m.chat, { react: { text: "✅", key: m.key } })
  } catch (e) {
    console.error(e)
    await conn.sendMessage(m.chat, { react: { text: "❌", key: m.key } })
    conn.reply(m.chat, '❌ *la api está caída*', m)
  }
}

handler.customPrefix = /^(brat|.brat)\s+/i
handler.command = new RegExp
handler.help = ["brat <texto>"]
handler.tags = ["sticker"]

export default handler