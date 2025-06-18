import { canLevelUp, xpRange } from '../lib/levelling.js'

const empleadoPrecios = {
  'María': 80,
  'Andrés': 80,
  'Gaby': 80
};

let handler = async (m, { conn, args }) => {
  const user = global.db.data.users[m.sender];
  const empleadoElegido = args.join(' ') || '';

  // Verificar si se seleccionó un empleado válido y si el usuario cumple los requisitos
  if (!empleadoElegido || !empleadoPrecios[empleadoElegido]) {
    m.reply(`Elige un empleado válido: *María*, *Andrés*, *Gaby*.\nNivel 3 o superior requerido.`);
    return;
  }

  if (user.level < 3) {
    m.reply(`Eres nivel *${user.level}* ❌. Necesitas ser al menos *nivel 3* para contratar a *${empleadoElegido}*.`);
    return;
  }

  // Verificar si ya tiene un empleado
  if (user.empleado) {
    m.reply(`Ya tienes contratado a *${user.empleado}*. No puedes contratar a otro.`);
    return;
  }

  // Verificar si tiene suficientes dulces
  const precio = empleadoPrecios[empleadoElegido];
  if (user.limit < precio) {
    m.reply(`No tienes suficientes dulces para contratar a *${empleadoElegido}*. Necesitas *${precio} 🍬 dulces*.`);
    return;
  }

  // Contratar al empleado y restar los dulces
  user.limit -= precio;
  user.empleado = empleadoElegido;
  m.reply(`¡Felicidades! Has contratado a *${empleadoElegido}* 🧑‍💼.`);
};

handler.help = ['contratar'];
handler.tags = ['rpg'];
handler.command = ['contratar'];

export default handler;
