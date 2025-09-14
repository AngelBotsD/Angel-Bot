// ruletaban.js
export default async function handler(m, { conn, participants }) {
  try {
    if (!m.isGroup) return conn.reply(m.chat, 'Este comando solo funciona en grupos.', m);

    // comprobar si el bot es admin
    const me = conn.user?.id || (conn.user && conn.user.jid);
    const botParticipant = participants.find(p => p.id === me || p.jid === me) || {};
    const botIsAdmin = !!botParticipant.isAdmin || !!botParticipant.isSuperAdmin;
    if (!botIsAdmin) return conn.reply(m.chat, 'Necesito ser administrador para sacar a alguien.', m);

    // lista de candidatos (todos menos el bot)
    const candidates = participants
      .filter(p => {
        const jid = p?.id ?? p?.jid;
        if (!jid) return false;
        if (jid === me) return false;
        return true;
      })
      .map(p => p?.id ?? p?.jid);

    if (!candidates.length) return conn.reply(m.chat, 'No hay candidatos para elegir.', m);

    // elegir uno random
    const chosenJid = candidates[Math.floor(Math.random() * candidates.length)];
    const mentions = [chosenJid];

    // texto directo
    const text = `Adiós putita, fuiste elegido @${chosenJid.split('@')[0]}`;

    // enviar mensaje
    await conn.sendMessage(m.chat, { text, mentions }, { quoted: m });

    // expulsar
    try {
      await conn.groupParticipantsUpdate(m.chat, [chosenJid], 'remove');
    } catch (err) {
      console.error('Error al expulsar:', err);
      return conn.reply(m.chat, 'No pude sacar al usuario (quizás es admin/owner).', m);
    }

  } catch (e) {
    console.error(e);
    return conn.reply(m.chat, 'Ocurrió un error ejecutando ruletaban.', m);
  }
}

handler.command = ['ruletaban'];
handler.group = true;