import fs from "fs"

let handler = async (m, { conn }) => {
  m.react('🌐')

  let texto = `🪙 𝐌 𝐔 𝐋 𝐓 𝐈 - 𝐌 𝐄 𝐍 𝐔́ 

      「 *📚 𝘐𝘯𝘧𝘰 📚* 」  
┣━━━━━━━━━━━━━━┫
┃⋗ 👤 *.owner*  
┃⋗ 📜 *.menu*  
┃⋗ 🏓 *.ping* 
┗━━━━━━━━━━━━━━┛
... (todo tu menú aquí)
`

  let img = './src/img/catalogo.jpg'
  let icono = fs.readFileSync('./src/img/catalogo.jpg')

  await conn.sendMessage(m.chat, {
    image: { url: img },
    caption: texto,
    contextInfo: {
      externalAdReply: {
        title: "📌 Menú Principal",
        body: "🌐 BakiBot Activo",
        thumbnail: icono,
        sourceUrl: "https://instagram.com/bakibot",
        mediaType: 1,
        renderLargerThumbnail: false
      }
    }
  }, { quoted: m })

  global.db.data.users[m.sender].lastcofre = new Date * 1
}

handler.customPrefix = /^(\.menu|menu)$/i
handler.command = new RegExp
export default handler