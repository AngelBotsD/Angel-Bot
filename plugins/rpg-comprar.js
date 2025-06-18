const dulcesPorComida = 5; // 10 dulces por 1 comida

const handler = async (m, { conn, command, args }) => {
  let count = parseInt(args[0]) || 1; // Número de comidas a comprar (por defecto 1)
  count = Math.max(1, count); // Asegura que el valor mínimo sea 1

  let user = global.db.data.users[m.sender];

  if (!user.limit || user.limit < dulcesPorComida * count) {
    conn.reply(
      m.chat,
      `😔 Lo siento, necesitas al menos *${dulcesPorComida * count} dulces 🍬* para comprar *${count} comida 🍖*.`,
      m
    );
    return;
  }

  // Resta los dulces y suma comida
  user.limit -= dulcesPorComida * count;
  user.comida = (user.comida || 0) + count; // Asegura que 'comida' exista y la actualiza

  // Mensaje de confirmación
  conn.reply(
    m.chat,
    `
🛒  Compra Realizada  

*Cantidad Comprada*: +${count} En Comida 🍖
*Dulces Gastados*: -${dulcesPorComida * count} 🍬

Gracias Por Su Compra Vuelva Pronto 😇
> @ꜱɪꜱᴋᴇᴅ - ʟᴏᴄᴀʟ - 𝟢𝟨
`,
    m
  );
};

handler.help = ['comprar'];
handler.tags = ['rpg'];
handler.command = ['comprar'];

export default handler;
