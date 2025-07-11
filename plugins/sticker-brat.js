import { sticker } from '../lib/sticker.js';
import axios from 'axios';

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

const fetchSticker = async (text, attempt = 1) => {
    try {
        const response = await axios.get(`https://kepolu-brat.hf.space/brat`, {
            params: { q: text },
            responseType: 'arraybuffer',
        });

        const contentType = response.headers['content-type'] || '';
        if (!contentType.startsWith('image/')) {
            throw new Error('La respuesta no fue una imagen válida.');
        }

        return response.data;
    } catch (error) {
        if (error.response?.status === 429 && attempt <= 3) {
            const retryAfter = parseInt(error.response.headers['retry-after'] || '5');
            await delay(retryAfter * 1000);
            return fetchSticker(text, attempt + 1);
        }
        throw new Error(error.message || 'Error inesperado al obtener el sticker');
    }
};

let handler = async (m, { conn, text, command, usedPrefix }) => {
    if (!text) {
        return conn.reply(m.chat, `⚠️ *Uso incorrecto del comando.*\n\n*Ejemplo:*  ${usedPrefix + command} La tengo regrande`, m);
    }

    try {
        const buffer = await fetchSticker(text);
        const stiker = await sticker(buffer, false, 'Whitxs 𝚆𝙷𝙰𝚃𝚂𝙰𝙿𝙿 - bot', '@Josefdorante - 20');

        if (stiker) {
            await conn.sendFile(
                m.chat,
                stiker,
                'sticker.webp',
                '',
                m,
                true,
                {},
                { quoted: m }
            );
        } else {
            throw new Error("No se pudo generar el sticker.");
        }
    } catch (error) {
        console.error(error);
        return conn.sendMessage(
            m.chat,
            { text: `⚠️ *Ocurrió un error:* ${error.message}` },
            { quoted: m }
        );
    }
};

handler.command = ['brat'];
handler.tags = ['sticker'];
handler.help = ['brat *<texto>*'];

export default handler;
