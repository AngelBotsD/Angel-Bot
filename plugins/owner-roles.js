let handler = async (m, { conn }) => {
    let chats = global.db.data.chats;
    let text = '';
    let count = 0;
    let mentions = [];

    for (let chatId in chats) {
        let group = chats[chatId];
        let isDiosList = Object.keys(group.dioses || {});
        let isGodList = Object.keys(group.gods || {});

        if (!isDiosList.length && !isGodList.length) continue;

        try {
            let metadata = await conn.groupMetadata(chatId);
            count++;
            text += `*${count}. ${metadata.subject}*\n`;

            if (isDiosList.length) {
                text += `🛡️ *isDios:*\n`;
                for (let jid of isDiosList) {
                    text += `  • @${jid.split('@')[0]}\n`;
                    mentions.push(jid);
                }
            }

            if (isGodList.length) {
                text += `⚡ *isGod:*\n`;
                for (let jid of isGodList) {
                    text += `  • @${jid.split('@')[0]}\n`;
                    mentions.push(jid);
                }
            }

            text += '\n';
        } catch (e) {
            continue;
        }
    }

    if (!text) return conn.reply(m.chat, '📭 No hay roles asignados en ningún grupo.', m);

    conn.reply(m.chat, text.trim(), m, { mentions });
};

handler.help = ['roles'];
handler.tags = ['group'];
handler.command = /^roles$/i;
handler.owner = true;

export default handler;
