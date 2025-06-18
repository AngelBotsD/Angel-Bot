let handler = async (m, { conn, args, text, usedPrefix, command }) => {
if (!text) await m.reply(`Ingrese el número al que quiere enviar una invitación al grupo\n\n🚩 Ejemplo :\n*${usedPrefix + command}* 584125263582`)
if (text.includes('+')) await m.reply('🚩 Ingrese el número todo sin el *+*')
if (isNaN(text)) await m.reply('⭐ Ingrese sólo números más su código de país sin espacios')
let group = m.chat
let link = 'https://chat.whatsapp.com/' + await conn.groupInviteCode(group)
await conn.reply(text+'@s.whatsapp.net', `🚩 *INVITACIÓN AL GRUPO*\n\n_Un usuario te invitó a unirte a este grupo_ \n\n${link}`, m, {mentions: [m.sender]})
await m.reply(`🚩 Se envió un enlace de invitación al usuario.`) 

}
handler.help = ['invite *<numero>*']
handler.tags = ['group']
handler.command = ['invite', 'invitar', 'add'] 
handler.group = true
handler.admin = true
handler.botAdmin = true

export default handler
