let handler = async (m, { conn, text, participants, usedPrefix, command }) => {
    const user = (() => {
        if (m.mentionedJid?.length) return m.mentionedJid[0];
        if (m.quoted?.sender) return m.quoted.sender;
        if (text) {
            let number = text.replace(/[^0-9]/g, '');
            if (number.length >= 5 && number.length <= 13) {
                let p = participants.find(p => conn.decodeJid(p.id).includes(number));
                if (p) return p.id;
            }
        }
        return null;
    })();

    if (!user) {
        return conn.reply(m.chat, `🚩 Usa el comando correctamente\n\n*Ejemplo:*\n> ${usedPrefix}${command} @usuario\n> ${usedPrefix}${command} 51987654321\nO responde al mensaje del usuario.`, m);
    }

    if (!global.db.data.chats[m.chat]) global.db.data.chats[m.chat] = {};
    let chatData = global.db.data.chats[m.chat];
    chatData.dioses = chatData.dioses || {};
    chatData.gods = chatData.gods || {};

    const sender = m.sender;
    const isOwner = global.owner && global.owner.map(v => v[0]).includes(sender.split('@')[0]);
    const isDios = chatData.dioses[sender];
    const isGod = chatData.gods[sender];

    if (['dargod', 'delgod'].includes(command)) {
        if (!isOwner) return conn.reply(m.chat, '🚩 Solo el owner puede usar este comando.', m);
        if (command === 'dargod') {
            chatData.dioses[user] = true;
            return conn.reply(m.chat, `⭐ Se otorgó el rol *isDios* a @${user.split('@')[0]}`, m, { mentions: [user] });
        } else {
            delete chatData.dioses[user];
            return conn.reply(m.chat, `🚫 Se removió el rol *isDios* de @${user.split('@')[0]}`, m, { mentions: [user] });
        }
    }

    if (['darpoder', 'delpoder'].includes(command)) {
        if (!isOwner && !isDios) return conn.reply(m.chat, '🚩 Solo el owner o los *isDios* pueden usar este comando.', m);
        if (command === 'darpoder') {
            chatData.gods[user] = true;
            return conn.reply(m.chat, `⭐ Se otorgó el rol *isGod* a @${user.split('@')[0]}`, m, { mentions: [user] });
        } else {
            delete chatData.gods[user];
            return conn.reply(m.chat, `🚫 Se removió el rol *isGod* de @${user.split('@')[0]}`, m, { mentions: [user] });
        }
    }
};

handler.help = ['dargod', 'delgod', 'darpoder', 'delpoder'];
handler.tags = ['group'];
handler.command = /^(dargod|delgod|darpoder|delpoder)$/i;
handler.group = true;
handler.admin = true;
handler.botAdmin = true;

export default handler;
