import axios from 'axios'
import fetch from 'node-fetch'
let handler = async (m, { conn, usedPrefix, command, text }) => {
const isQuotedImage = m.quoted && (m.quoted.msg || m.quoted).mimetype && (m.quoted.msg || m.quoted).mimetype.startsWith('image/')
const username = `${conn.getName(m.sender)}`
const basePrompt = `Tu nombre es BOSSBOT 𝙱𝙾𝚃 y Fuiste creado por @𝘚𝘪𝘴𝘬𝘦𝘥. Tú usas el idioma Español. Llamarás a las personas por su nombre ${username}, te gusta ser divertido, Chistoso y puedes ser grosero con quien te insulta Hp Peruano ${username}`
if (isQuotedImage) {
const q = m.quoted
const img = await q.download?.()
if (!img) {
console.error('🚫 Error: No image Buffer available')
return conn.reply(m.chat, '🚫 Error: No se pudo descargar la imagen.', m, fake)}
const content = '🍁 ¿Qué se observa en la imagen?'
try {

const imageAnalysis = await fetchImageBuffer(content, img)

const query = '💫 Descríbeme la imagen y detalla por qué actúan así. También dime quién eres'

const prompt = `${basePrompt}. La imagen que se analiza es: ${imageAnalysis.result}`

const description = await luminsesi(query, username, prompt)

await conn.reply(m.chat, description, m)

} catch (error) {

console.error('🚫 Error al analizar la imagen:', error)

await conn.reply(m.chat, '🚫 Error al analizar la imagen.', m)}

} else {

if (!text) { return conn.reply(m.chat, `🙂‍↔️ *Ingrese su petición*\n🍁 *Ejemplo de uso:* ${usedPrefix + command} Como Hacer Una flor`, m, rcanal)}

await m.react('💬')

try {

const query = text

const prompt = `${basePrompt}. Responde lo siguiente: ${query}`

const response = await luminsesi(query, username, prompt)

await conn.reply(m.chat, response, m)

} catch (error) {

console.error('🚫 Error al obtener la respuesta:', error)

await conn.reply(m.chat, '🚫 Error: intenta más tarde.', m)}}}

handler.help = ['ia <texto>']
handler.tags = ['ai']
handler.command = ['ia', 'ai', 'chat']

export default handler

// Función para enviar una imagen y obtener el análisis

async function fetchImageBuffer(content, imageBuffer) {

try {

const response = await axios.post('https://Luminai.my.id', {

content: content,

imageBuffer: imageBuffer 

}, {

headers: {

'Content-Type': 'application/json' 

}})

return response.data

} catch (error) {

console.error('Error:', error)

throw error }}

// Función para interactuar con la IA usando prompts

async function luminsesi(q, username, logic) {

try {

const response = await axios.post("https://Luminai.my.id", {

content: q,

user: username,

prompt: logic,

webSearchMode: false

})

return response.data.result

} catch (error) {

console.error('🚫 Error al obtener:', error)

throw error }}
                                 
