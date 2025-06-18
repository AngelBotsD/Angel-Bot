const cooldowns = {}

let handler = async (m, { conn, usedPrefix, command }) => {
   let user = global.db.data.users[m.sender]

   if (!user.mascota) { // Verifica si el usuario tiene una mascota
      return m.reply('❌ No puedes usar este comando porque no tienes una mascota. Adopta una primero.')
   }

   // EXP entre 100 y 5000
   let amount = Math.floor(Math.random() * (5000 - 100 + 1) + 100)

   const tiempoEspera = 5 * 60 // 5 minutos de cooldown

   if (cooldowns[m.sender] && Date.now() - cooldowns[m.sender] < tiempoEspera * 1000) {
      const tiempoRestante = segundosAHMS(Math.ceil((cooldowns[m.sender] + tiempoEspera * 1000 - Date.now()) / 1000))
      return m.reply(`🕜 Espera *${tiempoRestante}* para volver a jugar con tu mascota.`)
   }

   // Escoge un mensaje aleatorio sobre jugar con la pelota
   let mensaje = mensajesPelota[Math.floor(Math.random() * mensajesPelota.length)]
   
   user.exp = (user.exp || 0) + amount // Sumar EXP al usuario
   await m.reply(`⚽ ${mensaje} y ganaste *${amount} EXP* 🏆.`)

   cooldowns[m.sender] = Date.now()
}

handler.help = ['pelota']
handler.tags = ['rpg']
handler.command = ['pelota', 'jugarconpelota']

export default handler

function segundosAHMS(segundos) {
   const minutos = Math.floor((segundos % 3600) / 60)
   const segundosRestantes = segundos % 60
   return `${minutos} minutos y ${segundosRestantes} segundos`
}

// Opciones de mensajes al jugar con la pelota
const mensajesPelota = [
   "¡Tu mascota se divirtió mucho jugando con la pelota! 🐶⚽",
   "Tu mascota está feliz, ¡corriendo tras la pelota como nunca! 🎾",
   "¡Qué gran jugada! Tu mascota atrapó la pelota en el aire. 😎⚽",
   "Tu mascota persiguió la pelota por todo el parque. ¡Qué energía! 💥",
   "El juego con la pelota ha sido todo un éxito. ¡Tu mascota se divirtió muchísimo! ⚽💨",
   "Tu mascota hizo una excelente atrapada. ¡Es todo un campeón! 🏅⚽",
   "¡Tu mascota está agotada de tanto jugar con la pelota, pero feliz! 😄⚽",
   "¡Golazo! Tu mascota logró llevar la pelota hasta el otro lado del campo. 🏆⚽",
   "Tu mascota pasó un buen rato corriendo tras la pelota. ¡Qué gran compañero de juegos! ⚽🎉"
]
  
