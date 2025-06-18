let handler = (m, { usedPrefix, command, text }) => {
    if (!text) throw `Ejemplo:\n${usedPrefix + command} 2007 07 28`;

    const date = new Date(text.trim());
    if (isNaN(date)) throw `❌ *Fecha inválida*. Prueba con el siguiente formato:\n\n${usedPrefix + command} AAAA MM DD\nEjemplo: 2007 07 28`;

    const d = new Date();
    const [tahun, bulan, tanggal] = [d.getFullYear(), d.getMonth() + 1, d.getDate()];
    const birth = [date.getFullYear(), date.getMonth() + 1, date.getDate()];

    const zodiac = getZodiac(birth[1], birth[2]);
    const ageD = new Date(d - date);
    const age = ageD.getUTCFullYear() - 1970; // Calcula correctamente la edad

    const birthday = [tahun + (birth[1] < bulan || (birth[1] === bulan && birth[2] <= tanggal)), ...birth.slice(1)];
    const cekusia = bulan === birth[1] && tanggal === birth[2] ? `${age} - ¡Feliz cumpleaños! 🎉` : age;

    const teks = `
📅 *Fecha de nacimiento*: ${birth.join('-')}
🎂 *Próximo cumpleaños*: ${birthday.join('-')}
🗓️ *Edad*: ${cekusia} años
🔮 *Signo zodiacal*: ${zodiac}
`.trim();

    m.reply(teks);
};

handler.help = ['zodiac *AAAA MM DD*'];
handler.tags = ['fun'];
handler.command = ['zodiac'];

export default handler;

const zodiak = [
    ["Capricornio", new Date(1970, 0, 1)],
    ["Acuario", new Date(1970, 0, 20)],
    ["Piscis", new Date(1970, 1, 19)],
    ["Aries", new Date(1970, 2, 21)],
    ["Tauro", new Date(1970, 3, 21)],
    ["Géminis", new Date(1970, 4, 21)],
    ["Cáncer", new Date(1970, 5, 22)],
    ["Leo", new Date(1970, 6, 23)],
    ["Virgo", new Date(1970, 7, 23)],
    ["Libra", new Date(1970, 8, 23)],
    ["Escorpio", new Date(1970, 9, 23)],
    ["Sagitario", new Date(1970, 10, 22)],
    ["Capricornio", new Date(1970, 11, 22)]
].reverse();

function getZodiac(month, day) {
    let d = new Date(1970, month - 1, day);
    let result = zodiak.find(([_, _d]) => d >= _d);
    if (!result) return "Desconocido"; // Manejo de error si no encuentra
    return result[0];
}
