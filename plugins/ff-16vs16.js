let partidasVS16 = {}

let handler = async (m, { conn, args }) => {
  let horaMx = parseInt(args[0])
  if (isNaN(horaMx)) return m.reply('Especifica la hora para México. Ej: `.16vs16 5`')

  let horaCo = horaMx + 1

  let plantilla = `
𝟏𝟔 𝐕𝐒 𝟏𝟔

⏱ 𝐇𝐎𝐑𝐀𝐑𝐈𝐎                            •
🇲🇽 𝐌𝐄𝐗𝐈𝐂𝐎 : ${horaMx}
🇨🇴 𝐂𝐎𝐋𝐎𝐌𝐁𝐈𝐀 : ${horaCo}                

➥ 𝐉𝐔𝐆𝐀𝐃𝐎𝐑𝐄𝐒:

        𝗘𝗦𝗖𝗨𝗔𝗗𝗥𝗔 1
    
    👑 ┇  
    🥷🏻 ┇  
    🥷🏻 ┇ 
    🥷🏻 ┇  

        𝗘𝗦𝗖𝗨𝗔𝗗𝗥𝗔 2
    
    👑 ┇  
    🥷🏻 ┇  
    🥷🏻 ┇ 
    🥷🏻 ┇  

        𝗘𝗦𝗖𝗨𝗔𝗗𝗥𝗔 3
    
    👑 ┇  
    🥷🏻 ┇  
    🥷🏻 ┇ 
    🥷🏻 ┇  

        𝗘𝗦𝗖𝗨𝗔𝗗𝗥𝗔 4
    
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
  partidasVS16[msg.key.id] = {
    chat: m.chat,
    jugadores: [],
    suplentes: [],
    originalMsg: msg,
    horaMx,
    horaCo
  }
}

handler.help = ['16vs16 <hora-mx>']
handler.tags = ['freefire']
handler.command = /^(vs16|16vs16)$/i
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

  let data = partidasVS16[key.id]
  if (!data) return

  data.jugadores = data.jugadores.filter(u => u !== sender)
  data.suplentes = data.suplentes.filter(u => u !== sender)

  if (['❤️', '❤', '♥', '❤️‍🔥'].some(e => emoji.startsWith(e))) {
    if (data.jugadores.length < 16) {
      data.jugadores.push(sender)
    } else {
      if (data.suplentes.length < 2) data.suplentes.push(sender)
    }
  } else if (['👍', '👍🏻', '👍🏼'].some(e => emoji.startsWith(e))) {
    if (data.suplentes.length < 2) {
      data.suplentes.push(sender)
    }
  } else return

  let j = data.jugadores.map(u => `@${u.split('@')[0]}`)
  let s = data.suplentes.map(u => `@${u.split('@')[0]}`)

  let plantilla = `
𝟏𝟔 𝐕𝐒 𝟏𝟔

⏱ 𝐇𝐎𝐑𝐀𝐑𝐈𝐎                            •
🇲🇽 𝐌𝐄𝐗𝐈𝐂𝐎 : ${data.horaMx}
🇨🇴 𝐂𝐎𝐋𝐎𝐌𝐁𝐈𝐀 : ${data.horaCo}                

➥ 𝐉𝐔𝐆𝐀𝐃𝐎𝐑𝐄𝐒:

        𝗘𝗦𝗖𝗨𝗔𝗗𝗥𝗔 1
    
    👑 ┇ ${j[0] || ''}
    🥷🏻 ┇ ${j[1] || ''}
    🥷🏻 ┇ ${j[2] || ''}
    🥷🏻 ┇ ${j[3] || ''}

        𝗘𝗦𝗖𝗨𝗔𝗗𝗥𝗔 2
    
    👑 ┇ ${j[4] || ''}
    🥷🏻 ┇ ${j[5] || ''}
    🥷🏻 ┇ ${j[6] || ''}
    🥷🏻 ┇ ${j[7] || ''}

        𝗘𝗦𝗖𝗨𝗔𝗗𝗥𝗔 3
    
    👑 ┇ ${j[8] || ''}
    🥷🏻 ┇ ${j[9] || ''}
    🥷🏻 ┇ ${j[10] || ''}
    🥷🏻 ┇ ${j[11] || ''}

        𝗘𝗦𝗖𝗨𝗔𝗗𝗥𝗔 4
    
    👑 ┇ ${j[12] || ''}
    🥷🏻 ┇ ${j[13] || ''}
    🥷🏻 ┇ ${j[14] || ''}
    🥷🏻 ┇ ${j[15] || ''}

    ʚ 𝐒𝐔𝐏𝐋𝐄𝐍𝐓𝐄𝐒:
    🥷🏻 ┇ ${s[0] || ''}
    🥷🏻 ┇ ${s[1] || ''}

❤️ = Participar | 👍 = Suplente
  `.trim()

  await conn.sendMessage(data.chat, {
    text: plantilla,
    edit: data.originalMsg.key,
    mentions: [...data.jugadores, ...data.suplentes]
  })
})
