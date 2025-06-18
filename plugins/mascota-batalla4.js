const handler = async (m, { conn, args }) => {
  const user1 = global.db.data.users[m.sender]; // Datos del usuario que envía el mensaje
  const mentionedJid = m.mentionedJid && m.mentionedJid[0]; // JID del usuario mencionado (oponente)

  // Verificar si se mencionó a otro usuario
  if (!mentionedJid) {
    return m.reply('❌ Debes mencionar a otro usuario para iniciar una Batalla 4.');
  }

  const user2 = global.db.data.users[mentionedJid]; // Datos del usuario mencionado

  // Verificar si ambos cumplen los requisitos
  if (user1.exp < 1000) {
    return m.reply('❌ No cumples los requisitos para participar en la Batalla 4.\n\n🔹 *Requisitos:*\n• 1000 EXP mínimo');
  }
  if (user2.exp < 1000) {
    return m.reply('❌ El usuario mencionado no cumple los requisitos para participar en la Batalla 4.');
  }

  // Verificar si la vida de la mascota es suficiente para participar
  if (user1.vida < 80) {
    return m.reply('❌ Tu mascota no tiene suficiente vida para participar en la Batalla 4. Necesitas al menos 80 de vida. Aliméntala para restaurar su vida.');
  }
  if (user2.vida < 80) {
    return m.reply('❌ La mascota del usuario mencionado no tiene suficiente vida para participar en la Batalla 4. Necesita al menos 80 de vida. Aliméntala para restaurarla.');
  }

  // Simulación de la batalla (50% de probabilidad de ganar)
  const resultado = Math.random();
  let ganador, perdedor;
  if (resultado < 0.5) {
    ganador = user1;
    perdedor = user2;
  } else {
    ganador = user2;
    perdedor = user1;
  }

  // Asignar 'jid' a ganador y perdedor en caso de que no existan
  if (!ganador.jid) {
    ganador.jid = (ganador === user1) ? m.sender : mentionedJid;
  }
  if (!perdedor.jid) {
    perdedor.jid = (perdedor === user1) ? m.sender : mentionedJid;
  }

  // El perdedor pierde su mascota y se reseteará su nivel de mascota
  perdedor.mascota = null;
  perdedor.mascotaNivel = 0;

  // El ganador recibe 50 dulces del límite del perdedor
  const dulcesGanador = 50;
  if (perdedor.limit >= dulcesGanador) {
    ganador.limit += dulcesGanador;
    perdedor.limit -= dulcesGanador;
  } else {
    // Si no tiene suficientes dulces, solo se transfieren todos los dulces
    ganador.limit += perdedor.limit;
    perdedor.limit = 0;
  }

  // Reducir 50 de vida a la mascota del ganador
  ganador.vida = Math.max(0, (ganador.vida || 100) - 50);

  // Obtener datos del grupo (en caso de necesitar datos adicionales)
  let chat = global.db.data.chats[m.chat];
  const groupMetadata = await conn.groupMetadata(m.chat);
  const groupName = groupMetadata.subject;
  const participants = groupMetadata.participants;

  // Configuración del emoji o bandera (si se requiere)
  const emoji = chat.emojiTag || '🍁';

  // Función para obtener la bandera según el código de país (si se requiere)
  const getCountryFlag = (id) => {
    const phoneNumber = id.split('@')[0];
    const countryFlags = {
      '52': '🇲🇽', '57': '🇨🇴', '54': '🇦🇷', '34': '🇪🇸', '55': '🇧🇷',
      '1': '🇺🇸', '44': '🇬🇧', '91': '🇮🇳', '502': '🇬🇹', '56': '🇨🇱',
      '51': '🇵🇪', '58': '🇻🇪', '505': '🇳🇮', '593': '🇪🇨', '504': '🇭🇳',
      '591': '🇧🇴', '53': '🇨🇺', '503': '🇸🇻', '507': '🇵🇦', '595': '🇵🇾'
    };
    for (const length of [3, 2, 1]) {
      const phonePrefix = phoneNumber.slice(0, length);
      if (countryFlags[phonePrefix]) return countryFlags[phonePrefix];
    }
    return '🏁'; // Valor por defecto
  };

  // Extraer la parte del jid para mostrar (usualmente es el número)
  const ganadorJidDisplay = ganador.jid ? ganador.jid.split('@')[0] : 'desconocido';
  const perdedorJidDisplay = perdedor.jid ? perdedor.jid.split('@')[0] : 'desconocido';

  // Opcional: si dispones de la propiedad "name" en los usuarios, la usas; de lo contrario, se usará el jid
  const ganadorTag = '@' + (ganador.name || ganadorJidDisplay);
  const perdedorTag = '@' + (perdedor.name || perdedorJidDisplay);

  // Construir mensaje usando @user en la mención
  let teks = `⚔️ *Batalla 4 - Duelo de Apuestas* ⚔️  
🎉 ¡Felicidades ${ganadorTag}! Has ganado la batalla y ahora posees 50 dulces del perdedor.  
☠️ ${perdedorTag} ha perdido su mascota completamente.  
📥 *Recompensas para ${ganadorTag}:*  
• 50 dulces del límite del perdedor  
• ⚠️ Su mascota ha perdido 50 de vida en la batalla (vida restante: ${ganador.vida})`;

  // Definir las menciones para que el mensaje sea interactivo
  const menciones = [ganador.jid, perdedor.jid];

  // Enviar mensaje con las menciones
  await conn.sendMessage(m.chat, {
    text: teks,
    mentions: menciones
  });
};

handler.help = ['batalla4 @mencion'];
handler.tags = ['masc'];
handler.command = ['batalla4'];

export default handler;
