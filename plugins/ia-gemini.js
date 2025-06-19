import fetch from 'node-fetch'
import { downloadContentFromMessage } from '@whiskeysockets/baileys'

let handler = async (m, { text, usedPrefix, command, conn }) => {
  let q = m.quoted || m
  let mime = (q.msg || q).mimetype || ''
  let hasImage = /^image\/(jpe?g|png)$/.test(mime)

  if (!text && !hasImage) {
    return conn.reply(m.chat, `💡 Envía o responde a una imagen con una pregunta.\n\nEjemplo:\n${usedPrefix + command} ¿Qué ves en esta imagen?`, m)
  }

  try {
    await m.react('🌟')
    await conn.sendPresenceUpdate('composing', m.chat)

    let base64Image = null
    let mimeType = null

    if (hasImage) {
      const stream = await downloadContentFromMessage(q, 'image')
      let buffer = Buffer.from([])
      for await (const chunk of stream) {
        buffer = Buffer.concat([buffer, chunk])
      }

      base64Image = `data:${mime};base64,${buffer.toString('base64')}`
      mimeType = mime
    }

    const body = {
      prompts: text ? [text] : [],
      imageBase64List: base64Image ? [base64Image] : [],
      mimeTypes: mimeType ? [mimeType] : [],
      temperature: 0.7
    }

    const res = await fetch('https://g-mini-ia.vercel.app/api/gemini', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body)
    })

    if (!res.ok) throw new Error(`API error ${res.status}`)

    const data = await res.json()
    const part = data?.candidates?.[0]?.content?.parts?.[0]

    if (!part) throw new Error('❌ No se recibió contenido válido de la IA.')

    
    if (part.inline_data?.mime_type && part.inline_data?.data) {
      const buffer = Buffer.from(part.inline_data.data, 'base64')
      const ext = part.inline_data.mime_type.includes('png') ? 'png' : 'jpg'
      const fileName = `imagen-generada.${ext}`

      await conn.sendFile(m.chat, buffer, fileName, `🖼️ Imagen generada por IA:\n"${text || ''}"`, m)

    
    } else if (part.text && /^https?:\/\/.*\.(jpg|jpeg|png|webp)$/i.test(part.text.trim())) {
      await conn.sendFile(m.chat, part.text.trim(), 'imagen.jpg', `🖼️ Imagen generada:\n"${text || ''}"`, m)

    
    } else if (part.text) {
      await m.reply(part.text.trim())

    } else {
      throw new Error('❌ No se pudo interpretar la respuesta de la IA.')
    }

  } catch (e) {
    console.error(e)
    await m.react('⚠️')
    await conn.reply(m.chat, '⚠️ Ocurrió un error procesando la imagen o pregunta.', m)
  }
}

handler.command = ['gemini', 'geminis']
handler.help = ['gemini <pregunta>']
handler.tags = ['ai']
handler.group = false

export default handler








/*import fetch from 'node-fetch'
import { downloadContentFromMessage } from '@whiskeysockets/baileys'

let handler = async (m, { text, usedPrefix, command }) => {
  let q = m.quoted || m
  let mime = (q.msg || q).mimetype || ''
  let hasImage = /^image\/(jpe?g|png)$/.test(mime)

  if (!text && !hasImage) {
    return conn.reply(m.chat, `💡 Envía o responde a una imagen con una pregunta.\n\nEjemplo:\n${usedPrefix + command} ¿Qué ves en esta imagen?`, m)
  }

  try {
    await m.react('🌟')
    conn.sendPresenceUpdate('composing', m.chat)

    let base64Image = null
    let mimeType = null

    if (hasImage) {
      const stream = await downloadContentFromMessage(q, 'image')
      let buffer = Buffer.from([])
      for await (const chunk of stream) {
        buffer = Buffer.concat([buffer, chunk])
      }

      base64Image = `data:${mime};base64,${buffer.toString('base64')}`
      mimeType = mime
    }

    const body = {
      prompts: text ? [text] : [],
      imageBase64List: base64Image ? [base64Image] : [],
      mimeTypes: mimeType ? [mimeType] : [],
      temperature: 0.7
    }

    const res = await fetch('https://g-mini-ia.vercel.app/api/gemini', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(body)
    })

    const data = await res.json()

    const respuesta = data?.candidates?.[0]?.content?.parts?.[0]?.text
    if (!respuesta) throw '❌ No se recibió respuesta válida de la IA.'

    await m.reply(respuesta.trim())

  } catch (e) {
    console.error(e)
    await m.react('⚠️')
    await conn.reply(m.chat, '⚠️ Ocurrió un error procesando la imagen o pregunta.', m)
  }
}

handler.command = ['gemini', 'geminis']
handler.help = ['gemini <pregunta>']
handler.tags = ['ai']
handler.group = false

export default handler*/