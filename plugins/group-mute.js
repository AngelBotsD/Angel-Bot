let mutedUsers = new Set();

let handler = async (m, { conn, text, participants, usedPrefix, command, isAdmin, isBotAdmin, owner }) => {
    if (!isBotAdmin) return conn.reply(m.chat, '⭐ El bot necesita ser administrador.', m);
    if (!isAdmin) return conn.reply(m.chat, '⭐ Solo los administradores pueden usar este comando.', m);

    let user;
    let number;

    if (!text && !m.quoted && (!m.mentionedJid || !m.mentionedJid.length)) {
        return conn.reply(m.chat,
            `🚩 Usa el comando correctamente\n\n*Ejemplo:*\n> ${usedPrefix}${command} @usuario\n> ${usedPrefix}${command} 51987654321\nO responde al mensaje del usuario.`,
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
            return conn.reply(m.chat, `🧸 *El número ingresado es incorrecto*`, m);
        }
        let p = participants.find(p => conn.decodeJid(p.id).includes(number));
        if (p) user = p.id;
    }

    if (!user) return conn.reply(m.chat, '❌ No se encontró al usuario en el grupo.', m);

    if (user === conn.user.jid) {
        return conn.reply(m.chat, '⭐ No puedes mutear al bot.', m);
    }

    if (user === owner) {
        return conn.reply(m.chat, '⭐ No puedes mutear al owner.', m);
    }

    if (command === "mute") {
        mutedUsers.add(user);
        conn.reply(m.chat, `✅ *Usuario muteado:* @${user.split('@')[0]}`, m, { mentions: [user] });
    } else if (command === "unmute") {
        mutedUsers.delete(user);
        conn.reply(m.chat, `✅ *Usuario desmuteado:* @${user.split('@')[0]}`, m, { mentions: [user] });
    }
};

handler.before = async (m, { conn }) => {
    if (mutedUsers.has(m.sender) && m.mtype !== 'stickerMessage') {
        try {
            await conn.sendMessage(m.chat, { delete: m.key });
        } catch (e) {
            console.error(e);
        }
    }
};

handler.help = ['mute', 'unmute'];
handler.tags = ['group'];
handler.command = /^(mute|unmute)$/i;
handler.group = true;
handler.admin = true;
handler.botAdmin = true;

export default handler;
