let handler = async (m, { conn, args, usedPrefix, command }) => {
  const options = {
    open: "not_announcement",
    close: "announcement",
    abrir: "not_announcement",
    cerrar: "announcement",
    abierto: "not_announcement",
    cerrado: "announcement",
  };

  const choice = options[args[0]?.toLowerCase()];
  if (!choice) {
    throw `
╭───❖ 「 *Configuración* 」 ❖───
│ ✦ Uso correcto del comando:
│
│ ➤ ${usedPrefix + command} abrir
│ ➤ ${usedPrefix + command} cerrar
│
│ ✦ También puedes usar:
│   ${usedPrefix + command} open
│   ${usedPrefix + command} close
╰────────────────────❖
`.trim();
  }

  await conn.groupSettingUpdate(m.chat, choice);
  m.reply(`☁️ 𝘎𝘳𝘶𝘱𝘰 𝘊𝘰𝘯𝘧𝘪𝘨𝘶𝘳𝘢𝘥𝘰 𝘊𝘰𝘳𝘳𝘦𝘤𝘵𝘢𝘮𝘦𝘯𝘵𝘦`);
};

handler.help = ["group open / close", "grupo abrir / cerrar"];
handler.tags = ["group"];
handler.command = /^(group|grupo)$/i;
handler.admin = true;
handler.botAdmin = true;

export default handler;
