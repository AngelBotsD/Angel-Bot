import fs from 'fs';
import path from 'path';
import Jimp from 'jimp';
import { downloadContentFromMessage } from '@whiskeysockets/baileys';

let handler = async (m, { conn }) => {
  // Verifica que haya una imagen respondida
  if (!m.quoted || !m.quoted.message.imageMessage) {
    return m.reply('Responde a una imagen para redimensionarla a 96x96.');
  }

  try {
    // Descarga la imagen
    const stream = await downloadContentFromMessage(m.quoted.message.imageMessage, 'image');
    let buffer = Buffer.from([]);
    for await (const chunk of stream) {
      buffer = Buffer.concat([buffer, chunk]);
    }

    // Carga la imagen con Jimp
    const image = await Jimp.read(buffer);
    // Redimensiona a 96x96
    image.resize(96, 96);

    // Guarda temporalmente
    const outPath = path.join('./tmp/', `resized_${Date.now()}.png`);
    await image.writeAsync(outPath);

    // Envía la imagen redimensionada
    await conn.sendMessage(m.chat, { image: fs.readFileSync(outPath) }, { quoted: m });

    // Borra la temporal
    fs.unlinkSync(outPath);

  } catch (err) {
    console.error(err);
    m.reply('Ocurrió un error al procesar la imagen.');
  }
};

handler.command = /^lxl$/i;
export default handler;