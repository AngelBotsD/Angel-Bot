let handler = async (m, { conn, participants }) => {
    m.react('☠️');

    const texto = `_Menciona al usuario que deseas eliminar._`;
    if (!m.mentionedJid?.[0] && !m.quoted) {
        return m.reply(texto, m.chat, { mentions: conn.parseMention(texto) });
    }

    const user = m.mentionedJid?.[0] || m.quoted?.sender;

    const botParticipant = participants.find(p => conn.decodeJid(p.id) === conn.decodeJid(conn.user?.jid || ''));
    const botJid = botParticipant?.id || conn.user?.jid;

    if (conn.decodeJid(user) === conn.decodeJid(botJid)) {
        return m.reply(`⚠️ No puedo expulsarme a mí mismo.`);
    }

    await conn.groupParticipantsUpdate(m.chat, [user], 'remove');
    m.reply(`🚫 Miembro eliminado`);
};

handler.help = ['kick @user'];
handler.tags = ['group'];
handler.command = ['kick', 'expulsar', 'eliminar'];
handler.admin = true;
handler.group = true;
handler.botAdmin = true;

export default handler;
