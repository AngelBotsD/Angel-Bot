let handler = async (m, { conn, usedPrefix, isOwner }) => {
m.react('👤')
let vcard = `BEGIN:VCARD\nVERSION:3.0\nN:Alexn;;\nFN:Alexn\nORG:Alexn\nTITLE:\nitem1.TEL;waid=528125788206:528125788206\nitem1.X-ABLabel:Alexn\nX-WA-BIZ-DESCRIPTION:\nX-WA-BIZ-NAME:Alexn\nEND:VCARD`
await conn.sendMessage(m.chat, { contacts: { displayName: 'Alexnsnk7⁩', contacts: [{ vcard }] }}, {quoted: m})
}
handler.help = ['staff']
handler.tags = ['main']
handler.command = ['owner', 'dueño', 'creador'] 

export default handler
