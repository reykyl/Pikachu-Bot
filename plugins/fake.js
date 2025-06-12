// 📦 Importaciones
import pkg from '@whiskeysockets/baileys'
import fs from 'fs'
import fetch from 'node-fetch'
import axios from 'axios'
import moment from 'moment-timezone'
const { generateWAMessageFromContent, prepareWAMessageMedia, proto } = pkg

var handler = m => m
handler.all = async function (m) {

// 🌐 Función Global para obtener Buffers
global.getBuffer = async function getBuffer(url, options) {
try {
options ? options : {}
var res = await axios({
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
}}

// 👑 Información del Bot
global.creador = 'Wa.me/50433191934'
global.ofcbot = `${conn.user.jid.split('@')[0]}`
global.asistencia = 'Wa.me/50433191934'
global.namechannel = '⚡️𝙋𝙞𝙠𝙖𝙘𝙝𝙪-𝘽𝙤𝙩 ⚡ 𝘾𝙝𝙖𝙣𝙣𝙚𝙡'
global.namechannel2 = '⚡️𝙋𝙞𝙠𝙖𝙘𝙝𝙪-𝘽𝙤𝙩 ⚡'
global.namegrupo = '⚡ 𝙋𝙞𝙠𝙖𝙘𝙝𝙪-𝘽𝙤𝙩 ⚡'
global.namecomu = '⚡️𝙋𝙞𝙠𝙖𝙘𝙝𝙪-𝘽𝙤𝙩 ⚡ 𝘾𝙤𝙢𝙪𝙣𝙞𝙩𝙮'
global.listo = '⚡ *¡Aquí tienes lo que pediste, maestro pokémon!*'
global.fotoperfil = await conn.profilePictureUrl(m.sender, 'image').catch(_ => 'https://i.postimg.cc/RFdNynN5/IMG-20250315-WA0122.jpg')

// 🗞 Canal del Bot
global.idchannel = '120363365444927738@newsletter'
global.canalIdM = ["120363365444927738@newsletter", "120363365444927738@newsletter"]
global.canalNombreM = ["⚡️𝙋𝙞𝙠𝙖𝙘𝙝𝙪-𝘽𝙤𝙩 ⚡ 𝘾𝙝𝙖𝙣𝙣𝙚𝙡", "⚡️𝙋𝙞𝙠𝙖𝙘𝙝𝙪-𝘽𝙤𝙩 ⚡"]
global.channelRD = await getRandomChannel()

// 📆 Fechas y Hora
global.d = new Date(new Date + 3600000)
global.locale = 'es'
global.dia = d.toLocaleDateString(locale, {weekday: 'long'})
global.fecha = d.toLocaleDateString('es', {day: 'numeric', month: 'numeric', year: 'numeric'})
global.mes = d.toLocaleDateString('es', {month: 'long'})
global.año = d.toLocaleDateString('es', {year: 'numeric'})
global.tiempo = d.toLocaleString('en-US', {hour: 'numeric', minute: 'numeric', second: 'numeric', hour12: true})

// 🔁 Reacciones Globales
global.rwait = '⚡'
global.done = '✅'
global.error = '✖️'
global.msm = '⚠️'

global.emoji0 = '*⚡*'
global.emoji2 = '*(≧▽≦)*'
global.emoji3 = '*(^・ω・^ )*'
global.emoji4 = '*ฅ՞•ﻌ•՞ฅ*'
global.emoji5 = '*⚡˙Ⱉ˙ฅ*'
global.emoji = [emoji0, emoji2, emoji3, emoji4, emoji5].getRandom()

global.wait = '⚡ *Espera un momento entrenador...*'
global.waitt = global.wait
global.waittt = global.wait
global.waitttt = global.wait

global.code = 'https://chat.whatsapp.com/IjpqfWuWYVfG9cDgR0AnKn'

// 🔗 Enlaces Importantes
var canal = 'https://whatsapp.com/channel/0029VawF8fBBvvsktcInIz3m'  
let canal2 = canal
var git = 'https://github.com/Deylin-Eliac'
var github = 'https://github.com/Deylin-Eliac/Kirito-Bot-MD' 
let correo = 'deylibaquedano801@gmail.com'

global.redes = [canal, canal2, git, github, correo].getRandom()

// 🖼 Imagen Aleatoria
let category = "imagen"
const db = './src/database/db.json'
const db_ = JSON.parse(fs.readFileSync(db))
const random = Math.floor(Math.random() * db_.links[category].length)
const randomlink = db_.links[category][random]
const response = await fetch(randomlink)
const rimg = await response.buffer()
global.icons = rimg

// 🌇 Mensaje según la hora
var ase = new Date(); var hour = ase.getHours(); switch(hour){
case 0:
case 1:
case 2:
case 18:
case 19:
case 20:
case 21:
case 22:
case 23:
hour = 'Buenas noches 🌙'; break
case 3:
case 4:
case 5:
case 6:
case 7:
case 8:
case 9:
hour = 'Buenos días 🌅'; break
case 10:
case 11:
case 12:
case 13:
hour = 'Buen día ☀️'; break
case 14:
case 15:
case 16:
case 17:
hour = 'Buenas tardes 🌆'; break
}
global.saludo = hour

// 🧍 Tags
global.nombre = m.pushName || 'Entrenador'
global.taguser = '@' + m.sender.split("@s.whatsapp.net")
var more = String.fromCharCode(8206)
global.readMore = more.repeat(850)

// 🧾 Fake Contacto
let pp = null; try { pp = await conn.profilePictureUrl('50433191934@s.whatsapp.net', 'image') } catch (e) { pp = null } 
global.fkontak = { key: {participant: `0@s.whatsapp.net`, ...(m.chat ? { remoteJid: `120363402481697721@g.us` } : {}) }, 
message: { 'contactMessage': { 'displayName': `Deylin ✨`, 'vcard': `BEGIN:VCARD\nVERSION:3.0\nN:XL;Deylin✨,;;;\nFN:Deylin\nitem1.TEL;waid=50433191934:50433191934\nitem1.X-ABLabel:Ponsel\nEND:VCARD`, 'jpegThumbnail': pp ? await (await fetch(pp)).buffer() : null, thumbnail: null, sendEphemeral: true }}}

global.fake = { contextInfo: { isForwarded: true, forwardedNewsletterMessageInfo: { newsletterJid: channelRD.id, newsletterName: channelRD.name, serverMessageId: -1 }}}, { quoted: m }

global.icono = [
'https://i.postimg.cc/RFdNynN5/IMG-20250315-WA0122.jpg',
'https://i.postimg.cc/3JjzVC0N/IMG-20250318-WA0969.jpg'
].getRandom()

global.rcanal = {
contextInfo: {
isForwarded: true,
forwardedNewsletterMessageInfo: {
newsletterJid: channelRD.id,
serverMessageId: 100,
newsletterName: channelRD.name,
},
externalAdReply: {
showAdAttribution: true,
title: '⚡ Pikachu-Bot MD ⚡',
body: 'Creado por Deylin',
mediaUrl: null,
description: null,
previewType: "PHOTO",
thumbnailUrl: icono,
sourceUrl: redes,
mediaType: 1,
renderLargerThumbnail: false
},
}
}

export default handler

// 🔁 Funciones auxiliares
function pickRandom(list) {
return list[Math.floor(Math.random() * list.length)]
}

async function getRandomChannel() {
let randomIndex = Math.floor(Math.random() * canalIdM.length)
let id = canalIdM[randomIndex]
let name = canalNombreM[randomIndex]
return { id, name }
}