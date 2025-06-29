import fs from 'fs'
import fetch from 'node-fetch'
import FormData from 'form-data'
import path from 'path'

const transcribeAudio = async (filePath) => {
  const form = new FormData()
  form.append('audio', fs.createReadStream(filePath))

  const res = await fetch('https://whisper.lablab.ai/asr', {
    method: 'POST',
    body: form,
    headers: form.getHeaders()
  })

  const data = await res.json()
  return data.text || null
}

const handler = async (m, { conn }) => {
  try {
    if (!m.quoted || !m.quoted.mimetype || !m.quoted.mimetype.startsWith('audio/')) {
      return m.reply('🎤 Responde a una nota de voz o audio para transcribirlo.')
    }

    if (!fs.existsSync('./temp')) fs.mkdirSync('./temp')

    const audioBuffer = await m.quoted.download()
    const filePath = path.join('./temp', `${Date.now()}.ogg`)
    fs.writeFileSync(filePath, audioBuffer)

    await m.reply('🔄 Transcribiendo audio, espera un momento...')

    const texto = await transcribeAudio(filePath)
    fs.unlinkSync(filePath)

    if (texto) {
      return m.reply(`🗣️ *Texto transcrito:*\n${texto}`)
    } else {
      return m.reply('❌ No se pudo obtener el texto del audio.')
    }

  } catch (e) {
    console.error('❌ Error:', e)
    return m.reply('❎ Error al transcribir el audio.')
  }
}

handler.help = ['voztexto']
handler.tags = ['tools', 'ia']
handler.command = ['voztexto', 'transcribir']
handler.register = true

export default handler