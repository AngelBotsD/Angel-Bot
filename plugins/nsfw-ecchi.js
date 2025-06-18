import fs from 'fs';
import path from 'path';

let handler = async (m, { conn }) => {
    // Verificar si el modo NSFW está habilitado
    if (!global.db.data.chats[m.chat].nsfw) return m.reply(`El grupo no admite contenido *NSFW.*`);

    // Reacción actualizada
    m.react('🔥');

    // Lista de imágenes actualizadas
    let imagenes = [
        "https://telegra.ph/file/03f516d8330f9f991680e.jpg",
        "https://telegra.ph/file/aeb205d2f14d1c5c2a8c9.jpg",
        "https://telegra.ph/file/33bd49b5b8d21b84091a3.jpg",
        "https://telegra.ph/file/7d1cdb0e363899e76b92a.jpg",
        "https://telegra.ph/file/2938759c4125700ccdf49.jpg",
        "https://telegra.ph/file/a144a667876ef3d9adc73.jpg",
        "https://telegra.ph/file/ee214546c32ba17d51a58.jpg",
        "https://telegra.ph/file/fe1a912d32bbbd3a8f9f7.jpg",
        "https://telegra.ph/file/652453dd6441043fc8167.jpg",
        "https://telegra.ph/file/471b8a6ae5e6085228dd7.jpg",
        "https://telegra.ph/file/5b39d55dcde29dbc00860.jpg",
        "https://telegra.ph/file/cf618783ecbabc7c12447.jpg"
    ];

    const imagen = imagenes[Math.floor(Math.random() * imagenes.length)]; // Selección aleatoria de imagen

    // Envío de la imagen sin mensaje ni mención
    await conn.sendMessage(m.chat, { 
        image: { url: imagen }
    }, { quoted: m });
};

handler.help = ['ecchi'];
handler.tags = ['nsfw'];
handler.command = ['ecchi'];
handler.group = true;

export default handler;
