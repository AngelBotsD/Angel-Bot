let temporizadores = {};

async function verificarVidaYAlimentarMascota(conn) {
  const usuarios = Object.keys(global.db.data.users);

  for (let i = 0; i < usuarios.length; i++) {
    let userId = usuarios[i];
    let user = global.db.data.users[userId];

    if (!user.mascota && user.empleado) {
      delete user.empleado;
      let chatDestino = user.grupo || userId;
      await conn.sendMessage(chatDestino, { text: `❌ *Tu empleado ha renunciado porque ya no tienes una mascota que cuidar.*` });
      continue;
    }

    if (!user.mascota || !user.empleado) continue;

    if (user.vida <= 60) {
      let vidaNecesaria = 100 - user.vida;
      let comidasNecesarias = Math.ceil(vidaNecesaria / 10);
      let chatDestino = user.grupo || userId;

      if (user.comida < comidasNecesarias) {
        let mensaje = `⚠️ *No tienes suficiente comida para alimentar a tu mascota. Necesitas ${comidasNecesarias - user.comida} comidas más.*`;
        await conn.sendMessage(chatDestino, { text: mensaje });
        continue;
      }

      if (user.limit < 10) {
        let mensaje = `⚠️ *No tienes suficientes dulces para que tu empleado cuide a tu mascota. Necesitas 10 dulces.*`;
        await conn.sendMessage(chatDestino, { text: mensaje });
        continue;
      }

      user.comida -= comidasNecesarias;
      user.vida = 100;
      user.limit -= 10;

      let mensaje = `✅ *Tu empleado alimentó a tu mascota y la cuidó. Ha recuperado toda su vida.*\n💰 *Se han descontado 10 dulces por sus cuidados.*`;
      await conn.sendMessage(chatDestino, { text: mensaje });
    }
  }
}

setInterval(() => {
  verificarVidaYAlimentarMascota(global.conn);
}, 60 * 1000);
