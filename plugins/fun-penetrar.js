let handler = async (m, { conn, command, text }) => {

    if (!m.mentionedJid || !m.mentionedJid[0]) {
        throw `*Debes mencionar a alguien usando @ o responder a un mensaje si quieres saber si te puedes ${command.replace('how', '')}*`;
    }

    let user = m.mentionedJid[0]; 
    let name = text || `@${user.split('@')[0]}`; 

    conn.reply(
        m.chat,
        `
*¡TE HAN LLENADO LA CARA DE SEMEN POR PUTA Y ZORRA!*

*Le han metido el pene a ${name}* con todo y condón hasta quedar seco, has dicho: 
"¡Por favor más duroooooo!, ahhhhhhh, ahhhhhh, hazme un hijo que sea igual de pitudo que tú!" 
mientras te penetraba y luego te ha dejado en silla de ruedas.

*${name}* 
🔥 *¡YA TE HAN PENETRADO!*`,
        null,
        { mentions: [user] }
    );
};

handler.help = ['penetrar @user'];
handler.tags = ['fun'];
handler.command = ['penetrar', 'penetrado'];
handler.group = true;
handler.fail = null;

export default handler;
