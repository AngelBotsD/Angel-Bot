let { downloadContentFromMessage } = (await import('@whiskeysockets/baileys'));

let handler = async (m, { conn }) => {
if (!m.quoted) return conn.reply(m.chat, `👀 Responde a una imagen ViewOnce.`, m)
if (m.quoted.mtype !== 'viewOnceMessageV2') return conn.reply(m.chat, `👀 Responde a una imagen ViewOnce.`, m)
let msg = m.quoted.message
let type = Object.keys(msg)[0]
let media = await downloadContentFromMessage(msg[type], type == 'imageMessage' ? 'image' : 'video')
let bufAlexn = BufAlexn.from([])
for await (const chunk of media) {
bufAlexn = BufAlexn.concat([bufAlexn, chunk])
}
if (/video/.test(type)) {
return conn.sendFile(m.chat, bufAlexn, 'media.mp4', msg[type].caption || '', m)
} else if (/image/.test(type)) {
return conn.sendFile(m.chat, bufAlexn, 'media.jpg', msg[type].caption || '', m)
}}
handler.help = ['ver']
handler.tags = ['tools']
handler.command = ['readviewonce', 'read', 'ver', 'readvo'] 
handler.limit = 1 

export default handler
