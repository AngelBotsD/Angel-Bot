let handler = async (m, { groupMetadata, text, conn }) => {
  if (!text) {
    throw `📌 *Ejemplo de uso:*\n.sorteo premio sorpresa`
  }

  let participantes = groupMetadata.participants.map(p => p.id)
  let ganador = participantes.getRandom()

  let mensaje = `🏆 *${'@' + ganador.split('@')[0]}* ganó el sorteo: ${text} ☁️\nZerwaybot 🔥.\n`

  let textoAnimado = ''
  for (let i = 0; i < mensaje.length; i++) {
    textoAnimado += mensaje[i]
    if (i % 10 === 0) conn.sendPresenceUpdate('composing', m.chat)
    await new Promise(r => setTimeout(r, 15))
  }

  await conn.sendMessage(m.chat, {
    text: textoAnimado.trim(),
    mentions: [ganador]
  }, {
    quoted: m,
    ephemeralExpiration: 24 * 60 * 100,
    disappearingMessagesInChat: 24 * 60 * 100
  })
}

handler.help = handler.command = ['sorteo']
handler.tags = ['group']
handler.group = true
handler.limit = 3

export default handler
