let handler = async (m, { conn, text }) => {
    if (!text) throw '⚠️ *_Ingrese el tiempo y el motivo. Ejemplo: .recordar 2-M Tomar medicina_*';

    let parts = text.split(' ');
    if (parts.length < 2) throw '⚠️ *_Debe especificar al menos el tiempo y el motivo. Ejemplo: .recordar 2-M Tomar medicina_*';

    let timePart = parts[0];
    let timeMatch = timePart.match(/^(\d+)-(M|H)$/i);
    if (!timeMatch) throw '⚠️ *_Formato de tiempo no válido. Use M (minutos) o H (horas). Ejemplo: .recordar 2-M Tomar medicina_*';

    let [, amount, unit] = timeMatch;
    amount = parseInt(amount);
    if (amount <= 0) throw '⚠️ *_La cantidad de tiempo debe ser mayor a 0._*';

    let repeatCount = 1;
    let reasonStartIndex = 1;

    if (/^\d+$/.test(parts[1])) {
        repeatCount = parseInt(parts[1]);
        if (repeatCount <= 0) throw '⚠️ *_La cantidad de repeticiones debe ser mayor a 0._*';
        reasonStartIndex = 2;
    }

    let reason = parts.slice(reasonStartIndex).join(' ');
    if (reason.length < 5) throw '⚠️ *_El motivo debe tener al menos 5 caracteres._*';

    let ms = unit.toUpperCase() === 'M' ? amount * 60 * 1000 : amount * 60 * 60 * 1000;

    m.reply(`⏰ *_Recordatorio programado._*\n\n📅 Intervalo: cada ${amount} ${unit.toUpperCase()}\n🔁 Repeticiones: ${repeatCount}\n📝 Motivo: ${reason}`);

    for (let i = 0; i < repeatCount; i++) {
        setTimeout(async () => {
            if (m.isGroup) {
                let metadata = await conn.groupMetadata(m.chat);
                let mentions = metadata.participants.map(u => u.id);
                let groupName = metadata.subject;

                let notification = `⏰ *Recordatorio ${repeatCount > 1 ? `${i + 1}/${repeatCount}` : ''}*\n\n📝 *Motivo:* ${reason}\n📍 *Grupo:* ${groupName}`;

                await conn.sendMessage(m.chat, {
                    text: notification,
                    mentions
                });
            } else {
                let notification = `⏰ *Recordatorio ${repeatCount > 1 ? `${i + 1}/${repeatCount}` : ''}*\n\n📝 *Motivo:* ${reason}`;
                await conn.sendMessage(m.chat, { text: notification });
            }
        }, ms * i);
    }
};

handler.help = ['record'];
handler.tags = ['main'];
handler.command = ['record'];
handler.group = true;
handler.admin = true;

export default handler;
