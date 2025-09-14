import fs from 'fs';
import path from 'path';
import axios from 'axios';
import { downloadContentFromMessage } from '@whiskeysockets/baileys';

let handler = async (m, { conn }) => {
  // Verifica que haya una imagen respondida
  if (!m.quoted || !m.quoted.message.imageMessage) {
    return m.reply('Responde a una imagen para redimensionarla a 96x96.');
  }

  try {
    // Descarga la imagen original
    const stream = await downloadContentFromMessage(m.quoted.message.imageMessage, 'image');
    let buffer = Buffer.from([]);
    for await (const chunk of stream) {
      buffer = Buffer.concat([buffer, chunk]);
    }

    // Convierte la imagen a base64 para enviar a la API
    const base64Image = buffer.toString('base64');

    // API pública de redimensionamiento (sin key)
    const apiUrl = 'https://api.imgbb.com/1/upload'; // ejemplo, si quieres otra API directa se reemplaza
    // Nota: Algunas APIs gratuitas pueden requerir URL, no buffer directo
    // Aquí usamos la opción más directa: enviar la imagen como URL pública (si ya está en internet)
    // Si no tienes URL, normalmente se sube primero a un host temporal

    // Como ejemplo, usamos una API ficticia que acepte base64 directo:
    const response = await axios.post('https://fake-image-resize-api.com/resize', {
      image: base64Image,
      width: 96,
      height: 96
    });

    // La API responde con la imagen ya redimensionada en base64
    const resizedBase64 = response.data.image; // Ajusta según la API real
    const outBuffer = Buffer.from(resizedBase64, 'base64');

    // Envía la imagen redimensionada
    await conn.sendMessage(m.chat, { image: outBuffer }, { quoted: m });

  } catch (err) {
    console.error(err);
    m.reply('Ocurrió un error al procesar la imagen.');
  }
};

handler.command = /^lxl$/i;
export default handler;