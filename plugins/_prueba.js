import fs from 'fs'
import fetch from 'node-fetch'
import path from 'path'
import FormData from 'form-data'

const handler = async (m, { conn }) => {
  if (!m.quoted || !/audio/.test(m.quoted.mimetype)) throw '🎤 Responde a un audio para transcribirlo a texto.'

  try {
    if (!fs.existsSync('./temp')) fs.mkdirSync('./temp')

    const audio = await m.quoted.download()
    const filePath = path.join('./temp', `${Date.now()}.ogg`)
    fs.writeFileSync(filePath, audio)

    const form = new FormData()
    form.append('audio', fs.createReadStream(filePath))

    const res = await fetch('https://whisper.lablab.ai/asr', {
      method: 'POST',
      body: form,
      headers: form.getHeaders()
    })

    const data = await res.json()
    fs.unlinkSync(filePath)

    if (data && data.text) {
      await m.reply(`🗣️ *Texto transcrito:*\n${data.text}`)
    } else {
      throw 'No se pudo transcribir el audio.'
    }

  } catch (e) {
    console.error(e)
    m.reply('❎ Error al transcribir la nota de voz.')
  }
}

handler.help = ['voztexto']
handler.tags = ['tools', 'ia']
handler.command = ['voztexto', 'transcribir']
handler.register = true

export default handler