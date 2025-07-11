const userSpamData = {}
let handler = m => m

handler.before = async function (m, { conn, isAdmin, isBotAdmin, isOwner, isROwner }) {
  const chat = global.db.data.chats[m.chat]
  const bot = global.db.data.settings[conn.user.jid] || {}
  const user = global.db.data.users[m.sender]

  if (m.sender === conn.user.jid) return
  if (!bot.antiSpam) return
  if (m.isGroup && chat.modoadmin) return
  if (m.isGroup && (isOwner || isROwner || isAdmin || !isBotAdmin)) return

  const sender = m.sender
  const currentTime = Date.now()
  const timeWindow = 5000 // 5 segundos
  const messageLimit = 10

  const warnTimeout = 30000 

  if (!userSpamData[sender]) {
    userSpamData[sender] = {
      lastMessageTime: currentTime,
      messageCount: 1,
      warned: false,
      timeout: null
    }
    return
  }

  const data = userSpamData[sender]
  const timeDiff = currentTime - data.lastMessageTime
  data.lastMessageTime = currentTime

  if (timeDiff <= timeWindow) {
    data.messageCount++

    if (data.messageCount >= messageLimit) {
      if (!data.warned) {
        const msg = `⚠️ *No hagas spam.*`
        await conn.reply(m.chat, msg, m, { mentions: [sender] })
        user.messageSpam = msg
        data.warned = true
        data.messageCount = 1

        data.timeout = setTimeout(() => {
          delete userSpamData[sender]
        }, warnTimeout)
      } else {
        const msg = `👺 *Serás eliminado(a) por hacer spam.*`
        await conn.reply(m.chat, msg, m, { mentions: [sender] })
        user.messageSpam = msg
        await conn.groupParticipantsUpdate(m.chat, [sender], 'remove')
        clearTimeout(data.timeout)
        delete userSpamData[sender]
      }
    }
  } else {
    data.messageCount = 1
  }
}

export default handler
