import fs from 'fs'
import similarity from 'similarity'

const threshold = 0.72

let acertijos = JSON.parse(fs.readFileSync('./src/game/acertijo.json', 'utf-8'))
let tekateki = {}

let handler = async (m, { conn }) => {
    let acertijo = acertijos[Math.floor(Math.random() * acertijos.length)]

    if (tekateki[m.chat]) {
        return m.reply('🕐 Ya hay un acertijo activo en este grupo. Espera a que termine o responde el acertijo actual.')
    }

    let sentMsg = await m.reply(`⭐ *Acertijo para todos:*\n\n${acertijo.question}\n\n🕐 *60 segundos*\n🎁 *Premio:* 100 experiencia 💫`)

    tekateki[m.chat] = {
        msgId: sentMsg.key.id,
        response: acertijo.response,
        exp: 100,
        timer: setTimeout(() => {
            conn.sendMessage(m.chat, { text: `⏰ Tiempo finalizado.\n_Respuesta correcta:_ *${acertijo.response}*` })
            delete tekateki[m.chat]
        }, 60000)
    }
}

handler.help = ['acertijo']
handler.tags = ['fun']
handler.command = ['acertijo', 'adivinanza']

handler.before = async function (m, { conn }) {
    let chat = tekateki[m.chat]
    if (!chat) return

    if (!m.quoted || m.quoted.id !== chat.msgId) return

    let respuestaUsuario = m.text.toLowerCase().trim()
    let respuestaCorrecta = chat.response.toLowerCase().trim()

    if (respuestaUsuario === respuestaCorrecta) {
        global.db.data.users[m.sender].exp += chat.exp
        await m.reply(`🌟 *Respuesta correcta!* +${chat.exp} exp`)
        clearTimeout(chat.timer)
        delete tekateki[m.chat]
    } else if (similarity(respuestaUsuario, respuestaCorrecta) >= threshold) {
        await m.reply('🤏 *Casi lo logras!*')
    } else {
        await m.reply('❌ *Respuesta incorrecta!*')
    }
}

export default handler
