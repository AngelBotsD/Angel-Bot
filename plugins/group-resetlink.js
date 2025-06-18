let handler = async (m, { conn }) => {
  const pp = await conn.profilePictureUrl(m.chat, 'image').catch(_ => null) || './storage/img/siskedurl.jpg';

  let res = await conn.groupRevokeInvite(m.chat);
  const mensaje = "🔗 *Enlace de grupo restablecido*:\n\n" + 
                  "*https://chat.whatsapp.com/" + res + "*";
  
  conn.reply(m.chat, mensaje, m);
};

handler.help = ['nuevolink']
handler.tags = ['group']
handler.command = ['nuevolink', 'nuevoenlace', 'revoke', 'resetlink'];
handler.group = true;
handler.admin = true;
handler.botAdmin = true;

export default handler;
