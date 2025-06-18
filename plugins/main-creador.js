let handler = async (m, { conn, usedPrefix, isOwner }) => {
m.react('👤')
let vcard = `BEGIN:VCARD\nVERSION:3.0\nN:Ferr;;\nFN:Ferr\nORG:Ferr\nTITLE:\nitem1.TEL;waid=584122216538:584122216538\nitem1.X-ABLabel:Ferr\nX-WA-BIZ-DESCRIPTION:\nX-WA-BIZ-NAME:Ferr\nEND:VCARD`
await conn.sendMessage(m.chat, { contacts: { displayName: 'おDanịel.xyz⁩', contacts: [{ vcard }] }}, {quoted: m})
}
handler.help = ['staff']
handler.tags = ['main']
handler.command = ['owner', 'dueño', 'creador'] 

export default handler
