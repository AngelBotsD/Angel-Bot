let cooldowns = {};

let handler = async (m, { conn, args, usedPrefix, command }) => {
    if (!args[0]) return m.reply('🍭 Ingresa la cantidad de *🍬 Dulces* que deseas apostar.\n\n`Ejemplo:`\n' + `> *${usedPrefix + command}* 10`);
    if (isNaN(args[0])) return m.reply('🍭 Ingresa la cantidad de *🍬 Dulces* que deseas apostar.\n\n`Ejemplo:`\n' + `> *${usedPrefix + command}* 10`);
    
    let apuesta = parseInt(args[0]);
    let users = global.db.data.users[m.sender];

    if (apuesta > users.limit) {
        return m.reply(`😔 No tienes suficientes *🍬 Dulces* para apostar.\nActualmente tienes: *${users.limit} 🍬 Dulces*`);
    }

    let tiempoEspera = 15;	    
    if (cooldowns[m.sender] && Date.now() - cooldowns[m.sender] < tiempoEspera * 1000) {
        let tiempoRestante = segundosAHMS(Math.ceil((cooldowns[m.sender] + tiempoEspera * 1000 - Date.now()) / 1000));
        return m.reply(`⏱ Espera *${tiempoRestante}* para apostar nuevamente.`);
    }

    let emojis = ["🍎", "🍉", "🍓"];
    let a = Math.floor(Math.random() * emojis.length);
    let b = Math.floor(Math.random() * emojis.length);
    let c = Math.floor(Math.random() * emojis.length);
    let x = [], y = [], z = [];

    for (let i = 0; i < 3; i++) {
        x[i] = emojis[a];
        a++;
        if (a == emojis.length) a = 0;
    }
    for (let i = 0; i < 3; i++) {
        y[i] = emojis[b];
        b++;
        if (b == emojis.length) b = 0;
    }
    for (let i = 0; i < 3; i++) {
        z[i] = emojis[c];
        c++;
        if (c == emojis.length) c = 0;
    }

    let end;
    if (a == b && b == c) {
        end = `🎉 ¡Felicidades! Acabas de ganar *${apuesta} 🍬 Dulces*.`;
        users.limit += apuesta;
    } else if (a == b || a == c || b == c) {
        end = `Casi lo logras, sigue intentando 😊\n¡Ten *1 🍬 Dulce*!`;
        users.limit += 1;
    } else {
        end = `😢 Perdiste *${apuesta} 🍬 Dulces*. ¡Mejor suerte la próxima vez!`;
        users.limit -= apuesta;
    }

    cooldowns[m.sender] = Date.now();
    return await conn.reply(m.chat, 
        `
  🎰 | *SLOTS* 
──────────
${x[0]} : ${y[0]} : ${z[0]}
${x[1]} : ${y[1]} : ${z[1]}
${x[2]} : ${y[2]} : ${z[2]}
────────── 

${end}`, m);
};

handler.help = ['slot <apuesta>'];
handler.tags = ['fun'];
handler.command = ['slot'];
handler.group = false;

export default handler;

function segundosAHMS(segundos) {
    let segundosRestantes = segundos % 60;
    return `${segundosRestantes} segundos`;
}
