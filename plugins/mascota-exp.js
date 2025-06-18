import moment from 'moment-timezone';

let ultimaHoraProcesada = {};

async function otorgarExperiencia(conn) {
  const now = moment().tz("America/Caracas");
  const horaActual = now.hour();
  const minutosActuales = now.minute();
  const horasExperiencia = [6, 12, 18, 24];

  // Solo ejecuta si estamos dentro de los primeros 3 minutos de la hora de experiencia
  if (!horasExperiencia.includes(horaActual) || minutosActuales > 3) return;

  const usuarios = Object.keys(global.db.data.users);

  for (let userId of usuarios) {
    let user = global.db.data.users[userId];

    if (!user.mascota) continue; // Si no tiene mascota, no aplica
    if (ultimaHoraProcesada[userId] === horaActual) continue; // Evita múltiples asignaciones en la misma hora

    // Marcar la hora como procesada para evitar múltiples asignaciones
    ultimaHoraProcesada[userId] = horaActual;

    // Asignar 800 de experiencia al usuario con mascota
    if (user.exp === undefined) user.exp = 0; // Si no tiene experiencia, inicializarla
    user.exp += 800;
  }
}

// Ejecutar la función cada minuto para verificar la hora en Venezuela
setInterval(() => {
  otorgarExperiencia(global.conn);
}, 60 * 1000); // Se ejecuta cada minuto

