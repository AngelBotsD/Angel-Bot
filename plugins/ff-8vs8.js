let partidasVS8 = {}

let handler = async (m, { conn, args }) => {
  let plantilla = `
𝟖 𝐕𝐄𝐑𝐒𝐔𝐒 𝟖

⏱ 𝐇𝐎𝐑𝐀𝐑𝐈𝐎                            •
🇲🇽 𝐌𝐄𝐗𝐈𝐂𝐎 : 
🇨🇴 𝐂𝐎𝐋𝐎𝐌𝐁𝐈𝐀 :                

➥ 𝐌𝐎𝐃𝐀𝐋𝐈𝐃𝐀𝐃: ${args[0] || ''}
➥ 𝐉𝐔𝐆𝐀𝐃𝐎𝐑𝐄𝐒:

        𝗘𝗦𝗖𝗨𝗔𝗗𝗥𝐀 1
    
    👑 ┇  
    🥷🏻 ┇  
    🥷🏻 ┇ 
    🥷🏻 ┇  
    
        𝗘𝗦𝗖𝗨𝗔𝗗𝗥𝐀 2
    
    👑 ┇  
    🥷🏻 ┇  
    🥷🏻 ┇ 
    🥷🏻 ┇ 
    
    ʚ 𝐒𝐔𝐏𝐋𝐄𝐍𝐓𝐄𝐒:
    🥷🏻 ┇ 
    🥷🏻 ┇

(Reacciona con ❤️ para jugador / 👍 para suplente)
  `.trim()

  let msg = await conn.sendMessage(m.chat, { text: plantilla }, { quoted: m })
  partidasVS8[msg.key.id] = {
    chat: m.chat,
    jugadores: [],
    suplentes: [],
    originalMsg: msg,
  }
}

handler.help = ['8vs8']
handler.tags = ['freefire']
handler.command = /^(vs8|8vs8|masc8)$/i
handler.group = true
handler.admin = true

export default handler

const corazones = ['❤️', '💙', '💚', '💛', '💜', '🖤', '🤍', '🤎']
const likes = ['👍', '👍🏻', '👍🏼', '👍🏽', '👍🏾', '👍🏿']

conn.ev.on('messages.upsert', async ({ messages }) => {
  let m = messages[0]
  if (!m?.message?.reactionMessage) return

  let { key, text: emoji } = m.message.reactionMessage
  let sender = m.key.participant || m.key.remoteJid

  let data = partidasVS8[key.id]
  if (!data) return

  data.jugadores = data.jugadores.filter(u => u !== sender)
  data.suplentes = data.suplentes.filter(u => u !== sender)

  if (corazones.includes(emoji)) {
    if (data.jugadores.length < 8) data.jugadores.push(sender)
  } else if (likes.includes(emoji)) {
    if (data.suplentes.length < 2) data.suplentes.push(sender)
  } else {
    return
  }

  let j = data.jugadores.map(u => `@${u.split('@')[0]}`)
  let s = data.suplentes.map(u => `@${u.split('@')[0]}`)

  let plantilla = `
𝟖 𝐕𝐄𝐑𝐒𝐔𝐒 𝟖

⏱ 𝐇𝐎𝐑𝐀𝐑𝐈𝐎                            •
🇲🇽 𝐌𝐄𝐗𝐈𝐂𝐎 : 
🇨🇴 𝐂𝐎𝐋𝐎𝐌𝐁𝐈𝐀 :                

➥ 𝐌𝐎𝐃𝐀𝐋𝐈𝐃𝐀𝐃: 
➥ 𝐉𝐔𝐆𝐀𝐃𝐎𝐑𝐄𝐒:

        𝗘𝗦𝗖𝗨𝗔𝗗𝗥𝐀 1
    
    👑 ┇ ${j[0] || ''}
    🥷🏻 ┇ ${j[1] || ''}
    🥷🏻 ┇ ${j[2] || ''}
    🥷🏻 ┇ ${j[3] || ''}
    
        𝗘𝗦𝗖𝗨𝗔𝗗𝗥𝐀 2
    
    👑 ┇ ${j[4] || ''}
    🥷🏻 ┇ ${j[5] || ''}
    🥷🏻 ┇ ${j[6] || ''}
    🥷🏻 ┇ ${j[7] || ''}
    
    ʚ 𝐒𝐔𝐏𝐋𝐄𝐍𝐓𝐄𝐒:
    🥷🏻 ┇ ${s[0] || ''}
    🥷🏻 ┇ ${s[1] || ''}

(Reacciona con ❤️ para jugador / 👍 para suplente)
  `.trim()

  await conn.sendMessage(data.chat, {
    text: plantilla,
    edit: data.originalMsg.key,
    mentions: [...data.jugadores, ...data.suplentes],
  })
})
