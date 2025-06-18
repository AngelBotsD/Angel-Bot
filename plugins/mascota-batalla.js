const handler = async (m, { conn, args }) => {
  const user1 = global.db.data.users[m.sender];
  const mentionedJid = m.mentionedJid && m.mentionedJid[0];

  if (!mentionedJid) {
    m.reply('❌ Debes mencionar a otro usuario para iniciar una batalla.');
    return;
  }

  const user2 = global.db.data.users[mentionedJid];

  // Verificar si ambos usuarios tienen una mascota
  if (!user1 || !user1.mascota) {
    m.reply('❌ El primer usuario no tiene una mascota.');
    return;
  }

  if (!user2 || !user2.mascota) {
    m.reply('❌ El segundo usuario no tiene una mascota.');
    return;
  }

  // Verificar si ambos usuarios tienen al menos 50 de vida en sus mascotas
  if (user1.vida < 50) {
    m.reply('❌ Tu mascota no tiene suficiente vida para participar en la batalla. Necesitas al menos 50 de vida. ¡Aliméntala para restaurarla!');
    return;
  }

  if (user2.vida < 50) {
    m.reply('❌ La mascota del usuario mencionado no tiene suficiente vida para participar en la batalla. Necesita al menos 50 de vida. ¡Aliméntala para restaurarla!');
    return;
  }

  if (user1.level < 1 || user2.level < 1) {
    m.reply('❌ Ambos usuarios deben tener al menos nivel 1 para participar en una batalla.');
    return;
  }

  if (user1.mascotaNivel < 1 || user2.mascotaNivel < 1) {
    m.reply('❌ Ambas mascotas deben tener al menos nivel 1 para participar en una batalla.');
    return;
  }

  const tipoBatalla = args[0];
  let apuestaComida, apuestaExp, apuestaDulces, vidaGanador, vidaPerdedor;

  if (tipoBatalla === '1') {
    apuestaComida = 5;
    apuestaExp = 500;
    apuestaDulces = 0;
    vidaGanador = 10;  // Vida que pierde el ganador
    vidaPerdedor = 20; // Vida que pierde el perdedor
  } else if (tipoBatalla === '2') {
    apuestaComida = 10;
    apuestaExp = 1000;
    apuestaDulces = 0;
    vidaGanador = 20;  // Vida que pierde el ganador
    vidaPerdedor = 30; // Vida que pierde el perdedor
  } else if (tipoBatalla === '3') {
    // Verificar que el usuario tenga nivel igual o superior al nivel de su mascota
    if (user1.level < user1.mascotaNivel) {
      m.reply('❌ No puedes iniciar una batalla tipo 3 porque el nivel de tu mascota es mayor que tu nivel. Debes subir tu nivel para igualar o superar el nivel de tu mascota.');
      return;
    }
    if (user2.level < user2.mascotaNivel) {
      m.reply('❌ No se puede iniciar la batalla porque el usuario mencionado tiene su mascota con un nivel superior al suyo.');
      return;
    }
    apuestaComida = 0;
    apuestaExp = 500;
    apuestaDulces = 10;
    vidaGanador = 30;  // Vida que pierde el ganador
    vidaPerdedor = 40; // Vida que pierde el perdedor
  } else {
    m.reply('❌ Tipo de batalla no válido. Usa "1" para Batalla 1, "2" para Batalla 2 o "3" para Batalla 3.');
    return;
  }

  if (user1.comida < apuestaComida || user1.exp < apuestaExp || user1.dulces < apuestaDulces) {
    m.reply('❌ No tienes suficientes recursos para participar en la batalla.');
    return;
  }

  if (user2.comida < apuestaComida || user2.exp < apuestaExp || user2.dulces < apuestaDulces) {
    m.reply('❌ El usuario mencionado no tiene suficientes recursos para participar en la batalla.');
    return;
  }

  user1.comida -= apuestaComida;
  user1.exp -= apuestaExp;
  user1.dulces -= apuestaDulces;
  user2.comida -= apuestaComida;
  user2.exp -= apuestaExp;
  user2.dulces -= apuestaDulces;

  const resultado = Math.random();

  if (resultado < 0.35) {
    // El ganador pierde vida
    user1.vida -= vidaGanador;
    user2.vida -= vidaPerdedor;

    user1.comida += 2 * apuestaComida;
    user1.exp += 2 * apuestaExp;
    user1.dulces += 2 * apuestaDulces;

    const texto = `🎉 ¡Felicidades @${m.sender.split('@')[0]}! Tu *${user1.mascota}* ha derrotado al *${user2.mascota}* de @${mentionedJid.split('@')[0]}.\n\n😼 *Victoria:*\n• Comida: ${2 * apuestaComida}\n• Experiencia: ${2 * apuestaExp}\n• Dulces: ${2 * apuestaDulces}\n\n💔 *Perdida de vida:*\n• Ganador: -${vidaGanador} Vida\n• Perdedor: -${vidaPerdedor} Vida`;
    await conn.sendMessage(m.chat, { text: texto, mentions: [m.sender, mentionedJid] });
  } else if (resultado < 0.7) {
    // El ganador pierde vida
    user1.vida -= vidaPerdedor;
    user2.vida -= vidaGanador;

    user2.comida += 2 * apuestaComida;
    user2.exp += 2 * apuestaExp;
    user2.dulces += 2 * apuestaDulces;

    const texto = `🎉 ¡Felicidades @${mentionedJid.split('@')[0]}! Tu *${user2.mascota}* ha derrotado al *${user1.mascota}* de @${m.sender.split('@')[0]}.\n\n😼 *Victoria:*\n• Comida: ${2 * apuestaComida}\n• Experiencia: ${2 * apuestaExp}\n• Dulces: ${2 * apuestaDulces}\n\n💔 *Perdida de vida:*\n• Ganador: -${vidaGanador} Vida\n• Perdedor: -${vidaPerdedor} Vida`;
    await conn.sendMessage(m.chat, { text: texto, mentions: [m.sender, mentionedJid] });
  } else {
    user1.comida += apuestaComida / 2;
    user1.exp += apuestaExp / 2;
    user1.dulces += apuestaDulces / 2;
    user2.comida += apuestaComida / 2;
    user2.exp += apuestaExp / 2;
    user2.dulces += apuestaDulces / 2;

    const texto = `🤝 La batalla ha terminado en empate. Ambos usuarios @${m.sender.split('@')[0]} y @${mentionedJid.split('@')[0]} recuperan el 50% de su apuesta.\n\n🟠 **Lo que ambos ganaron:**\n• Comida: ${apuestaComida / 2}\n• Experiencia: ${apuestaExp / 2}\n• Dulces: ${apuestaDulces / 2}`;
    await conn.sendMessage(m.chat, { text: texto, mentions: [m.sender, mentionedJid] });
  }
};

handler.help = ['batalla <tipo> @usuario'];
handler.tags = ['masc'];
handler.command = ['batalla'];

export default handler;
