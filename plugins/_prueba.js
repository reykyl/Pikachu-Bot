// © código creado por Deylin 
// https://github.com/Deylin-Eliac 
// ➤ no quites créditos

import fetch from 'node-fetch'
import { sticker } from '../lib/sticker.js'

let handler = async (m, { conn, args, usedPrefix, command }) => {
  if (!args[0]) throw `📦 Usa el comando así:\n\n${usedPrefix + command} gato`;

  await m.reply('🔍 Buscando el contenido...');

  let query = args.join(" ")
  const apikey = "Sylphiette's"
  const url = `https://api.sylphy.xyz/stickerly/search?q=${encodeURIComponent(query)}&apikey=${apikey}`

  const res = await fetch(url)
  if (!res.ok) throw '❌ Error al consultar la API'

  const json = await res.json()
  if (!json.res || json.res.length === 0) throw '❌ No se encontraron paquetes de stickers.'

  let packs = json.res.slice(0, 10)
  let stickers = []

  for (let pack of packs) {
    try {
      // Normalizamos claves del objeto
      const lowerKeys = Object.fromEntries(Object.entries(pack).map(([k, v]) => [k.toLowerCase(), v]))
      let thumb = lowerKeys['url de la miniatura'] || lowerKeys['url'] || null

      if (!thumb) continue

      let buffer = await fetch(thumb).then(res => res.buffer())
      let stk = await sticker(buffer, false, lowerKeys.name || 'Paquete', lowerKeys.autor || 'Sticker.ly')

      if (stk) stickers.push(stk)
    } catch (e) {
      console.error(`❌ Error con el paquete "${pack.name}":`, e)
    }
  }

  if (!stickers.length) throw '⚠️ No se pudieron convertir los stickers.'

  await conn.sendMessage(m.chat, {
    sticker: stickers
  }, { quoted: m })
}

handler.command = /^stickerly$/i
export default handler