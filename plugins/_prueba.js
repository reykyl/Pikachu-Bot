import fs from 'fs'
import fetch from 'node-fetch'
import FormData from 'form-data'
import path from 'path'

const transcribeAudio = async (filePath) => {
  const form = new FormData()
  form.append('audio', fs.createReadStream(filePath))

  const res = await fetch('https://g-mini-ia.vercel.app/api/transcribe', {
    method: 'POST',
    body: form,
    headers: form.getHeaders()
  })

  const data = await res.json()
  return data.text || null
}

const handler = async (m, { conn }) => {
  if (!m.quoted || !/audio/.test(m.quoted.mimetype)) {
    throw '🎤 Responde a una nota de voz para transcribirla a texto.'
  }

  try {
    if (!fs.existsSync('./temp')) fs.mkdirSync('./temp')
    
    const audioBuffer = await m.quoted.download()
    const filePath = path.join('./temp', `${Date.now()}.ogg`)
    fs.writeFileSync(filePath, audioBuffer)

    await m.reply('🔄 Transcribiendo audio, espera un momento...')

    const texto = await transcribeAudio(filePath)
    fs.unlinkSync(filePath)

    if (texto) {
      await m.reply(`🗣️ *Texto transcrito:*\n${texto}`)
    } else {
      throw 'No se pudo obtener el texto.'
    }

  } catch (e) {
    console.error(e)
    m.reply('❎ Error al transcribir el audio.')
  }
}

handler.help = ['voztexto']
handler.tags = ['tools', 'ia']
handler.command = ['voztexto', 'transcribir']
handler.register = true

export default handler