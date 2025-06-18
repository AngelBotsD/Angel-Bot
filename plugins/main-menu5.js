let handler = async (m, { isPrems, conn }) => {
let img = 'https://cdn.russellxz.click/25d97df3.png' 
let texto = `
「 *🦅 𝘔𝘢𝘴𝘤𝘰𝘵𝘢𝘴 🦅* 」
┣━━━━━━━━━━━━━━┫
║ 🛒 *.comprar* ┊ Comprar Comida  
║ 💲 *.contratar* ┊ Contrata un Trabajador  
║ 🍖 *.alimentar* ┊ Dar de comer  
║ 💰 *.costos* ┊ Ver precios  
║ 👀 *.nombre* ┊ Cambia el Nombre 
║ 🐺 *.mimascota* ┊ Ver todas Las Mascotas 
║ 🐹 *.mascotas* ┊ Ver las mascotas
║ 🐹 *.mascota* ┊ Ver tu mascota  
║ 🕳️ *.excavar* ┊ Buscar tesoros  
║ 🐶 *.paseo* ┊ Pasear mascota  
║ 🥎 *.pelota* ┊ Jugar a la pelota
║ 🚩 *.level* ┊ Subir de Nivel  
║ 🚩 *.levelmax* ┊ Subir al Nivel Max 
║ 🔥 *.batalla 1* ┊ Modo batalla 1  
║ 🛡️ *.batalla 2* ┊ Modo batalla 2  
║ 🗡️ *.batalla 3* ┊ Modo batalla 3  
║ 💣 *.batalla4* ┊ Modo batalla 4  
║ ⚔️ *.batallainfo* ┊ Info de batallas
║ ☠️ *.delmascota* ┊ Elimina Tu Mascota
║ 📍 *.infomasc* ┊ Info De La Mascota  
║ 👥 *.viajar* ┊ Comparte Tu Mascota 
║ 🎁 *.masc* ┊ Recompensas  
╚════════════════╝  

> 𝚂𝙸𝚂𝙺𝙴𝙳 𝚆𝙷𝙰𝚃𝚂𝙰𝙿𝙿 𝙱𝙾𝚃 📈`

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
global.db.data.users[m.sender].lastcofre = new Date * 1
}
handler.help = ['menu5', 'menumasc']
handler.tags = ['masc'] 
handler.command = ['menu5', 'menumasc'] 
export default handler
