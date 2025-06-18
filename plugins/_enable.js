let handler = async (m, { conn, usedPrefix, command, args, isOwner, isAdmin, isROwner }) => {
  let isEnable = /true|enable|(turn)?on|1/i.test(command)
  let chat = global.db.data.chats[m.chat]
  let user = global.db.data.users[m.sender]
  let bot = global.db.data.settings[conn.user.jid] || {}
  let type = (args[0] || '').toLowerCase()
  let isAll = false, isUser = false

  if (!type) {
    let estado = (valor) => valor ? '✅' : '❌'
    let texto = `
╭━〔 𝚂𝙸𝚂𝙺𝙴𝙳 𝙴𝚂𝚃𝙰𝙳𝙾 〕━⬣
┃ Bienvenida: ${estado(chat.bienvenida)}
┃ Auto Detect: ${estado(chat.detect)}
┃ Modo Admin: ${estado(chat.modoadmin)}
┃ Modo Dios: ${estado(chat.onlyGod)}
┃ Antifakes: ${estado(chat.onlyLatinos)}
┃ Antilink: ${estado(chat.antiLink)}
┃ Antispam: ${estado(bot.antiSpam)}
┃ Antiprivado: ${estado(bot.antiPrivate)} 
┃ Audios: ${estado(chat.audios)}
┃ NSFW: ${estado(chat.nsfw)}
╰━━━━━━━━━━━━━━━━⬣`.trim()
    return m.reply(texto)
  }

  switch (type) {
    case 'welcome':
    case 'bv':
    case 'bienvenida':
      if (!m.isGroup) {
        if (!isOwner) {
          global.dfail('group', m, conn)
          throw false
        }
      } else if (!isAdmin) {
        global.dfail('admin', m, conn)
        throw false
      }
      chat.bienvenida = isEnable
      break

    case 'modoadmin':
    case 'soloadmin':
      if (m.isGroup && !(isAdmin || isOwner)) {
        global.dfail('admin', m, conn)
        throw false
      }
      chat.modoadmin = isEnable          
      break

    case 'mododios':
    case 'modogod':
    case 'modorey':
      if (m.isGroup && !(isAdmin || isOwner)) {
        global.dfail('admin', m, conn)
        throw false
      }
      chat.onlyGod = isEnable          
      break

    case 'antispam':
      isAll = true
      if (!isOwner) {
        global.dfail('owner', m, conn)
        throw false
      }
      bot.antiSpam = isEnable
      break

    case 'antifake':
    case 'antifakes':
    case 'antiarabes':
    case 'antiarab':
      if (m.isGroup && !(isAdmin || isOwner)) {
        global.dfail('admin', m, conn)
        throw false
      }
      chat.onlyLatinos = isEnable
      break

    case 'detect':
    case 'avisos':
      if (!m.isGroup) {
        if (!isOwner) {
          global.dfail('group', m, conn)
          throw false
        }
      } else if (!isAdmin) {
        global.dfail('admin', m, conn)
        throw false
      }
      chat.detect = isEnable
      break

    case 'antiprivado':
      isAll = true
      if (!isROwner) {
        global.dfail('rowner', m, conn)
        throw false
      }
      bot.antiPrivate = isEnable
      break

    case 'antilink':
      if (m.isGroup && !(isAdmin || isOwner)) {
        global.dfail('admin', m, conn)
        throw false
      }
      chat.antiLink = isEnable
      break

    case 'audios':
      if (m.isGroup && !(isAdmin || isOwner)) {
        global.dfail('admin', m, conn)
        throw false
      }
      chat.audios = isEnable          
      break

    case 'nsfw':
    case 'modohorny':
    case 'modocaliente':
    case 'selajaloasisked':
      if (m.isGroup && !(isAdmin || isOwner)) {
        global.dfail('admin', m, conn)
        throw false
      }
      chat.nsfw = isEnable          
      break

    default:
      return m.reply(`
*𝘐𝘯𝘨𝘳𝘦𝘴𝘢 𝘶𝘯𝘢 𝘰𝘱𝘤𝘪𝘰́𝘯 𝘱𝘢𝘳𝘢 𝘈𝘤𝘵𝘪𝘷𝘢𝘳 𝘰 𝘋𝘦𝘴𝘢𝘤𝘵𝘪𝘷𝘢𝘳*

「 𝘌𝘯𝘢𝘣𝘭𝘦/𝘋𝘪𝘴𝘢𝘣𝘭𝘦 」 ⚠️

𝘖𝘯/𝘖𝘧𝘧 welcome 
𝘖𝘯/𝘖𝘧𝘧 detect 
𝘖𝘯/𝘖𝘧𝘧 nsfw  
𝘖𝘯/𝘖𝘧𝘧 mododios
𝘖𝘯/𝘖𝘧𝘧 modoadmin
𝘖𝘯/𝘖𝘧𝘧 modocaliente
𝘖𝘯/𝘖𝘧𝘧 audios
𝘖𝘯/𝘖𝘧𝘧 antilink  
𝘖𝘯/𝘖𝘧𝘧 antifakes
𝘖𝘯/𝘖𝘧𝘧 antiprivado  
𝘖𝘯/𝘖𝘧𝘧 antispam

*• 𝘌𝘫𝘦𝘮𝘱𝘭𝘰:* ${usedPrefix + command} welcome`.trim())
  }

  m.reply(`⚠️ 「 𝘼𝙫𝙞𝙨𝙤 」\n\n❶ *𝙲𝙾𝙼𝙰𝙽𝙳𝙾:* *${type}*\n❷ *${isEnable ? '𝙰𝙲𝚃𝙸𝚅𝙰𝙳𝙾' : '𝙳𝙴𝚂𝙰𝙲𝚃𝙸𝚅𝙰𝙳'}* ${isAll ? '*𝙴𝙽 𝙴𝚂𝚃𝙴 𝙱𝙾𝚃*' : '*𝙴𝙽 𝙴𝚂𝚃𝙴 𝙶𝚁𝚄𝙿𝙾*'}`)
}

handler.help = ['enable', 'disable']
handler.tags = ['nable']
handler.command = /^(enable|disable|on|off|1|0)$/i

export default handler
