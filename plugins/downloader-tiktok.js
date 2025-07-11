import Scraper from '@SumiFX/Scraper'
import axios from 'axios'
import fetch from 'node-fetch'

let handler = async (m, { conn, args, usedPrefix, command }) => {
    if (!args[0]) {
        return m.reply(`🚩 Ingresa un enlace del vídeo de TikTok junto al comando.\n\nEjemplo:\n${usedPrefix + command} https://vt.tiktok.com/ZS6H7ghCv/`)
    }

    const url = args[0];
    if (!url.includes('tiktok.com')) {
        return conn.reply(m.chat, '⚠️ El enlace proporcionado no es de TikTok.', m);
    }

    try {
        let { title, published, quality, likes, commentCount, shareCount, views, dl_url, media_type } = await Scraper.tiktokdl(args[0]);

        if (media_type === 'image') {
            return conn.reply(m.chat, '⚠️ El enlace proporcionado no es un video de TikTok. Si es una imagen, usa el comando .tiktokimg para descargar imágenes.', m);
        }

        let txt = `📥「 *𝚃𝚒𝚔𝚃𝚘𝚔 𝙳𝚘𝚠𝚗𝚕𝚘𝚊𝚍* 」\n`
        txt += `*🌀 𝚃𝚒́𝚝𝚞𝚕𝚘* : ${title}\n`
        txt += `*📅 𝙿𝚞𝚋𝚕𝚒𝚌𝚊𝚍𝚘* : ${published}\n`
        txt += `*👍🏻 𝙻𝚒𝚔𝚎𝚜* : ${likes}\n`
        txt += `*👀 𝚅𝚒𝚜𝚒𝚝𝚊𝚜* : ${views}\n`
        txt += `\n> Whitxs Bot 📈`

        await conn.sendMessage(m.chat, { video: { url: dl_url }, caption: txt }, { quoted: m });
    } catch {
        try {
            const api = await fetch(`https://api-starlights-team.koyeb.app/api/tiktok?url=${args[0]}`)
            const data = await api.json()

            if (data.status) {
                const { author, view, comment, play, share, download, duration, title, video } = data.data;
                let txt = `📥「 *𝚃𝚒𝚔𝚃𝚘𝚔 𝙳𝚘𝚠𝚗𝚕𝚘𝚊𝚍* 」\n`
                txt += `*🌀 𝚃𝚒́𝚝𝚞𝚕𝚘* : ${title}\n`
                txt += `*📅 𝙿𝚞𝚋𝚕𝚒𝚌𝚊𝚍𝚘* : ${published}\n`
                txt += `*👍🏻 𝙻𝚒𝚔𝚎𝚜* : ${likes}\n`
                txt += `*👀 𝚅𝚒𝚜𝚒𝚝𝚊𝚜* : ${views}\n`
                txt += `\n> Whitxs Bot 📈`

                await conn.sendMessage(m.chat, { video: { url: video }, caption: txt }, { quoted: m })
            }
        } catch {
            try {
                const api1 = await fetch(`https://delirius-api-oficial.vercel.app/api/tiktok?url=${args[0]}`)
                const data1 = await api1.json()

                if (data1.status) {
                    const { author, repro, like, share, comment, download, duration, title, meta, published } = data1.data
                    const publishedDate = formatDate(published)
                    const fileSize = convertBytesToMB(meta.media[0].size_org)

                    let txt = `📥「 *𝚃𝚒𝚔𝚃𝚘𝚔 𝙳𝚘𝚠𝚗𝚕𝚘𝚊𝚍* 」\n`
                    txt += `*🌀 𝚃𝚒́𝚝𝚞𝚕𝚘* : ${title}\n`
                    txt += `*📅 𝙿𝚞𝚋𝚕𝚒𝚌𝚊𝚍𝚘* : ${published}\n`
                    txt += `*👍🏻 𝙻𝚒𝚔𝚎𝚜* : ${likes}\n`
                    txt += `*👀 𝚅𝚒𝚜𝚒𝚝𝚊𝚜* : ${views}\n`
                    txt += `\n> Whitxs bot 📈`

                    await conn.sendMessage(m.chat, { video: { url: meta.media[0].org }, caption: txt }, { quoted: m })
                }
            } catch {
                conn.reply(m.chat, '⚙️ Ocurrió un error al procesar el enlace.', m);
            }
        }
    }
}

handler.help = ['tiktok <url tt>']
handler.tags = ['downloader']
handler.command = ['tiktok', 'ttdl', 'tiktokdl', 'tiktoknowm']

export default handler

function convertBytesToMB(bytes) {
    return (bytes / (1024 * 1024)).toFixed(2) + ' MB'
}

function formatDate(unixTimestamp) {
    const date = new Date(unixTimestamp * 1000)
    return `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()} ${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}`
}
