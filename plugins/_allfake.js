import pkg from '@whiskeysockets/baileys'
import fs from 'fs'
import fetch from 'node-fetch'
import axios from 'axios'
const { proto } = pkg

const handler = m => m

handler.all = async function (m, { conn }) {
  const who = m.messageStubParameters?.[0] + '@s.whatsapp.net'
  const user = global.db.data.users[who] || {}
  const pushname = m.pushName || 'Sin nombre'

  global.getBuffer = async function (url, options = {}) {
    try {
      const res = await axios.get(url, {
        headers: {
          'DNT': 1,
          'User-Agent': 'GoogleBot',
          'Upgrade-Insecure-Request': 1
        },
        responseType: 'arraybuffer',
        ...options
      })
      return res.data
    } catch (e) {
      console.error(`Error : ${e}`)
    }
  }

  global.creador = 'Wa.me/584122216538'
  global.asistencia = 'https://wa.me/qr/OEGLZUMXONHDL1'
  global.namechannel = 'WhitxsBot'

  global.rwait = '🕒'
  global.done = '✅'
  global.error = '✖️'

  const emojis = ['🍁', '⭐', '✨️', '😴']
  global.emojis = emojis[Math.floor(Math.random() * emojis.length)]

  global.wait = '🚀 Cargando...'

  const redes = [
    'https://whatsapp.com/channel/0029Vb47YlCLdQemgIavqj0v',
    'https://www.tiktok.com/@sisked1',
    'https://www.instagram.com/sisked_1',
    'anuarmazenett@gmail.com'
  ]
  global.redes = redes[Math.floor(Math.random() * redes.length)]

  const db = './src/database/db.json'
  const dbData = JSON.parse(fs.readFileSync(db))
  const imgLinks = dbData.links?.imagen || []
  const randomImg = imgLinks[Math.floor(Math.random() * imgLinks.length)]
  const response = await fetch(randomImg)
  global.icons = await response.buffer()

  global.icono = fs.readFileSync('./src/img/catalogo.jpg')

  global.fkontak = {
    key: {
      participant: '0@s.whatsapp.net',
      ...(m.chat ? { remoteJid: '6285600793871-1614953337@g.us' } : {})
    },
    message: {
      contactMessage: {
        displayName: pushname,
        vcard: `BEGIN:VCARD\nVERSION:3.0\nN:XL;${pushname},;;;\nFN:${pushname}\nTEL;waid=${m.sender.split('@')[0]}:${m.sender.split('@')[0]}\nEND:VCARD`,
        jpegThumbnail: null
      }
    }
  }

  global.fake = {
    contextInfo: {
      isForwarded: true,
      forwardedNewsletterMessageInfo: {
        newsletterJid: '120363393959332331@newsletter',
        newsletterName: global.namechannel,
        serverMessageId: -1
      }
    },
    quoted: m
  }

  global.rcanal = {
    contextInfo: {
      isForwarded: true,
      forwardedNewsletterMessageInfo: {
        newsletterJid: '120363393959332331@newsletter',
        serverMessageId: 100,
        newsletterName: global.namechannel
      },
      externalAdReply: {
        showAdAttribution: true,
        title: global.botname || 'Sisked Bot',
        body: global.dev || 'Sisked Dev',
        thumbnail: global.icono,
        sourceUrl: global.redes,
        mediaType: 1,
        renderLargerThumbnail: false
      }
    }
  }
}

export default handler