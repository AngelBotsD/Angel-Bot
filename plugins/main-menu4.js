let handler = async (m, { isPrems, conn }) => {
let img = 'https://cdn.russellxz.clickhttps://cdn.russellxz.click/896b4f6c.PNG' 
let texto = `╭─ ⭑ *FREE FIRE MENU* ⭑ ─╮

📌 *MAPAS GENERALES*
│ 🎫 *.donarsala*
│ 🏝️ *.bermuda*
│ 🏖️ *.cuadrilatero*
│ 🌫️ *.hexagonal*

📌 *REGLAS GENERALES*
│ 🏳️ *.reglasclk*

📌 *LISTA VERSUS ⚔️*
│ ⇾ *.4vs4*
│ ⇾ *.6vs6*
│ ⇾ *.8vs8*
│ ⇾ *.scrim*
│ ⇾ *.interna*
│ ⇾ *.12vs12*
│ ⇾ *.16vs16*
│ ⇾ *.guerra*

📞 *Contacto:*
┗ 👤 *.owner*

╰───────────────────╯
`

const fkontak = {
	"key": {
    "participants":"0@s.whatsapp.net",
		"remoteJid": "status@broadcast",
		"fromMe": false,
		"id": "Halo"
	},
	"message": {
		"contactMessage": {
			"vcard": `BEGIN:VCARD\nVERSION:3.0\nN:Sy;Bot;;;\nFN:y\nitem1.TEL;waid=${m.sender.split('@')[0]}:${m.sender.split('@')[0]}\nitem1.X-ABLabel:Ponsel\nEND:VCARD`
		}
	},
	"participant": "0@s.whatsapp.net"
}
await conn.sendFile(m.chat, img, 'img.jpg', texto, m, null, rcanal, fkontak)
}
handler.help = ['menuff', 'menu4']
handler.tags = ['freefire' ,'main'] 
handler.command = ['menuff', 'menufreefire', 'menu4'] 
export default handler
