const handler = async (m, { isOwner, isAdmin, conn, args, command }) => {
  if (!(isAdmin || isOwner)) {
    global.dfail('admin', m, conn);
    throw false;
  }

  if (command === 'remotag') {
    for (let chatId in global.db.data.chats) {
      global.db.data.chats[chatId].emojiTag = '📈';
    }
    await conn.sendMessage(m.chat, { 
      text: `✅ El emoji de mención ha sido restablecido a su valor por defecto 📈.` 
    });
  } else {
    const selectedEmoji = args[0] || '📈';
    for (let chatId in global.db.data.chats) {
      global.db.data.chats[chatId].emojiTag = selectedEmoji;
    }
    await conn.sendMessage(m.chat, { 
      text: `✅ Emoji de mención actualizado a: ${selectedEmoji}` 
    });
  }
};

handler.help = ['emotag [emoji]', 'remotag'];
handler.tags = ['group'];
handler.command = /^(emotag|remotag)$/i;
handler.owner = true;

export default handler;
