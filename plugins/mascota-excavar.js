const cooldowns = {}

let handler = async (m, { conn }) => {
  let user = global.db.data.users[m.sender]

  if (!user.mascota) { // Verifica si el usuario tiene una mascota
    return m.reply('❌ No puedes usar este comando porque no tienes una mascota. Adopta una primero.')
  }

  let amount = Math.floor(Math.random() * 20) + 1 // Comida aleatoria entre 1 y 20
  const tiempoEspera = 5 * 60 // 5 minutos de cooldown

  if (cooldowns[m.sender] && Date.now() - cooldowns[m.sender] < tiempoEspera * 1000) {
    const tiempoRestante = segundosAHMS(Math.ceil((cooldowns[m.sender] + tiempoEspera * 1000 - Date.now()) / 1000))
    return m.reply(`🕜 Espera *${tiempoRestante}* para volver a excavar.`)
  }

  user.comida = (user.comida || 0) + amount

  await m.reply(`🐾 ¡Tu mascota ha excavado un agujero y encontró *${amount}* 🍖 comida!`)
  
  cooldowns[m.sender] = Date.now()
}

handler.help = ['excavar']
handler.tags = ['rpg']
handler.command = ['excavar']  

export default handler

function segundosAHMS(segundos) {
  const minutos = Math.floor((segundos % 3600) / 60)
  const segundosRestantes = segundos % 60
  return `${minutos} minutos y ${segundosRestantes} segundos`
}
