let handler = async (m, { conn }) => {
  const user = global.db.data.users[m.sender];
  if (!user.mascota) {
    m.reply(`❌ No tienes una mascota. Usa el comando *mimascota* para obtener una.`);
    return;
  }

  const nivelActual = user.mascotaNivel || 1;
  const nivelUsuario = user.level;
  const comidaRequerida = 5 * nivelActual;
  const expRequerida = 500 * nivelActual;

  // Verificar si el nivel de la mascota supera el nivel del usuario
  if (nivelActual >= nivelUsuario) {
    m.reply(`❌ No puedes subir a tu mascota a nivel *${nivelActual + 1}* porque tu nivel es *${nivelUsuario}*.\n\n¡Sube de nivel primero con *levelup*!`);
    return;
  }

  // Verificar si tiene suficientes recursos
  if (user.comida < comidaRequerida || user.exp < expRequerida) {
    m.reply(`❌ No tienes suficientes recursos para subir de nivel a tu mascota.\n\n🔹 Necesitas *${comidaRequerida} 🍖 comida* y *${expRequerida} XP* para el nivel *${nivelActual + 1}*.\n📌 Comida disponible: *${user.comida} 🍖*\n📌 XP disponible: *${user.exp}*`);
    return;
  }

  // Descontar los recursos necesarios
  user.comida -= comidaRequerida;
  user.exp -= expRequerida;

  // Subir el nivel de la mascota
  user.mascotaNivel += 1;

  // Restar 10 puntos de vida al subir de nivel
  user.vida = Math.max(0, user.vida - 10); // Asegurarse de que la vida no baje de 0

  m.reply(`🎉 ¡Felicidades! Tu mascota *${user.mascota}* ha subido al *Nivel ${user.mascotaNivel}* 🆙\n❤️ La vida de tu mascota ha bajado a *${user.vida}/100* por el aumento de nivel.`);
};

handler.help = ['level'];
handler.tags = ['rpg'];
handler.command = ['level'];

export default handler;
