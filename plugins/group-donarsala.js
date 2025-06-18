let toM = a => '@' + a.split('@')[0]
function handler(m, { groupMetadata }) {
let ps = groupMetadata.participants.map(v => v.id)
let a = ps.getRandom()
let b
do b = ps.getRandom()
while (b === a)
m.reply(`𝘋𝘰𝘯𝘢𝘥𝘰𝘳 𝘢𝘭𝘦𝘢𝘵𝘰𝘳𝘪𝘰 𝘦𝘭𝘦𝘨𝘪𝘥𝘰 𝘦𝘴: *${toM(a)}.*\nZerwaybot🔥 🚩`, null, {
mentions: [a, b]
})}
handler.help = ['donarsala']
handler.tags = ['group']
handler.command = ['donarsala', 'sala']
handler.group = true
handler.admin = true
export default handler
