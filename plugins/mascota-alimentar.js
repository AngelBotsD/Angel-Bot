let handler = async (m, { conn, command }) => {
  const user = global.db.data.users[m.sender];
  if (!user.mascota) {
    m.reply(`❌ No tienes una mascota. Usa el comando *mimascota* para obtener una.`);
    return;
  }
  if (user.vida === undefined) user.vida = 100;

  if (command === 'alimentar') {
    if (user.vida >= 100) {
      m.reply(`❌ Tu *${user.mascota}* no tiene hambre. Pero le gustaría que le des un paseo. 🚶‍♂️🐾`);
      return;
    }

    let vidaFaltante = 100 - user.vida;
    let comidaNecesaria = Math.ceil(vidaFaltante / 20); // Cada comida da 20 de vida

    if (!user.comida || user.comida < comidaNecesaria) {
      m.reply(`❌ No tienes suficiente comida para alimentar a tu mascota. Necesitas *${comidaNecesaria}* unidades de comida.\n📌 Comida disponible: *${user.comida || 0} 🍖*.`);
      return;
    }

    user.comida -= comidaNecesaria;
    user.vida = 100;

    m.reply(`✅ Has alimentado a tu *${user.mascota}* con éxito. 🐾\n❤️ Vida restaurada al máximo: *${user.vida}/100*\n📌 Comida restante: *${user.comida} 🍖*.`);
  }
};

handler.help = ['alimentar'];
handler.tags = ['rpg'];
handler.command = ['alimentar'];

export default handler;
