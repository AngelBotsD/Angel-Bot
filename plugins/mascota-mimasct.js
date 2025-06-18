import { canLevelUp, xpRange } from '../lib/levelling.js'

const mascotaPrecios = {
  '🐤 Pollito': 30,
  '🦜 Loro': 35,
  '🐱 Gato': 40,
  '🐔 Gallina': 45,
  '🐶 Perro': 50,
  '🐧 Pingüino': 50,
  '🐹 Hámster': 60,
  '🐒 Simio': 70, 
  '🦅 Águila': 80,
  '🐊 Cocodrilo': 90,
  '🐺 Lobo': 100,
  '🐯 Tigre': 110,
  '🦁 León': 120
};

let handler = async (m, { conn, args }) => {
  const user = global.db.data.users[m.sender];
  const mascotaElegida = args.join(' ') || '';
   
  if (mascotaPrecios[mascotaElegida] && user.level < 1) {
    m.reply(`Eres nivel *${user.level}* ❌. Necesitas ser al menos *nivel 1* para comprar la mascota *${mascotaElegida}*.\n\nUsa *levelup* para subir de nivel y obtener tu mascota.`);
    return;
  }

   if (!mascotaElegida || !mascotaPrecios[mascotaElegida]) {
    m.reply(`Por favor, elige una mascota válida. Usa el comando de la siguiente forma:\n
*mimascota 🐤 Pollito*\n
*mimascota 🦜 Loro*\n
*mimascota 🐱 Gato*\n
*mimascota 🐔 Gallina*\n
*mimascota 🐶 Perro*\n
*mimascota 🐧 Pingüino*\n
*mimascota 🐹 Hámster*\n
*mimascota 🐒 Simio*\n
*mimascota 🦅 Águila*\n
*mimascota 🐊 Cocodrilo*\n
*mimascota 🐺 Lobo*\n
*mimascota 🐯 Tigre*\n
*mimascota 🦁 León*\n
\n🔒 *Requisito:* Debes ser *nivel 1* o superior para comprar cualquier mascota.\n
📋 El Comando debe ser escrito con Exactitud-Emoji-Mayúscula-Acentos.`);
    return;
  }

  if (user.mascota) {
    m.reply(`Ya tienes un: *${user.mascota}* 🐾. No puedes obtener otra.`);
    return;
  }

  const precio = mascotaPrecios[mascotaElegida];
  if (user.limit < precio) {
    m.reply(`No tienes suficientes dulces para comprar esta mascota. Necesitas *${precio} 🍬 dulces* para comprar un *${mascotaElegida}*.`);
    return;
  }

  user.limit -= precio;
  user.mascota = mascotaElegida;
  m.reply(`¡Felicidades! Has comprado una mascota: *${mascotaElegida}* 🐾. Cuídala bien. No olvides alimentarla cada 4 horas.`);
};

handler.help = ['mimascota'];
handler.tags = ['rpg'];
handler.command = ['mimascota'];

export default handler;
