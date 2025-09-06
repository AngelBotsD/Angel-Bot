const linkRegex = /chat.whatsapp.com\/(?:invite\/)?([0-9A-Za-z]{20,24})/i;

export async function before(m, { conn, isAdmin, isBotAdmin }) {
    if (m.isBaileys && m.fromMe) return true;
    if (!m.isGroup) return false;

    let chat = global.db.data.chats[m.chat];
    const isGroupLink = linkRegex.exec(m.text);
    const linkThisGroup = `https://chat.whatsapp.com/${await conn.groupInviteCode(m.chat)}`;

    if (m.text.includes(linkThisGroup)) return true;

    if (chat.antiLink && isGroupLink && !isAdmin) {
        // Evitar que el bot se detecte a sí mismo
        if (m.key.fromMe || m.fromMe) return true;

        await conn.reply(
            m.chat,
            `*≡ Enlace detectado ⚠️*\nEliminado y *@${m.sender.split('@')[0]}* será expulsado del grupo.${!isBotAdmin ? '\n\nRequiero admin para eliminarlo.' : ''}`,
            null,
            { mentions: [m.sender] }
        );

        if (isBotAdmin) {
            await conn.sendMessage(m.chat, { delete: m.key });
            await conn.groupParticipantsUpdate(m.chat, [m.sender], 'remove');
        }
    }

    return true;
}