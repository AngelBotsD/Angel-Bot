let partidasVS6 = {}

let handler = async (m, { conn, args }) => {
  const modalidad = args.join(' ') || ''

  let plantilla = `
𝟔 𝐕𝐄𝐑𝐒𝐔𝐒 𝟔

⏱ 𝐇𝐎𝐑𝐀𝐑𝐈𝐎                            •
🇲🇽 𝐌𝐄𝐗𝐈𝐂𝐎 : 
🇨🇴 𝐂𝐎𝐋𝐎𝐌𝐁𝐈𝐀 :                

➥ 𝐌𝐎𝐃𝐀𝐋𝐈𝐃𝐀𝐃: ${modalidad}
➥ 𝐉𝐔𝐆𝐀𝐃𝐎𝐑𝐄𝐒:

      𝗘𝗦𝗖𝗨𝗔𝐃𝐑𝐀 1
    
    👑 ┇  
    🥷🏻 ┇  
    🥷🏻 ┇ 
    🥷🏻 ┇  
    🥷🏻 ┇  
    🥷🏻 ┇  
    
    ʚ 𝐒𝐔𝐏𝐋𝐄𝐍𝐓𝐄𝐒:
    🥷🏻 ┇ 
    🥷🏻 ┇

❤️ = Participar | 👍 = Suplente
  `.trim()

  let msg = await conn.sendMessage(m.chat, { text: plantilla }, { quoted: m })

  partidasVS6[msg.key.id] = {
    chat: m.chat,
    jugadores: [],
    suplentes: [],
    originalMsg: msg,
    modalidad
  }
}

handler.help = ['6vs6']
handler.tags = ['freefire']
handler.command = /^(vs6|6vs6|masc6)$/i
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

  let data = partidasVS6[key.id]
  if (!data) return

  let emojisParticipar = ['❤️', '❤', '♥', '🧡', '💛', '💚', '💙', '💜', '🖤', '🤍', '🤎', '❤️‍🔥']
  let emojisSuplente = ['👍', '👍🏻', '👍🏼', '👍🏽', '👍🏾', '👍🏿']

  data.jugadores = data.jugadores.filter(u => u !== sender)
  data.suplentes = data.suplentes.filter(u => u !== sender)

  if (emojisParticipar.includes(emoji)) {
    if (data.jugadores.length < 6) {
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
𝟔 𝐕𝐄𝐑𝐒𝐔𝐒 𝟔

⏱ 𝐇𝐎𝐑𝐀𝐑𝐈𝐎                            •
🇲🇽 𝐌𝐄𝐗𝐈𝐂𝐎 : 
🇨🇴 𝐂𝐎𝐋𝐎𝐌𝐁𝐈𝐀 :                

➥ 𝐌𝐎𝐃𝐀𝐋𝐈𝐃𝐀𝐃: ${data.modalidad}
➥ 𝐉𝐔𝐆𝐀𝐃𝐎𝐑𝐄𝐒:

      𝗘𝗦𝗖𝗨𝗔𝐃𝐑𝐀 1
    
    👑 ┇ ${jugadores[0] || ''}
    🥷🏻 ┇ ${jugadores[1] || ''}
    🥷🏻 ┇ ${jugadores[2] || ''}
    🥷🏻 ┇ ${jugadores[3] || ''}
    🥷🏻 ┇ ${jugadores[4] || ''}
    🥷🏻 ┇ ${jugadores[5] || ''}
    
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
