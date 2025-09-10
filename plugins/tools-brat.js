const handler = async (m, { conn, args }) => {
  if (!args[0]) {
    return m.reply(`𝐀𝐠𝐫𝐞𝐠𝐚 𝐓𝐞𝐱𝐭𝐨 𝐏𝐚𝐫𝐚 𝐆𝐞𝐧𝐞𝐫𝐚𝐫 𝐄𝐥 𝐒𝐭𝐢𝐜𝐤𝐞𝐫 ☁️`)
  }

  try {
    // Reacción ⌛ al mensaje original
    await conn.sendMessage(m.chat, {
      react: {
        text: '⌛',
        key: m.key
      }
    })

    const url = `https://api.siputzx.my.id/api/m/brat?text=${encodeURIComponent(args.join(' '))}`
    await conn.sendMessage(m.chat, {
      sticker: { url },
      packname: '',
      author: '',
    }, { quoted: m })

    // Reemplaza ⌛ por ✅
    await conn.sendMessage(m.chat, {
      react: {
        text: '✅',
        key: m.key
      }
    })
  } catch (e) {
    console.error(e)
    conn.reply(m.chat, '𝐇𝐮𝐛𝐨 𝐔𝐧 𝐄𝐫𝐫𝐨𝐫 𝐀𝐥 𝐆𝐞𝐧𝐞𝐫𝐚𝐫 𝐄𝐥 𝐒𝐭𝐢𝐜𝐤𝐞𝐫 ❌', m)
  }
}

handler.command = /^brat$/i
handler.help = ['brat <texto>']
handler.tags = ['sticker']

export default handler