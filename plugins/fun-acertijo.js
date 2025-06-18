import fs from 'fs';
import similarity from 'similarity';
const threshold = 0.72;

let acertijos = JSON.parse(fs.readFileSync('./src/game/acertijo.json', 'utf-8'));
let tekateki = {};

let handler = async (m, { conn }) => {
    let acertijo = acertijos[Math.floor(Math.random() * acertijos.length)];
    tekateki[m.chat] ??= {};

    let sentMsg = await m.reply(`⭐ Acertijo para @${m.sender.split('@')[0]}:\n\n${acertijo.question}\n\n🕐 *60 segundos*\n🎁 *Premio:* 100 experiencia 💫`, null, {
        mentions: [m.sender]
    });

    tekateki[m.chat][m.sender] = {
        msgId: sentMsg.key.id,
        response: acertijo.response,
        exp: 100,
        timer: setTimeout(() => {
            conn.sendMessage(
                m.chat,
                { text: `⏰ Tiempo finalizado para @${m.sender.split('@')[0]}.\n_Respuesta correcta:_ *${acertijo.response}*`, mentions: [m.sender] }
            );
            delete tekateki[m.chat][m.sender];
        }, 60000)
    };
};

handler.help = ['acertijo'];
handler.tags = ['fun'];
handler.command = ['acertijo', 'adivinanza'];

handler.before = async function (m, { conn }) {
    let chat = tekateki[m.chat];
    if (!chat) return;

    let juego = chat[m.sender];
    if (!juego) return;

    if (!m.quoted || m.quoted.id !== juego.msgId) return;

    let respuestaUsuario = m.text.toLowerCase().trim();
    let respuestaCorrecta = juego.response.toLowerCase().trim();

    if (respuestaUsuario === respuestaCorrecta) {
        global.db.data.users[m.sender].exp += juego.exp;
        await m.reply(`🌟 *Respuesta correcta!* +${juego.exp} exp`);
        clearTimeout(juego.timer);
        delete tekateki[m.chat][m.sender];
    } else if (similarity(respuestaUsuario, respuestaCorrecta) >= threshold) {
        await m.reply('🤏 *Casi lo logras!*');
    } else {
        await m.reply('_*Respuesta incorrecta!*_ ❌');
    }
};

export default handler;
