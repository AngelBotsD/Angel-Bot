import fs from 'fs';
import path from 'path';

let handler = async (m, { conn, usedPrefix }) => {
    let who;

    if (m.mentionedJid.length > 0) {
        who = m.mentionedJid[0];
    } else if (m.quoted) {
        who = m.quoted.sender;
    } else {
        who = m.sender; 
    }

    let name = conn.getName(who);
    let name2 = conn.getName(m.sender); 
    m.react('🫦');
     
    let str;
    if (m.mentionedJid.length > 0) {
        str = `\`${name2}\` Le dio besos a \`${name || who}\` ( ˘ ³˘)♥.`;
    } else if (m.quoted) {
        str = `\`${name2}\` beso a \`${name || who}\` 💋.`;
    } else {
        str = `\`${name2}\` se besó a sí mismo ( ˘ ³˘)♥`.trim();
    }

    if (m.isGroup) {
        let pp1 = 'https://telegra.ph/file/d6ece99b5011aedd359e8.mp4'; 
        let pp2 = 'https://telegra.ph/file/ba841c699e9e039deadb3.mp4';
        let pp3 = 'https://telegra.ph/file/6497758a122357bc5bbb7.mp4';
        let pp4 = 'https://telegra.ph/file/8c0f70ed2bfd95a125993.mp4';
        let pp5 = 'https://telegra.ph/file/826ce3530ab20b15a496d.mp4';

        const videos = [pp1, pp2, pp3, pp4, pp5];
        const video = videos[Math.floor(Math.random() * videos.length)];
        let mentions = [who]; 

        await conn.sendMessage(m.chat, { video: { url: video }, gifPlayback: true, caption: str, mentions }, { quoted: m, sendMediaAsSticker: true });
    }
}

handler.help = ['besar @tag'];
handler.tags = ['fun'];
handler.command = ['kiss', 'besar'];
handler.group = true;

export default handler;
