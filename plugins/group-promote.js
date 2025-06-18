let handler = async (m, { conn, text, participants }) => {
  let user;

  if (!text && !m.quoted && (!m.mentionedJid || !m.mentionedJid.length)) {
    return conn.reply(
      m.chat,
      '🚩 Use el comandó correctamente\n\n`Ejemplo :`\n\n> . promote @BOSSBOT',
      m
    );
  }

  if (m.mentionedJid?.length) {
    user = m.mentionedJid[0];
  }

  else if (m.quoted?.sender) {
    user = m.quoted.sender;
  }

  else if (text) {
    const number = text.replace(/[^0-9]/g, '');
    if (number.length < 5 || number.length > 20) {
      return conn.reply(m.chat, `_El número ingresado es incorrecto, por favor ingrese el número correcto._`, m);
    }
    const found = participants.find(p => conn.decodeJid(p.id).includes(number));
    if (found) user = found.id;
  }

  if (!user) {
    return conn.reply(m.chat, '❌ No se encontró al usuario en el grupo.', m);
  }

  try {
    await conn.groupParticipantsUpdate(m.chat, [user], 'promote');
    await conn.reply(m.chat, `🚩 𝘈𝘤𝘤𝘪𝘰́𝘯 𝘳𝘦𝘢𝘭𝘪𝘻𝘢𝘥𝘢 `, m);
  } catch (e) {
    await conn.reply(m.chat, `❌ Error al promover al usuario.\n${e?.message || e}`, m);
  }
};

handler.help = ['@usuario*'].map(v => 'promote ' + v);
handler.tags = ['group'];
handler.command = /^(promote|daradmin)$/i;
handler.group = true;
handler.admin = true;
handler.botAdmin = true;

export default handler;
