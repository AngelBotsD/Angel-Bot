import axios from 'axios'

let handler = async (m, { conn, text }) => {
if (!text) return conn.reply(m.chat, `𝙸𝚗𝚐𝚛𝚎𝚜𝚊 𝚞𝚗𝚊 𝚋𝚞́𝚜𝚚𝚞𝚎𝚍𝚊`, m)

try {
let api = await axios.get(`https://api.siputzx.my.id/api/s/pinterest?query=${text}`)
let json = api.data
let data = json.data[Math.floor(Math.random() * json.data.length)]

let { pin, created_at, images_url, grid_title } = data
let HS = `- *Titulo :* ${grid_title}\nBOSSBOT - 𝙱𝙾𝚃 📈`
await conn.sendMessage(m.chat, { image: { url: images_url }, caption: HS }, { quoted: m })

} catch (error) {
console.error(error)
}}

handler.command = ['pinterest', 'pin']

export default handler
