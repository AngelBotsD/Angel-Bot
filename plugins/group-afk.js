const handler = async (m, {text}) => {
const user = global.db.data.users[m.sender];
user.afk = + new Date;
user.afkReason = text;
conn.reply(m.chat, `🚩 *El Usuario ${conn.getName(m.sender)} No jodan voy a dormir*\n\n*Motivo: ${text ? ': ' + text : 'Sin Especificar!'}*
`, m);
};
handler.help = ['afk <razón>'];
handler.tags = ['group'];
handler.command = ['afk'];
export default handler;
