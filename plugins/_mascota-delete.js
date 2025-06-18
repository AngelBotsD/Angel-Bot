let temporizadores = {};

async function verificarVidaYEliminarMascota(conn) {
  const usuarios = Object.keys(global.db.data.users);

  for (let i = 0; i < usuarios.length; i++) {
    let userId = usuarios[i];
    let user = global.db.data.users[userId];

    if (!user.mascota) continue;
    if (user.vida === 0) {
    if (temporizadores[userId]) continue;

        temporizadores[userId] = setTimeout(async () => {
        let mensaje = `❌ *Has perdido a tu mascota* por falta de cuidados. Se ha ido debido a tu negligencia. Además, has perdido todo el progreso de nivel de tu mascota.`;
        let chatDestino = user.grupo || userId;
        await conn.sendMessage(chatDestino, { text: mensaje });

        delete user.mascota;
        user.vida = 100;
        user.mascotaNivel = 0;
        delete temporizadores[userId]; 
      }, 5 * 60 * 1000);
    }
  }
}

setInterval(() => {
  verificarVidaYEliminarMascota(global.conn);
}, 60 * 1000);
