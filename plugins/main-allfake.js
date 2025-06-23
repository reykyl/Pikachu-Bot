import pkg from '@whiskeysockets/baileys'
import fs from 'fs'
import fetch from 'node-fetch'
import axios from 'axios'
import moment from 'moment-timezone'
const { generateWAMessageFromContent, prepareWAMessageMedia, proto } = pkg

var handler = m => m
handler.all = async function (m, { conn }) {

  global.getBuffer = async function getBuffer(url, options = {}) {
    try {
      const res = await axios({
        method: "get",
        url,
        headers: {
          'DNT': 1,
          'User-Agent': 'GoogleBot',
          'Upgrade-Insecure-Request': 1
        },
        ...options,
        responseType: 'arraybuffer'
      })
      return res.data
    } catch (e) {
      console.log(`Error : ${e}`)
    }
  }

  // Funciones utilitarias
  function pickRandom(list) {
    return list[Math.floor(Math.random() * list.length)]
  }

  async function getRandomChannel() {
    let randomIndex = Math.floor(Math.random() * canalIdM.length)
    let id = canalIdM[randomIndex]
    let name = canalNombreM[randomIndex]
    return { id, name }
  }

  // Datos de canal
  global.idchannel = '120363365444927738@newsletter'
  global.canalIdM = ["120363365444927738@newsletter"]
  global.canalNombreM = ["⚡️𝙋𝙞𝙠𝙖𝙘𝙝𝙪-𝘽𝙤𝙩 ⚡ 𝘾𝙝𝙖𝙣𝙣𝙚𝙡"]
  global.channelRD = await getRandomChannel()

  // Bot info
  global.creador = 'Wa.me/50433191934'
  global.ofcbot = `Wa.me/${conn.user.jid.split('@')[0]}?text=⚡creador`
  global.asistencia = 'Wa.me/50433191934'
  global.namechannel = canalNombreM[0]
  global.namechannel2 = "⚡️𝙋𝙞𝙠𝙖𝙘𝙝𝙪-𝘽𝙤𝙩 ⚡"
  global.namegrupo = global.namechannel2
  global.namecomu = "⚡️𝙋𝙞𝙠𝙖𝙘𝙝𝙪-𝘽𝙤𝙩 ⚡ 𝘾𝙤𝙢𝙪𝙣𝙞𝙩𝙮"
  global.listo = '⚡ *¡Aquí tienes lo que pediste, maestro pokémon!*'

  global.fotoperfil = await conn.profilePictureUrl(m.sender, 'image').catch(_ => null)

  // Fecha y hora
  global.d = new Date(Date.now() + 3600000)
  global.locale = 'es'
  global.dia = d.toLocaleDateString(locale, { weekday: 'long' })
  global.fecha = d.toLocaleDateString('es', { day: 'numeric', month: 'numeric', year: 'numeric' })
  global.mes = d.toLocaleDateString('es', { month: 'long' })
  global.año = d.toLocaleDateString('es', { year: 'numeric' })
  global.tiempo = d.toLocaleString('en-US', { hour: 'numeric', minute: 'numeric', second: 'numeric', hour12: true })

  // Reacciones
  global.rwait = '⚡'
  global.done = '✅'
  global.error = '✖️'
  global.msm = '⚠️'

  global.emoji0 = '*⚡(≧∇≦) ピカチュウ~! 🧃*\n'
  global.emoji1 = '*⚡(o≧▽ﾟ)o ピッカ〜!! 🧃*\n'
  global.emoji2 = '*⚡(✧ω✧) ピカ!! 🧃*\n'
  global.emoji3 = '*⚡(｡♥‿♥｡) ピカチュウ！🧃*\n'
  global.emoji4 = '*⚡(˘▾˘) ピィ〜カ〜！🧃*\n'
  global.emoji5 = '*⚡ᰔᩚ ( ᜊ°-° )ᜊ ピカッ！.ᐟ .ᐟ 🧃*\n'

  global.emojis = pickRandom([
    global.emoji0, global.emoji1, global.emoji2,
    global.emoji3, global.emoji4, global.emoji5
  ])

  global.wait = '⚡ *Espera un momento entrenador...*'
  global.waitt = global.wait
  global.waittt = global.wait
  global.waitttt = global.wait

  // Redes
  let canal = 'https://whatsapp.com/channel/0029VawF8fBBvvsktcInIz3m'
  let canal2 = 'https://whatsapp.com/channel/0029VawF8fBBvvsktcInIz3m'
  let git = 'https://github.com/Deylin-Eliac'
  let github = 'https://github.com/Deylin-Eliac/Pikachu-bot'
  let correo = 'deylibaquedano801@gmail.com'
  global.redes = pickRandom([canal, canal2, git, github, correo])

  // Imagen aleatoria de base de datos
  let category = "imagen"
  const db = './src/database/db.json'
  const db_ = JSON.parse(fs.readFileSync(db))
  const random = Math.floor(Math.random() * db_.links[category].length)
  const randomlink = db_.links[category][random]
  const response = await fetch(randomlink)
  const rimg = await response.buffer()
  global.icons = rimg

  // Saludo según hora
  const hourNow = new Date().getHours()
  const horarios = {
    0: 'Lɪɴᴅᴀ Nᴏᴄʜᴇ 🌃', 1: 'Lɪɴᴅᴀ Nᴏᴄʜᴇ 🌃', 2: 'Lɪɴᴅᴀ Nᴏᴄʜᴇ 🌃', 3: 'Lɪɴᴅᴀ Mᴀɴ̃ᴀɴᴀ 🌄',
    4: 'Lɪɴᴅᴀ Mᴀɴ̃ᴀɴᴀ 🌄', 5: 'Lɪɴᴅᴀ Mᴀɴ̃ᴀɴᴀ 🌄', 6: 'Lɪɴᴅᴀ Mᴀɴ̃ᴀɴᴀ 🌄', 7: 'Lɪɴᴅᴀ Mᴀɴ̃ᴀɴᴀ 🌅',
    8: 'Lɪɴᴅᴀ Mᴀɴ̃ᴀɴᴀ 🌄', 9: 'Lɪɴᴅᴀ Mᴀɴ̃ᴀɴᴀ 🌄', 10: 'Lɪɴᴅᴏ Dɪᴀ 🌤', 11: 'Lɪɴᴅᴏ Dɪᴀ 🌤',
    12: 'Lɪɴᴅᴏ Dɪᴀ 🌤', 13: 'Lɪɴᴅᴏ Dɪᴀ 🌤', 14: 'Lɪɴᴅᴀ Tᴀʀᴅᴇ 🌆', 15: 'Lɪɴᴅᴀ Tᴀʀᴅᴇ 🌆',
    16: 'Lɪɴᴅᴀ Tᴀʀᴅᴇ 🌆', 17: 'Lɪɴᴅᴀ Tᴀʀᴅᴇ 🌆', 18: 'Lɪɴᴅᴀ Nᴏᴄʜᴇ 🌃', 19: 'Lɪɴᴅᴀ Nᴏᴄʜᴇ 🌃',
    20: 'Lɪɴᴅᴀ Nᴏᴄʜᴇ 🌃', 21: 'Lɪɴᴅᴀ Nᴏᴄʜᴇ 🌃', 22: 'Lɪɴᴅᴀ Nᴏᴄʜᴇ 🌃', 23: 'Lɪɴᴅᴀ Nᴏᴄʜᴇ 🌃'
  }
  global.saludo = horarios[hourNow]

  // Etiquetas y fake contact
  global.nombre = m.pushName || 'Anónimo'
  global.taguser = '@' + m.sender.split("@")[0]
  global.readMore = String.fromCharCode(8206).repeat(850)

  let pp = await conn.profilePictureUrl('50433191934@s.whatsapp.net', 'image').catch(_ => null)
  global.fkontak = {
    key: {
      participant: `0@s.whatsapp.net`,
      ...(m.chat ? { remoteJid: `120363402481697721@g.us` } : {})
    },
    message: {
      contactMessage: {
        displayName: `Deylin creador ✨`,
        vcard: `BEGIN:VCARD\nVERSION:3.0\nN:XL;Deylin creador✨;;;\nFN:Deylin creador\nitem1.TEL;waid=50433191934:50433191934\nitem1.X-ABLabel:Ponsel\nEND:VCARD`,
        jpegThumbnail: pp ? await (await fetch(pp)).buffer() : null,
      }
    }
  }

  global.fake = {
    contextInfo: {
      isForwarded: true,
      forwardedNewsletterMessageInfo: {
        newsletterJid: global.channelRD.id,
        newsletterName: global.channelRD.name,
        serverMessageId: -1
      }
    }
  }

  global.icono = pickRandom([
    'https://kirito-bot-md.vercel.app/IMG-20250606-WA0167.jpg',
    'https://raw.githubusercontent.com/Deylin-Eliac/Pikachu-Bot/main/src/pika.jpg',
    'https://raw.githubusercontent.com/Deylin-Eliac/Pikachu-Bot/main/src/pikay.jpg',
    'https://raw.githubusercontent.com/Deylin-Eliac/Pikachu-Bot/main/src/pikachu.jpg',
    'https://kirito-bot-md.vercel.app/catalogo.jpg'
  ])

  global.rcanal = {
    contextInfo: {
      isForwarded: true,
      forwardedNewsletterMessageInfo: {
        newsletterJid: global.channelRD.id,
        serverMessageId: -1,
        newsletterName: global.channelRD.name,
      },
      mediaType: 1,
      renderLargerThumbnail: false
    }
  }

}

export default handler