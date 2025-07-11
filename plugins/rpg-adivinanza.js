import fs from 'fs'

let respuestasPendientes = {}

let handler = async (m, { command, conn }) => {
  const json = JSON.parse(fs.readFileSync('./src/database/adivinanzas.json'))
  const aleatoria = json[Math.floor(Math.random() * json.length)]

  const texto = `🧠 *Adivinanza:*\n\n${aleatoria.pregunta}\n\n` + Object.entries(aleatoria.opciones).map(([num, txt]) => `*${num}.* ${txt}`).join('\n') + `\n\n📌 Responde con el número correcto etiquetando este mensaje. ¡Tienes 2 intentos!`

  const sentMsg = await m.reply(texto)

  
  respuestasPendientes[sentMsg.key.id] = {
    user: m.sender,
    correcta: aleatoria.respuesta_correcta,
    intentos: 0,
    msgId: sentMsg.key.id
  }
}

handler.command = ['prueba', 'adivinanza', 'adivinanzas']
handler.tags = ['rpg']
handler.help = ['prueba', 'adivinanza', 'adivinanzas']

export default handler


export async function before(m, { conn }) {
  if (!m.quoted || !respuestasPendientes[m.quoted.id]) return
  const data = respuestasPendientes[m.quoted.id]
  if (m.sender !== data.user) return // Solo quien invocó puede responder

  const respuesta = m.text.trim()

  if (!['1', '2', '3'].includes(respuesta)) return m.reply('❌ Responde solo con el número correcto (1, 2 o 3).')

  data.intentos++

  if (respuesta === data.correcta) {
    delete respuestasPendientes[m.quoted.id]
    return m.reply('✅ ¡Correcto! 🎉 Bien pensado.')
  }

  if (data.intentos >= 2) {
    m.reply(`❌ Perdiste. La respuesta era *${data.correcta}*. Regresa a primaria y presta más atención al maestro. 🎓`)
    delete respuestasPendientes[m.quoted.id]
  } else {
    m.reply('❌ Incorrecto. Te queda *1 intento*.')
  }
}