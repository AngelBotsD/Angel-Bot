// ruletaban.js
let handler = async (m, { conn, participants, isBotAdmin, isAdmin, isOwner }) => {
  if (!m.isGroup) return conn.reply(m.chat, 'Este comando solo funciona en grupos.', m);
  if (!isBotAdmin) return conn.reply(m.chat, 'Necesito ser administrador para sacar a alguien.', m);

  // lista de candidatos (excluyendo al bot)
  let botId = conn.user.jid;
  let candidates = participants
    .map(p => p.id)
    .filter(id => id !== botId);

  if (!candidates.length) return conn.reply(m.chat, 'No hay candidatos para elegir.', m);

  // elegir uno random
  let chosen = candidates[Math.floor(Math.random() * candidates.length)];

  // texto con mención
  let text = `Adiós putita, fuiste elegido @${chosen.split('@')[0]}`;

  await conn.sendMessage(m.chat, { text, mentions: [chosen] }, { quoted: m });

  try {
    await conn.groupParticipantsUpdate(m.chat, [chosen], 'remove');
  } catch (e) {
    return conn.reply(m.chat, 'No pude sacar al usuario (quizás es admin/owner).', m);
  }
};

handler.command = ['ruletaban'];
handler.group = true;

export default handler;