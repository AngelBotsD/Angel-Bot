const handler = async (m, { conn, isAdmin, isOwner, args, usedPrefix, command }) => {
  if (!(isAdmin || isOwner)) {
    global.dfail('admin', m, conn);
    throw false;
  }

  const minutos = parseInt(args[0]);

  if (isNaN(minutos) || minutos <= 0) {
    const caption = `
*• Ejemplo de uso:*
${usedPrefix + command} 50
📌 *Este comando cerrará o abrirá el grupo después del tiempo especificado.*

⭐ *Ejemplo para cerrar el grupo después de 50 minutos:* *${usedPrefix}cerrargrupoen 50*
⭐ *Ejemplo para abrir el grupo después de 30 minutos:* *${usedPrefix}abrirgrupoen 30*
`;
    m.reply(caption);
    throw false;
  }

  const timeoutset = minutos * 60000; // Convierte minutos a milisegundos
  const isCloseCommand = command === 'cerrargrupoen'; // Detecta si es cerrar o abrir

  const action = isCloseCommand ? 'announcement' : 'not_announcement';
  const actionMessage = isCloseCommand
    ? `🔒 *_El grupo se cerrará en ${minutos} minutos_.*`
    : `🔓 *_El grupo se abrirá en ${minutos} minutos_.*`;
  const completionMessage = isCloseCommand
    ? `🔒 *El grupo ha sido cerrado, ¡ahora solo los administradores pueden enviar mensajes!*`
    : `🔓 *El grupo ha sido abierto, ¡ahora todos los miembros pueden enviar mensajes!*`;

  // Mensaje inicial indicando que la acción se ejecutará más tarde
  m.reply(actionMessage);

  // Programa la acción (cerrar o abrir) después del tiempo especificado
  setTimeout(async () => {
    await conn.groupSettingUpdate(m.chat, action).then(async () => {
      conn.reply(m.chat, completionMessage);
    });
  }, timeoutset);
};

handler.help = ['cerrargrupoen minutos', 'abrirgrupoen minutos'];
handler.tags = ['group'];
handler.command = /^(cerrargrupoen|abrirgrupoen)$/i;

handler.botAdmin = true;
handler.group = true;

export default handler;
