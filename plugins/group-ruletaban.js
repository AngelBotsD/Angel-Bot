// ruletaban.js
let handler = async (m, { conn, participants, isBotAdmin }) => {
  if (!m.isGroup) return conn.reply(m.chat, 'Este comando solo funciona en grupos.', m);
  if (!isBotAdmin) return conn.reply(m.chat, 'Necesito ser administrador para sacar a alguien.', m);

  // ID del bot
  let botId = conn.user.jid;

  // candidatos (todos menos bot y owners/superadmins)
  let candidates = participants
    .filter(p => p.id !== botId && p.admin !== 'superadmin') // excluye bot + dueños
    .map(p => p.id);

  if (!candidates.length) return conn.reply(m.chat, 'No hay candidatos válidos para elegir.', m);

  // elegir uno random
  let chosen = candidates[Math.floor(Math.random() * candidates.length)];

  // mensaje
  let text = `Adiós putita, fuiste elegido @${chosen.split('@')[0]}`;

  // enviar texto con mención
  await conn.sendMessage(m.chat, { text, mentions: [chosen] }, { quoted: m });

  // expulsar
  try {
    await conn.groupParticipantsUpdate(m.chat, [chosen], 'remove');
  } catch (e) {
    return conn.reply(m.chat, 'No pude sacar al usuario (quizás hubo un error).', m);
  }
};

handler.command = ['ruletaban'];
handler.group = true;

export default handler;