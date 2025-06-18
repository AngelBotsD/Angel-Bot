let handler = async (m, { conn }) => {
  const user = global.db.data.users[m.sender];

  if (!user.mascota) {
    m.reply(`❌ No tienes una mascota. Usa el comando *mimascota* para obtener una.`);
    return;
  }

  let nivelActual = user.mascotaNivel || 1;
  const nivelUsuario = user.level;

  // Verificar si el nivel de la mascota ya es el máximo posible
  if (nivelActual >= nivelUsuario) {
    m.reply(`❌ Tu mascota ya está en el nivel máximo permitido (*${nivelActual}*).`);
    return;
  }

  let nivelesSubidos = 0;
  let comidaGastada = 0;
  let expGastada = 0;

  while (nivelActual < nivelUsuario) {
    // Calcular los recursos requeridos para subir de nivel
    const comidaRequerida = 5 * nivelActual;
    const expRequerida = 500 * nivelActual;

    // Aplicar el multiplicador de recursos basado en el nivel
    const comidaTotalRequerida = comidaRequerida * nivelActual; 
    const expTotalRequerida = expRequerida * nivelActual;

    // Verificar si el usuario tiene suficientes recursos para el siguiente nivel
    if (user.comida < comidaTotalRequerida || user.exp < expTotalRequerida) {
      m.reply(`❌ No tienes suficientes recursos para subir de nivel a tu mascota.\n\n🔹 Necesitas *${comidaTotalRequerida} 🍖 comida* y *${expTotalRequerida} XP* para el nivel *${nivelActual + 1}*.\n📌 Comida disponible: *${user.comida} 🍖*\n📌 XP disponible: *${user.exp}*`);
      return;
    }

    // Descontar los recursos necesarios
    user.comida -= comidaTotalRequerida;
    user.exp -= expTotalRequerida;
    comidaGastada += comidaTotalRequerida;
    expGastada += expTotalRequerida;

    // Subir el nivel de la mascota
    nivelActual += 1;
    user.mascotaNivel = nivelActual;

    // Restar 10 puntos de vida al subir de nivel
    user.vida = Math.max(0, user.vida - 10);

    nivelesSubidos++;
  }

  m.reply(`🎉 ¡Felicidades! Tu mascota *${user.mascota}* ha subido *${nivelesSubidos} niveles* y ahora está en *Nivel ${user.mascotaNivel}* 🆙\n❤️ La vida de tu mascota ha bajado a *${user.vida}/100* debido al entrenamiento.\n\n📉 Recursos usados:\n🍖 Comida: *${comidaGastada}*\n✨ XP: *${expGastada}*`);
};

handler.help = ['levelmax'];
handler.tags = ['rpg'];
handler.command = ['levelmax'];

export default handler;
