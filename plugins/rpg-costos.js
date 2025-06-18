const mascotaPrecios = {
  '🐶 Perro': 50,
  '🐱 Gato': 40,
  '🦅 Águila': 80,
  '🐺 Lobo': 100,
  '🐹 Hámster': 60,
  '🐤 Pollito': 30,
  '🦜 Loro': 35,
  '🐔 Gallina': 45,
  '🐧 Pingüino': 50,
  '🐒 Simio': 70,
  '🐊 Cocodrilo': 90,
  '🐯 Tigre': 110,
  '🦁 León': 120
};

let handler = async (m) => {
  // Construye el mensaje con los precios de las mascotas
  let mensaje = 'Las mascotas cuestan:\n';

  for (let mascota in mascotaPrecios) {
    mensaje += `- *${mascota}*: ${mascotaPrecios[mascota]} 🍬 Dulces\n`;
  }

  // Envia el mensaje con los precios
  m.reply(mensaje);
};

handler.help = ['costos'];
handler.tags = ['rpg'];
handler.command = ['costos'];

export default handler;
