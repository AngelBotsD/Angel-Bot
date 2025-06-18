let handler = async (m, { conn }) => {  
  const user = global.db.data.users[m.sender];  

  if (!user.mascota) {    
    m.reply(`❌ No tienes una mascota. Usa el comando *mimascota* para obtener una.`);    
    return;  
  }  

  const costoCambioNombre = 50;
  if (user.limit < costoCambioNombre) {
    m.reply(`❌ No tienes suficientes dulces para cambiar el nombre de tu mascota. Necesitas ${costoCambioNombre} dulces.`);
    return;
  }

  const nombreMascota = user.mascota;
  const emojiMascota = nombreMascota.split(' ')[0]; 
  const nombreActual = nombreMascota.split(' ').slice(1).join(' ');

  const args = m.text.split(' ').slice(1);
  if (args.length === 0) {
    m.reply('❌ Debes proporcionar un nuevo nombre para tu mascota. Ejemplo: .nombre Max');
    return;
  }

  const nuevoNombre = args.join(' ');

  if (nuevoNombre.length > 8) {
    m.reply('❌ El nuevo nombre no puede superar los 8 caracteres.');
    return;
  }

  if (/[\u{1F600}-\u{1F64F}\u{1F300}-\u{1F5FF}\u{1F680}-\u{1F6FF}\u{1F700}-\u{1F77F}\u{1F780}-\u{1F7FF}\u{1F800}-\u{1F8FF}\u{1F900}-\u{1F9FF}\u{1FA00}-\u{1FA6F}\u{1FA70}-\u{1FAFF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}\u{2300}-\u{23FF}]/u.test(nuevoNombre)) {
    m.reply('❌ El nombre no puede contener emojis.');
    return;
  }

  user.mascota = emojiMascota + ' ' + nuevoNombre;
  user.limit -= costoCambioNombre;

  m.reply(`✅ El nombre de tu mascota ha sido cambiado a *${user.mascota}*. Has pagado ${costoCambioNombre} dulces.`);
};

handler.help = ['nombre'];
handler.tags = ['masc'];
handler.command = ['nombre'];

export default handler;
