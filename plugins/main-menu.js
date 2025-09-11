import fs from 'fs'

let handler = async (m, { isPrems, conn }) => {
  m.react('🌐')

  let img = './src/img/catalogo.jpg'; 
  let texto = `🪙 𝐌 𝐔 𝐋 𝐓 𝐈 - 𝐌 𝐄 𝐍 𝐔́ 

      「 *📚 𝘐𝘯𝘧𝘰 📚* 」  
┣━━━━━━━━━━━━━━┫
┃⋗ 👤 *.owner*  
┃⋗ 📜 *.menu*  
┃⋗ 🏓 *.ping* 
┗━━━━━━━━━━━━━━┛
...
(👆 aquí sigue todo tu texto del menú sin cambios)
`

  await conn.sendMessage(m.chat, {
    image: { url: img },
    caption: texto,
    contextInfo: {
      externalAdReply: {
        title: "📌 Menú Principal",
        body: "🌐 Tu bot activo",
        thumbnail: fs.readFileSync('./src/img/catalogo.jpg'),
        sourceUrl: '', // opcional: si quieres que redireccione a un link
        mediaType: 1,
        renderLargerThumbnail: true
      }
    }
  }, { quoted: m })

  global.db.data.users[m.sender].lastcofre = new Date * 1
}

handler.customPrefix = /^(\.menu|menu)$/i
handler.command = new RegExp 
export default handler