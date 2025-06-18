import moment from 'moment-timezone'

let ultimaHoraProcesada = {}

async function verificarHoraYDescontarVida(conn) {
  const now = moment().tz("America/Caracas")
  const horaActual = now.hour()
  const minutosActuales = now.minute()
  const horasDescuento = [4, 8, 12, 16, 20, 0]

  if (!horasDescuento.includes(horaActual) || minutosActuales > 3) return

  const usuarios = Object.keys(global.db.data.users)
  let mascotasAfectadas = 0
  let gruposConAviso = new Set()

  for (let userId of usuarios) {
    let user = global.db.data.users[userId]
    if (!user.mascota) continue
    if (ultimaHoraProcesada[userId] === horaActual) continue

    ultimaHoraProcesada[userId] = horaActual
    if (user.vida === undefined) user.vida = 100
    user.vida = Math.max(0, user.vida - 20)
    mascotasAfectadas++

    for (let chatId of Object.keys(conn.chats)) {
      let chat = conn.chats[chatId]
      if (!chat || !chat.isGroup) continue
      let participants = chat.metadata?.participants?.map(p => p.id) || []
      if (participants.includes(userId)) {
        gruposConAviso.add(chatId)
        break
      }
    }
  }

  if (mascotasAfectadas > 0) {
    let mensaje = `⚠️ *Vida restada a las mascotas por hambre* ⚠️\n\nSe ha descontado 20 de vida a ${mascotasAfectadas} mascotas. Recuerda alimentarlas. 🍖`

    for (let grupoId of gruposConAviso) {
      await conn.sendMessage(grupoId, { text: mensaje })
    }
  }
}

setInterval(() => {
  verificarHoraYDescontarVida(global.conn)
}, 60 * 1000)
