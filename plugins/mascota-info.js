let handler = async (m, { conn }) => {  
  const user = global.db.data.users[m.sender];  
  if (!user.mascota) {    
    m.reply(`❌ No tienes una mascota. Usa el comando *mimascota* para obtener una.`);    
    return;  
  }  

  const nivelMascota = user.mascotaNivel || 0; // Si no tiene nivel, muestra 0  
  const comidaDisponible = user.comida || 0; // Si no tiene comida, muestra 0  
  const vidaMascota = user.vida || 0; // Si no tiene vida, muestra 0  
  const propietario = `@${m.sender.split('@')[0]}`;  

  const mensaje = `🐾 *Info Mascota* ${user.mascota}\n\n` +    
    `• *Propietario:* ${propietario}\n` +    
    `• *Nivel:* ${nivelMascota}\n` +    
    `• *Comida:* ${comidaDisponible} 🍖\n` +    
    `• *Vida:* ${vidaMascota} ❤️`;  // Muestra la vida de la mascota

  conn.reply(m.chat, mensaje, m, { mentions: [m.sender] });
};

handler.help = ['infomasc'];
handler.tags = ['masc'];
handler.command = ['infomasc', 'mascota'];

export default handler;
