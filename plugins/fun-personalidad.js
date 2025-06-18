let handler = async (m, { conn, command, text, participants }) => {
    if (!text) return m.reply(`🚩 Ingresa un nombre justo al comando.`)

    let user
    if (m.mentionedJid?.length) {
        user = m.mentionedJid[0]
    } else if (m.quoted?.sender) {
        user = m.quoted.sender
    } else {
        user = m.sender
    }

    let personalidad = `
┏━━°❀❬ *PERSONALIDAD* ❭❀°━━┓
*┃*
*┃• Nombre* : ${text}
*┃• Buena Moral* : ${pickRandom(valores)}
*┃• Mala Moral* : ${pickRandom(valores)}
*┃• Tipo de persona* : ${pickRandom(['De buen corazón','Arrogante','Tacaño','Generoso','Humilde','Tímido','Cobarde','Entrometido','Cristal','No binarie XD','Pendejo'])}
*┃• Siempre* : ${pickRandom(['Pesado','De malas','Distraído','De molestoso','Chismoso','Pasa jalandosela','De compras','Viendo anime','Chatea en WhatsApp porque está soltero','Acostado bueno para nada','De mujeriego','En el celular'])}
*┃• Inteligencia* : ${pickRandom(valores)}
*┃• Morosidad* : ${pickRandom(valores)}
*┃• Coraje* : ${pickRandom(valores)}
*┃• Miedo* : ${pickRandom(valores)}
*┃• Fama* : ${pickRandom(valores)}
*┃• Género* : ${pickRandom(['Hombre','Mujer','Homosexual','Bisexual','Pansexual','Feminista','Heterosexual','Macho alfa','Mujerzona','Marimacha','Palosexual','PlayStationSexual','Sr. Manuela','Pollosexual'])}
┗━━━━━━━━━━━━━━━━
`.trim()

    conn.reply(m.chat, personalidad, m, { mentions: [user] })
}

handler.help = ['personalidad *<nombre>*']
handler.tags = ['fun']
handler.command = /^personalidad$/i

export default handler

const valores = ['6%','12%','20%','27%','35%','41%','49%','54%','60%','66%','73%','78%','84%','92%','93%','94%','96%','98.3%','99.7%','99.9%','1%','2.9%','0%','0.4%']

function pickRandom(list) {
  return list[Math.floor(Math.random() * list.length)]
}
