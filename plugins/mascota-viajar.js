let handler = async (m, { conn }) => {
  const user = global.db.data.users[m.sender];

  // Verifica si el usuario tiene una mascota
  if (!user.mascota) {
    return m.reply('No tienes ninguna mascota para enviar.');
  }

  // Verifica el nivel del usuario
  if (user.level < 3) {
    return m.reply('Necesitas ser al menos nivel 5 para enviar tu mascota.');
  }

  // Verifica que la mascota tenga un nivel mínimo de 3
  const mascotaNivel = user.mascotaNivel; // Accede al nivel de la mascota
  if (mascotaNivel < 2) {
    return m.reply('Tu mascota necesita tener al menos nivel 3 para ser enviada.');
  }

  // Obtener destinatario (usuario mencionado)
  const destinatario = m.mentionedJid[0];
  if (!destinatario) {
    return m.reply('Por favor, menciona a un usuario al que enviarle tu mascota.');
  }

  // Verifica si el destinatario existe
  const usuarioDestino = global.db.data.users[destinatario];
  if (!usuarioDestino) {
    return m.reply('El usuario destinatario no existe.');
  }

  // Transfiere la mascota al destinatario
  const mascota = user.mascota;
  user.mascota = null; // El usuario pierde su mascota
  user.mascotaNivel = null; // El usuario pierde el nivel de la mascota
  usuarioDestino.mascota = mascota; // El destinatario gana la mascota
  usuarioDestino.mascotaNivel = mascotaNivel; // El destinatario recibe el nivel de la mascota

  // Enviar mensaje informativo
  m.reply(`Has enviado tu mascota *${mascota}* 🐾 al usuario *${destinatario.split('@')[0]}*. Ahora la mascota está bajo su cuidado hasta que la regrese.`);

  // Mensaje al destinatario
  conn.sendMessage(destinatario, `¡Hola! El usuario *${m.sender.split('@')[0]}* te ha enviado su mascota *${mascota}* 🐾. Cuídala bien y recuérdala que debes devolverla cuando se te pida.`);
};

handler.help = ['viajar'];
handler.tags = ['rpg'];
handler.command = ['viajar'];

export default handler;
