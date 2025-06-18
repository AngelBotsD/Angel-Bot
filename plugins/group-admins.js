const getGroupAdmins = (participants) => {
    let admins = [];
    for (let i of participants) {
        if (i.admin || i.isAdmin) admins.push(i.id || i.jid);
    }
    return admins;
};

const handler = async (m, { conn, participants, args }) => {
    let defaultPP = 'https://qu.ax/Ghdtl.jpg';
    let pp = defaultPP; 

    try {
        
        pp = await conn.profilePictureUrl(m.chat, 'image');
    } catch (e) {
        console.log("No se pudo obtener la imagen del grupo, usando la predeterminada.");
    }

    const groupAdmins = getGroupAdmins(participants);

    let pesan = args.join(' ') || '¡Atención administradores!';
    let oi = `𝙼𝚎𝚗𝚜𝚊𝚓𝚎 ✭ ${pesan}`;
    let listAdmin = groupAdmins.map((v, i) => `${i + 1}. @${v.split('@')[0]}`).join('\n');
    let listMessage = listAdmin.length > 0 ? listAdmin : 'No hay administradores en este grupo.';
    let text = `
                               »» ✭ 𝙸𝙽𝚅𝙾𝙲𝙰𝙽𝙳𝙾 𝙰𝙳𝙼𝙸𝙽𝚂 ✭ ««    

${oi}

${listMessage}

𝚄𝚝𝚒𝚕𝚒𝚣𝚊 𝚎𝚜𝚝𝚎 𝚌𝚘𝚖𝚊𝚗𝚍𝚘 𝚙𝚊𝚛𝚊 𝚕𝚕𝚊𝚖𝚊𝚛 𝚊 𝚝𝚞𝚜 𝚊𝚍𝚖𝚒𝚗𝚒𝚜𝚝𝚛𝚊𝚍𝚘𝚛𝚎𝚜.  
`.trim();
    let ownernya = [`${m.chat.split`-`[0]}@s.whatsapp.net`];

    
    let mentionedJid = groupAdmins.concat(ownernya);

    await conn.sendFile(m.chat, pp, 'group-profile.jpg', text, m, false, { 
        contextInfo: { mentionedJid }
    });
};
handler.help = ['admins < Texto >']
handler.tags = ['group']
handler.command = /^(admins|admin)$/i;
handler.group = true;

export default handler;
