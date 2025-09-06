import fs from 'fs';
import path from 'path';

var handler = async (m, { conn, usedPrefix, command, isOwner }) => {
    try {
        if (!isOwner) {
            return global.dfail('owner', m, conn);
        }

        await m.react('🕒'); 
        conn.sendPresenceUpdate('composing', m.chat);

        const pluginsDir = './plugins';
        const files = fs.readdirSync(pluginsDir).filter(file => file.endsWith('.js'));

        let response = `*⚠️ Revisión de Errores*\n\n`;
        let hasErrors = false;

        for (const file of files) {
            try {
                await import(path.resolve(pluginsDir, file));
            } catch (error) {
                hasErrors = true;
                response += `🚩 *Error en:* ${file}\n${error.message}\n\n`;
            }
        }

        if (!hasErrors) {
            response += 'No se detectaron Errores 👋🏻.';
        }

        await conn.reply(m.chat, response, m);
        await m.react('✅');
    } catch (err) {
        await m.react('✖️'); 
        console.error(err);
        conn.reply(m.chat, '🚩 *Ocurrió un fallo al verificar los plugins.*', m);
    }
};

handler.command = ['rev'];
handler.help = ['rev'];
handler.tags = ['tools'];

export default handler;