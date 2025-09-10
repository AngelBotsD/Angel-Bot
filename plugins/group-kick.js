const handler = async (m, { conn }) => {
  const target = (m.mentionedJid && m.mentionedJid.length)
    ? m.mentionedJid[0]
    : m.quoted?.sender;

  if (!target) return m.reply('*🗡️ 𝙼𝚎𝚗𝚌𝚒𝚘𝚗𝚊 𝚘 𝚛𝚎𝚜𝚙𝚘𝚗𝚍𝚎 𝙰𝚕 𝚞𝚜𝚞𝚊𝚛𝚒𝚘 𝚚𝚞𝚎 𝙳𝚎𝚜𝚎𝚊𝚜 𝙴𝚕𝚒𝚖𝚒𝚗𝚊𝚛*', m, rcanal);

  try {
    await conn.groupParticipantsUpdate(m.chat, [target], 'remove');
    return m.reply('*☠️ 𝙸𝚗𝚞𝚝𝚒𝚕 𝙴𝚕𝚒𝚖𝚒𝚗𝚊𝚍𝚘*');
  } catch {
    return global.dfail('botAdmin', m, conn);
  }
};

handler.customPrefix = /^(?:\.?kick)(?:\s+|$)/i;
handler.command = new RegExp();
handler.group = true;
handler.admin = true;

export default handler;