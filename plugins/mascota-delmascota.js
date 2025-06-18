let handler = async (m, { conn }) => {
  const user = global.db.data.users[m.sender];

  if (!user.mascota) {
    m.reply('🐾 No tienes ninguna mascota actualmente para eliminar.');
    return;
  }

  const mascotaEliminada = user.mascota;
  user.mascota = null;
  user.mascotaNivel = 0;
  user.vida = 100;

  m.reply(`❌ Has eliminado tu mascota: *${mascotaEliminada}*\n❤️ Tu vida ha sido restaurada a *100* y el nivel de mascota reiniciado.`);
};

handler.help = ['delmascota'];
handler.tags = ['rpg'];
handler.command = ['delmascota'];

export default handler;
