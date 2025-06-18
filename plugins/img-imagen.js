import { googleImage } from '@bochilteam/scraper';

const handler = async (m, { conn, text, usedPrefix, command }) => {
  if (!text) throw `*🚩 Uso Correcto: ${usedPrefix + command} Avión*`;

  const botname = global.botname; 
  const wm = '𝙎𝙄𝙎𝙆𝙀𝘿 - 𝙂𝙊𝙊𝘿';
  const channel = global.channel;
  const textbot = global.textbot; 
  const rcanal = icons;

  conn.reply(m.chat, '🚩 *Descargando su imagen...*', m, {
    contextInfo: {
      externalAdReply: {
        mediaUrl: null,
        mediaType: 1,
        showAdAttribution: true,
        title: botname,
        body: wm,
        previewType: 0,
        sourceUrl: channel,
      },
    },
  });

  const res = await googleImage(text);
  const image = await res.getRandom();
  const link = image;

  conn.sendFile(m.chat, link, 'error.jpg', `*🔎 Resultado De: ${text}*\n> ${textbot}`, m, null, rcanal);
};

handler.help = ['imagen <query>'];
handler.tags = ['buscador', 'tools', 'descargas'];
handler.command = ['imagen', 'image'];

export default handler;
