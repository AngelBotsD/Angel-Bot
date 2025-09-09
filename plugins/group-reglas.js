let handler = async (m, { conn, text, isROwner, isOwner }) => {
    let chat = global.db.data.chats[m.chat];

    // Si se envía texto, se actualizan las reglas
    if (text) {
        chat.sRules = text;
        conn.reply(m.chat, `𝙍𝙀𝙂𝙇𝘼𝙎 𝘼𝘾𝙏𝙐𝘼𝙇𝙄𝙕𝘼𝘿𝘼𝙎 ✅`, m);
        return;
    }

    // Si no se envía texto, se muestran las reglas actuales
    if (chat.sRules) {
        conn.reply(m.chat, chat.sRules, m);
    } else {
        conn.reply(m.chat, '𝙀𝙡 𝙜𝙧𝙪𝙥𝙤 𝙣𝙤 𝙩𝙞𝙚𝙣𝙚 𝙧𝙚𝙜𝙡𝙖𝙨', m);
    }
}

handler.help = ['reglas', 'setreglas + Texto'];
handler.tags = ['group'];
handler.command = ['reglas', 'setreglas', 'nuevasreglas'];
handler.group = true;
handler.botAdmin = true; // Para actualizar reglas si quieres que solo admins puedan
handler.admin = true;

export default handler;