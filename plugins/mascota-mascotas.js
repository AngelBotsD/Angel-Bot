let handler = async (m, { conn }) => {
  let usuarios = Object.keys(global.db.data.users); // Obtener lista de usuarios
  let mascotasLista = [];

  for (let userId of usuarios) {
    let user = global.db.data.users[userId];

    if (!user.mascota) continue; // Si el usuario no tiene mascota, lo saltamos

    let vida = user.vida !== undefined ? user.vida : 100; // Si la vida no está definida, iniciarla en 100
    let nivel = user.mascotaNivel !== undefined ? user.mascotaNivel : 1; // Si el nivel no está definido, iniciarlo en 1

    mascotasLista.push(`👤 *Usuario:* @${userId.split("@")[0]}\n🐾 *Mascota:* ${user.mascota}\n❤️ *Vida:* ${vida}/100\n⭐ *Nivel:* ${nivel}\n`);
  }

  if (mascotasLista.length === 0) {
    m.reply("❌ No hay usuarios con mascotas registradas.");
    return;
  }

  let mensaje = "📜 *Lista de Mascotas Registradas:*\n\n" + mascotasLista.join("\n─────────────────\n");

  // Enviar el mensaje mencionando a los usuarios
  conn.sendMessage(m.chat, { text: mensaje, mentions: usuarios.map(u => u) }, { quoted: m });
};

handler.help = ['mascotas'];
handler.tags = ['masc'];
handler.command = ['mascotas'];

export default handler;
