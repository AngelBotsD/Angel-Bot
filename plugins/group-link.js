import { areJidsSameUser } from '@whiskeysockets/baileys';

let handler = async (m, { conn, args }) => {
  let group = /^[0-9]{5,16}-?[0-9]+@g\.us$/.test(args[0]) ? args[0] : m.chat;

  try {
    const groupMetadata = await conn.groupMetadata(group).catch(() => null);
    if (!groupMetadata?.participants) return m.react('✖️');

    const participants = groupMetadata.participants || [];

    const botIds = [
      conn.decodeJid(conn.user?.jid || ''),
      conn.decodeJid(conn.user?.lid || '')
    ];

    const me = participants.find(u =>
      botIds.includes(conn.decodeJid(u.id))
    );

    if (!me) return m.reply('*⚡ No estoy en ese grupo :(*');
    if (!me.admin) return m.reply('*🧐 No soy administrador*');

    const inviteCode = await conn.groupInviteCode(group);
    const groupLid = groupMetadata.id.split('@')[0];
    const groupLink = `https://chat.whatsapp.com/${inviteCode}`;

    m.reply(`🔗 *Enlace del grupo:*\n${groupLink}\n\n🆔 *LID:* ${groupLid}`);
  } catch {
    m.react('✖️');
  }
};

handler.help = ['link'];
handler.tags = ['group'];
handler.command = ['link', 'linkgroup'];
handler.group = true;

export default handler;
