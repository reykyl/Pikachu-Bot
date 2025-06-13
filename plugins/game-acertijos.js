import fs from 'fs'

let handler = async (m, { conn, command, args, text }) => {
  global.acertijosActivos = global.acertijosActivos || {}

  if (command === 'acertijo') {
    let acertijos = JSON.parse(fs.readFileSync('./src/database/acertijos.json'))
    let acertijo = acertijos[Math.floor(Math.random() * acertijos.length)]
    global.acertijosActivos[m.sender] = acertijo

    return conn.reply(m.chat, `🧠 *Adivina este acertijo:*\n\n${acertijo.question}\n\n_Responde con_ *.responder tu_respuesta*`, m, rcanal)
  }

  if (command === 'responder') {
    if (!text) return conn.reply(m.chat, '❗ Escribe tu respuesta.\nEjemplo: *.responder una piña*', m, rcanal)

    let acertijo = global.acertijosActivos[m.sender]
    if (!acertijo) return conn.reply(m.chat, '❌ No tienes ningún acertijo pendiente.\nUsa *.acertijo* para jugar.', m, rcanal)

    let respuestaUsuario = text.trim().toLowerCase()
    let respuestaCorrecta = acertijo.response.trim().toLowerCase()

    let mensaje = respuestaUsuario === respuestaCorrecta
      ? '✅ ¡Correcto! Eres todo un genio 🧠'
      : `❌ Incorrecto...\nLa respuesta correcta era: *${acertijo.response}*`

    delete global.acertijosActivos[m.sender]
    return conn.reply(m.chat, mensaje, m, rcanal)
  }
}

handler.help = ['acertijo', 'responder']
handler.tags = ['juegos']
handler.command = ['acertijo', 'responder']

export default handler