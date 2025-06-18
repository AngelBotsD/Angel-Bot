const handler = async (m, { conn, text }) => {
  if (!text) {
    return m.reply('❗ *Falta el mensaje a enviar*.\n\nEjemplo: `/mensajeoficial Este es un anuncio importante.`');
  }

  const fkontak = { 
    "key": { 
      "participants": "0@s.whatsapp.net", 
      "remoteJid": "status@broadcast", 
      "fromMe": false, 
      "id": "Halo" 
    }, 
    "message": { 
      "contactMessage": { 
        "vcard": `BEGIN:VCARD\nVERSION:3.0\nN:Sy;Bot;;;\nFN:y\nitem1.TEL;waid=${m.sender.split('@')[0]}:${m.sender.split('@')[0]}\nitem1.X-ABLabel:Ponsel\nEND:VCARD` 
      }
    }, 
    "participant": "0@s.whatsapp.net"
  };

  const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms)); // Función para retrasar

  let successCount = 0;
  let failCount = 0;

  try {
    const groups = Object.entries(conn.chats).filter(([jid, chat]) => jid.endsWith('@g.us') && chat.isChats);

    for (let i = 0; i < groups.length; i++) {
      const [jid] = groups[i];
      try {
        // Verifica si el bot sigue en el grupo
        const groupMetadata = await conn.groupMetadata(jid).catch(() => null);
        if (!groupMetadata) {
          console.log(`Bot no tiene acceso al grupo: ${jid}`);
          failCount++;
          continue;
        }

        // Envía el mensaje al grupo con un retraso
        await conn.sendMessage(jid, { text: `📢 *MENSAJE OFICIAL*\n\n${text}` }, { quoted: fkontak });
        console.log(`Mensaje enviado correctamente al grupo: ${jid}`);
        successCount++;

        // Introduce un retraso de 2 segundos entre mensajes
        await delay(2000); 
      } catch (e) {
        console.error(`Error al enviar mensaje al grupo: ${jid}`, e);
        failCount++;
      }
    }

    m.reply(`✅ *Mensaje enviado correctamente a ${successCount} grupos.*\n❌ *Falló en ${failCount} grupos.*`);
  } catch (err) {
    console.error(err);
    m.reply('❌ *Ocurrió un error al intentar enviar el mensaje.*');
  }
};

handler.help = ['anuncio'];
handler.tags = ['owner'];
handler.command = /^(mensajeoficial|anuncio|broadcast)$/i;
handler.owner = true;

export default handler;
