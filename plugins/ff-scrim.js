let partidasScrim = {}

let handler = async (m, { conn, args }) => {
  let horaMx = parseInt(args[0])
  if (isNaN(horaMx)) return m.reply('Especifica la hora para México. Ej: `.scrim 5`')

  let horaCo = horaMx + 1

  let plantilla = `
𝐒𝐂𝐑𝐈𝐌

⏱ 𝐇𝐎𝐑𝐀𝐑𝐈𝐎                            •
🇲🇽 𝐌𝐄𝐗𝐈𝐂𝐎 : ${horaMx}
🇨🇴 𝐂𝐎𝐋𝐎𝐌𝐁𝐈𝐀 : ${horaCo}                

➥ 𝐉𝐔𝐆𝐀𝐃𝐎𝐑𝐄𝐒:

      𝗘𝗦𝗖𝗨𝗔𝗗𝗥𝐀 
    
    👑 ┇  
    🥷🏻 ┇  
    🥷🏻 ┇ 
    🥷🏻 ┇  
    
    ʚ 𝐒𝐔𝐏𝐋𝐄𝐍𝐓𝐄𝐒:
    🥷🏻 ┇ 
    🥷🏻 ┇

❤️ = Participar | 👍 = Suplente
  `.trim()

  let msg = await conn.sendMessage(m.chat, { text: plantilla }, { quoted: m })

  partidasScrim[msg.key.id] = {
    chat: m.chat,
    jugadores: [],
    suplentes: [],
    originalMsg: msg,
    horaMx,
    horaCo
  }
}

handler.help = ['scrim <hora-mx>']
handler.tags = ['freefire']
handler.command = /^(scrim)$/i
handler.group = true
handler.admin = true

export default handler

conn.ev.on('messages.upsert', async ({ messages }) => {
  let m = messages[0]
  if (!m?.message?.reactionMessage) return

  let reaction = m.message.reactionMessage
  let key = reaction.key
  let emoji = reaction.text
  let sender = m.key.participant || m.key.remoteJid

  let data = partidasScrim[key.id]
  if (!data) return

  let emojisParticipar = ['❤️', '❤', '♥', '🧡', '💛', '💚', '💙', '💜', '🖤', '🤍', '🤎', '❤️‍🔥']
  let emojisSuplente = ['👍', '👍🏻', '👍🏼', '👍🏽', '👍🏾', '👍🏿']

  data.jugadores = data.jugadores.filter(u => u !== sender)
  data.suplentes = data.suplentes.filter(u => u !== sender)

  if (emojisParticipar.includes(emoji)) {
    if (data.jugadores.length < 4) {
      data.jugadores.push(sender)
    }
  } else if (emojisSuplente.includes(emoji)) {
    if (data.suplentes.length < 2) {
      data.suplentes.push(sender)
    }
  } else return

  let jugadores = data.jugadores.map(u => `@${u.split('@')[0]}`)
  let suplentes = data.suplentes.map(u => `@${u.split('@')[0]}`)

  let plantilla = `
𝐒𝐂𝐑𝐈𝐌

⏱ 𝐇𝐎𝐑𝐀𝐑𝐈𝐎                            •
🇲🇽 𝐌𝐄𝐗𝐈𝐂𝐎 : ${data.horaMx}
🇨🇴 𝐂𝐎𝐋𝐎𝐌𝐁𝐈𝐀 : ${data.horaCo}                

➥ 𝐉𝐔𝐆𝐀𝐃𝐎𝐑𝐄𝐒:

      𝗘𝗦𝗖𝗨𝗔𝗗𝗥𝐀 
    
    👑 ┇ ${jugadores[0] || ''}
    🥷🏻 ┇ ${jugadores[1] || ''}
    🥷🏻 ┇ ${jugadores[2] || ''}
    🥷🏻 ┇ ${jugadores[3] || ''}
    
    ʚ 𝐒𝐔𝐏𝐋𝐄𝐍𝐓𝐄𝐒:
    🥷🏻 ┇ ${suplentes[0] || ''}
    🥷🏻 ┇ ${suplentes[1] || ''}

❤️ = Participar | 👍 = Suplente
  `.trim()

  await conn.sendMessage(data.chat, {
    text: plantilla,
    edit: data.originalMsg.key,
    mentions: [...data.jugadores, ...data.suplentes]
  })
})
