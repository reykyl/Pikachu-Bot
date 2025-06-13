import fs from 'fs'

let handler = async (m, { conn, command }) => {
  global.acertijosActivos = global.acertijosActivos || {}

  if (command === 'acertijo') {
    let acertijos = JSON.parse(fs.readFileSync('./src/database/acertijos.json'))
    let acertijo = acertijos[Math.floor(Math.random() * acertijos.length)]

    
    let res = await conn.reply(m.chat, `🧠 *Adivina este acertijo:*\n\n${acertijo.question}\n\n_Responde citando este mensaje_`, m, rcanal)
    
    global.acertijosActivos[m.chat] = {
      acertijo,
      msgId: res.key.id,
      responded: false
    }
    return
  }
}

handler.before = async (m, { conn }) => {
  global.acertijosActivos = global.acertijosActivos || {}

  
  if (!m.quoted) return

  
  let juego = global.acertijosActivos[m.chat]
  if (!juego || juego.responded) return

  
  if (m.quoted.id !== juego.msgId) return

  let respuestaUsuario = m.text.trim().toLowerCase()
  let respuestaCorrecta = juego.acertijo.response.trim().toLowerCase()

  let mensaje = respuestaUsuario === respuestaCorrecta
    ? `✅ *¡Correcto!* ${m.name} lo ha adivinado: *${juego.acertijo.response}*`
    : `❌ *Incorrecto*, ${m.name}.\nLa respuesta era: *${juego.acertijo.response}*`

  juego.responded = true
  await conn.reply(m.chat, mensaje, m.quoted, { mentions: [m.sender] })
}

handler.help = ['acertijo']
handler.tags = ['juegos']
handler.command = ['acertijo']

export default handler