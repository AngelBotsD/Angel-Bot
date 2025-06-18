const xpperdulces = 350; // XP por dulce
const handler = async (m, {conn, command, args}) => {
  let count = command.replace(/^buy/i, '');
  count = count ? /all/i.test(count) ? Math.floor(global.db.data.users[m.sender].exp / xpperdulces) : parseInt(count) : args[0] ? parseInt(args[0]) : 1;
  count = Math.max(1, count);
  
  if (global.db.data.users[m.sender].exp >= xpperdulces * count) {
    global.db.data.users[m.sender].exp -= xpperdulces * count;
    global.db.data.users[m.sender].limit += count; // Ahora compra dulces
    conn.reply(m.chat, `
╔═══════⩽✰⩾═══════╗
║    𝐍𝐨𝐭𝐚 𝐃𝐞 𝐏𝐚𝐠𝐨 
╠═══════⩽✰⩾═══════╝
║╭──────────────┄
║│ *Compra Nominal* : + ${count} 🍬
║│ *Gastado* : -${xpperdulces * count} XP
║╰──────────────┄
╚═══════⩽✰⩾═══════╝`, m);
  } else {
    conn.reply(m.chat, `😔 Lo siento, no tienes suficiente *XP* para comprar *${count}* Dulces 🍬`, m);
  }
};

handler.help = ['Buy', 'Buyall'];
handler.tags = ['rpg'];
handler.command = ['buy', 'buyall'];

handler.disabled = false;

export default handler;
                              
