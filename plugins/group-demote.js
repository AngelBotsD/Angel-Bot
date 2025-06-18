const handler = async (m, { conn, text, participants, usedPrefix }) => {
  let user;
  let number;

  if (!text && !m.quoted && (!m.mentionedJid || !m.mentionedJid.length)) {
    return conn.reply(
      m.chat,
      `🚩 Use el comando correctamente\n\n*Ejemplo:*\n> ${usedPrefix}quitaradmin @usuario`,
      m
    );
  }

  if (m.mentionedJid?.length) {
    user = m.mentionedJid[0];
  } else if (m.quoted?.sender) {
    user = m.quoted.sender;
  } else if (text) {
    number = text.replace(/[^0-9]/g, '');
    if (number.length > 13 || number.length < 5) {
      return conn.reply(m.chat, `🚫 *El número ingresado es incorrecto*`, m);
    }
    let p = participants.find(p => conn.decodeJid(p.id).includes(number));
    if (p) user = p.id;
  }

  if (!user) return conn.reply(m.chat, '❌ No se encontró al usuario en el grupo.', m);

  try {
    await conn.groupParticipantsUpdate(m.chat, [user], 'demote');
    await conn.reply(m.chat, `🚩 𝘈𝘤𝘤𝘪𝘰́𝘯 𝘳𝘦𝘢𝘭𝘪𝘻𝘢𝘥𝘢`, m);
  } catch (e) {
    await conn.reply(m.chat, `❌ Error al quitar admin.\n${e?.message || e}`, m);
  }
};

handler.help = ['@usuario'].map(v => 'demote ' + v);
handler.tags = ['group'];
handler.command = /^(demote|quitaradmin)$/i;
handler.group = true;
handler.admin = true;
handler.botAdmin = true;

export default handler;
