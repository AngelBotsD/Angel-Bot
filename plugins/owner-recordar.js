let handler = async (m, { conn, text, usedPrefix, command }) => {
    if (!text) throw '⚠️ *_Ingrese el tiempo y el motivo para el recordatorio. Ejemplo: .recordar 2-H Motivo_*';
    
    let [time, ...reasonArr] = text.split(' ');
    if (!time || !reasonArr.length) throw '⚠️ *_Debe especificar el tiempo y el motivo. Ejemplo: .recordar 2-H Motivo_*';

    let reason = reasonArr.join(' ');
    if (reason.length < 5) throw '⚠️ *_El motivo debe tener al menos 5 caracteres._*';

    let timeMatch = time.match(/^(\d+)-(S|M|H|D)$/i);
    if (!timeMatch) throw '⚠️ *_Formato de tiempo no válido. Use S (segundos), M (minutos), H (horas) o D (días). Ejemplo: .recordar 2-H Motivo_*';

    let [, amount, unit] = timeMatch;
    amount = parseInt(amount);
    if (amount <= 0) throw '⚠️ *_La cantidad de tiempo debe ser mayor a 0._*';

    // Calcular el tiempo en milisegundos
    let ms;
    switch (unit.toUpperCase()) {
        case 'S': ms = amount * 1000; break;
        case 'M': ms = amount * 60 * 1000; break;
        case 'H': ms = amount * 60 * 60 * 1000; break;
        case 'D': ms = amount * 24 * 60 * 60 * 1000; break;
    }

    let groupName = m.isGroup ? (await conn.groupMetadata(m.chat)).subject : 'Chat privado';
    let groupLink = m.isGroup ? await conn.groupInviteCode(m.chat).then(code => `https://chat.whatsapp.com/${code}`) : 'N/A';

    m.reply(`⏰ *_Recordatorio programado con éxito._*\n\n📅 Tiempo: ${amount} ${unit.toUpperCase()}\n📝 Motivo: ${reason}`);

    setTimeout(async () => {
        let notification = `⏰ *Recordatorio*\n\n📝 *Motivo:* ${reason}\n📍 *Grupo:* ${groupName}\n🔗 *Link del grupo:* ${groupLink}`;

        // Enviar el recordatorio al grupo donde se configuró
        if (m.isGroup) {
            await conn.sendMessage(m.chat, { text: notification });
        }

        // Enviar el recordatorio al owner por privado
        if (global.owner && Array.isArray(global.owner)) {
            for (let owner of global.owner) {
                let ownerNumber = owner[0] + '@s.whatsapp.net';
                await conn.reply(ownerNumber, notification);
            }
        }
    }, ms);
};

handler.help = ['recordar'];
handler.tags = ['main'];
handler.command = ['recordar'];
handler.owner = true;

export default handler;
