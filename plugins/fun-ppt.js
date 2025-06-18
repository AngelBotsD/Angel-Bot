let handler = async (m, { conn, text, command, usedPrefix, args }) => {
let pp = 'https://telegra.ph/file/c7924bf0e0d839290cc51.jpg'
let time = global.db.data.users[m.sender].wait + 10000
if (new Date - global.db.data.users[m.sender].wait < 10000) throw `⏱ espere por favor  ${Math.floor((time - new Date()) / 1000)} segundos 🕓 antes de poder volver a jugar  `
if (!args[0]) return conn.reply(m.chat, `*𝐏𝐢𝐞𝐝𝐫𝐚 🗿, 𝐏𝐚𝐩𝐞𝐥 📄 𝐨 𝐓𝐢𝐣𝐞𝐫𝐚* ✂️\n puedes usar estos comandos:\n\n${usedPrefix + command} piedra\n${usedPrefix + command} papel\n${usedPrefix + command} tijera`, m)
  
var astro = Math.random()
if (astro < 0.34) {
astro = 'piedra' 
} else if (astro > 0.34 && astro < 0.67) {
astro = 'tijera' 
} else {
astro = 'papel'
}
let textm = text.toLowerCase()  
if (textm == astro) {
global.db.data.users[m.sender].exp += 500
m.reply(`🥳 Tú ganas!! 🎉\n\n👉🏻 You: ${textm}\n👉🏻 El Bot: ${astro}\n🎁 Premio +500 XP`)
} else if (text == 'papel') {
if (astro == 'piedra') {
global.db.data.users[m.sender].exp += 1000
m.reply(`🥳 Tú ganas!! 🎉\n\n👉🏻 Tú: ${textm}\n👉🏻 El Bot: ${astro}\n🎁 Premio +1000 XP`)
} else {
global.db.data.users[m.sender].exp -= 300
m.reply(`☠️ ¡Tú pierdes!! ❌\n\n👉🏻 Tú: ${textm}\n👉🏻 El Bot: ${astro}\n❌ Premio -300 XP`)
}
} else if (text == 'tijera') {
if (astro == 'papel') {
global.db.data.users[m.sender].exp += 1000
m.reply(`🥳 Tú ganas!! 🎉\n\n👉🏻 Tú: ${textm}\n👉🏻 El Bot: ${astro}\n🎁 Premio +1000 XP`)
} else {
global.db.data.users[m.sender].exp -= 300
m.reply(`☠️ ¡Tú pierdes!! ❌\n\n👉🏻 Tú: ${textm}\n👉🏻 El Bot: ${astro}\n❌ Premio -300 XP`)
}
} else if (textm == 'tijera') {
if (astro == 'papel') {
global.db.data.users[m.sender].exp += 1000
m.reply(`🥳 Tú ganas!! 🎉\n\n👉🏻 Tú: ${textm}\n👉🏻 El Bot: ${astro}\n🎁 Premio +1000 XP`)
} else {
global.db.data.users[m.sender].exp -= 300
m.reply(`☠️ ¡Tú pierdes!! ❌\n\n👉🏻 Tú: ${textm}\n👉🏻 El Bot: ${astro}\n❌ Premio -300 XP`)
}
} else if (textm == 'papel') {
if (astro == 'piedra') {
global.db.data.users[m.sender].exp += 1000
m.reply(`🥳 Tú ganas!! 🎉\n\n👉🏻 Tú: ${textm}\n👉🏻 El Bot: ${astro}\n🎁 Premio +1000 XP`)
} else {
global.db.data.users[m.sender].exp -= 300
m.reply(`☠️ ¡Tú pierdes!! ❌\n\n👉🏻 Tú: ${textm}\n👉🏻 El Bot: ${astro}\n❌ Premio -300 XP`)
}
} else if (textm == 'piedra') {
if (astro == 'tijera') {
global.db.data.users[m.sender].exp += 1000
m.reply(`🥳 Tú ganas!! 🎉\n\n👉🏻 Tú: ${textm}\n👉🏻 El Bot: ${astro}\n🎁 Premio +1000 XP`)
} else {
global.db.data.users[m.sender].exp -= 300
m.reply(`☠️ ¡Tú pierdes!! ❌\n\n👉🏻 Tú: ${textm}\n👉🏻 El Bot: ${astro}\n❌ Premio -300 XP`)
}}
global.db.data.users[m.sender].wait = new Date * 1
}
handler.help = ['ppt']
handler.tags = ['fun']
handler.command = /^(ppt)$/i
export default handler
