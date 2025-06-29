import fs from 'fs'
import fetch from 'node-fetch'
import FormData from 'form-data'
const { proto, prepareWAMessageMedia } = (await import('@whiskeysockets/baileys')).default

function formatBytes(bytes) {
  if (bytes === 0) return '0 B'
  const sizes = ['B','KB','MB','GB','TB']
  const i = Math.floor(Math.log(bytes) / Math.log(1024))
  return `${(bytes / (1024 ** i)).toFixed(2)} ${sizes[i]}`  // <-- aquí van backticks
}

// Función para acortar URLs
async function shortUrl(url) {
  try {
    const response = await fetch('https://tinyurl.com/api-create.php?url=' + encodeURIComponent(url))
    return await response.text()
  } catch (e) {
    return url // Si hay un error, devolver la URL original
  }
}

let handler = async (m, { conn, usedPrefix }) => {
  try {
    const q = m.quoted || m
    const mime = q.mediaType || ''
    if (!/image|video|audio|sticker|document/.test(mime)) {
      return conn.reply(m.chat, '[ 📤 ] Responde a una imagen / vídeo / audio (normal o documento)', m)
    }

    const prefix = usedPrefix || '/'

    const mediaPath = await q.download(true)
    const sizeBytes = fs.statSync(mediaPath).size
    const humanSize = formatBytes(sizeBytes)

    if (sizeBytes === 0) {
      await conn.reply(m.chat, '[ ❗ ] El archivo es demasiado ligero', m)
      await fs.promises.unlink(mediaPath)
      return
    }
    if (sizeBytes > 1 * 1024 * 1024 * 1024) {
      await conn.reply(m.chat, '[ 📌 ] El archivo supera 1GB', m)
      await fs.promises.unlink(mediaPath)
      return
    }

    const services = [
      { name: 'CloudkuImages', url: 'https://api.alvianuxio.eu.org/uploader/cloudkuimages', field: 'file', extra: {}, expires: 'Desconocido' },
      { name: 'UcareCdn',      url: 'https://api.alvianuxio.eu.org/uploader/ucarecdn',       field: 'file', extra: {}, expires: 'Desconocido' },
      { name: 'TmpFiles',      url: 'https://api.alvianuxio.eu.org/uploader/tmpfiles',       field: 'file', extra: {}, expires: 'Desconocido' },
      { name: 'Litterbox',     url: 'https://api.alvianuxio.eu.org/uploader/litterbox',      field: 'file', extra: { time: '24h' }, expires: '24h' },
      { name: 'Telegraph',     url: 'https://api.alvianuxio.eu.org/uploader/telegraph',     field: 'image', extra: {}, expires: 'No expira' }
    ]

    const results = []
    for (const svc of services) {
      try {
        const link = await uploadService(svc, mediaPath)
        results.push({ name: svc.name, url: link, size: humanSize, expires: svc.expires })
      } catch (_) {}
    }
    await fs.promises.unlink(mediaPath)

    if (results.length === 0) {
      return conn.reply(m.chat, '[ ❗ ] No se obtuvo ninguna URL', m)
    }

    // Informamos cuántos enlaces se han obtenido
    await conn.reply(m.chat, `[ 📤 ] Se han obtenido ${results.length} enlaces. Enviando...`, m);

    try {
      // Obtenemos un enlace para usar como imagen de previsualización (usamos el primero)
      const previewLink = results[0].url;
      
      // Preparamos la miniatura para el mensaje
      let thumbnail = await prepareWAMessageMedia(
        { image: { url: previewLink } },
        { upload: conn.waUploadToServer }
      );
      
      // Texto informativo principal
      let txt = `乂  *L I N K S - E N L A C E S*  乂\n\n`;
      
      // Agregamos información de cada enlace al mensaje principal
      for (const result of results) {
        txt += `*${result.name}*\n`;
        txt += `• Enlace: ${result.url}\n`;
        txt += `• Tamaño: ${result.size}\n`;
        txt += `• Expiración: ${result.expires}\n\n`;
      }
      
      txt += `┏━╸*Creado por Ryze*╸━┓\n`;
      
      // Creamos el mensaje interactivo con todos los botones
      const buttons = [];
      
      // Creamos un botón por cada servicio (solo enlace original)
      for (const result of results) {
        // Botón para el enlace original
        buttons.push({
          name: "cta_copy",
          buttonParamsJson: JSON.stringify({
            display_text: `Copiar ${result.name}`,
            copy_code: result.url
          })
        });
      }
      
      // Enviamos mensajes adicionales si hay más de 5 enlaces
      // WhatsApp limita a 5 botones por mensaje
      if (buttons.length <= 5) {
        // Si tenemos 5 o menos botones, enviamos un solo mensaje
        let msg = {
          interactiveMessage: proto.Message.InteractiveMessage.create({
            header: proto.Message.InteractiveMessage.Header.create({
              hasMediaAttachment: true,
              ...thumbnail
            }),
            body: proto.Message.InteractiveMessage.Body.create({ 
              text: txt 
            }),
            footer: proto.Message.InteractiveMessage.Footer.create({
              text: "Presiona un botón para copiar el enlace deseado."
            }),
            nativeFlowMessage: proto.Message.InteractiveMessage.NativeFlowMessage.create({
              buttons: buttons
            })
          })
        };
        
        // Enviamos el mensaje con todos los botones
        await conn.relayMessage(m.chat, msg, { messageId: m.key.id });
      } else {
        // Si hay más de 5 botones, dividimos en varios mensajes
        // Primero enviamos el mensaje con la información completa y los primeros 5 botones
        let firstMsg = {
          interactiveMessage: proto.Message.InteractiveMessage.create({
            header: proto.Message.InteractiveMessage.Header.create({
              hasMediaAttachment: true,
              ...thumbnail
            }),
            body: proto.Message.InteractiveMessage.Body.create({ 
              text: txt 
            }),
            footer: proto.Message.InteractiveMessage.Footer.create({
              text: "Presiona un botón para copiar el enlace deseado (1/2)."
            }),
            nativeFlowMessage: proto.Message.InteractiveMessage.NativeFlowMessage.create({
              buttons: buttons.slice(0, 5)
            })
          })
        };
        
        await conn.relayMessage(m.chat, firstMsg, { messageId: m.key.id });
        
        // Esperamos un momento antes de enviar el siguiente mensaje
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Enviamos un segundo mensaje con los botones restantes
        // Para esto necesitamos generar un nuevo ID de mensaje
        const secondMsgId = m.key.id + Math.random().toString(36).substring(2, 10);
        
        let secondMsg = {
          interactiveMessage: proto.Message.InteractiveMessage.create({
            header: proto.Message.InteractiveMessage.Header.create({
              hasMediaAttachment: true,
              ...thumbnail
            }),
            body: proto.Message.InteractiveMessage.Body.create({ 
              text: "Continuación de enlaces:" 
            }),
            footer: proto.Message.InteractiveMessage.Footer.create({
              text: "Presiona un botón para copiar el enlace deseado (2/2)."
            }),
            nativeFlowMessage: proto.Message.InteractiveMessage.NativeFlowMessage.create({
              buttons: buttons.slice(5)
            })
          })
        };
        
        await conn.relayMessage(m.chat, secondMsg, { messageId: secondMsgId });
      }
      
    } catch (err) {
      // Si falla el envío con formato interactivo, enviamos un mensaje simple con todos los enlaces
      let txtError = `[ ❗ ] Error al crear mensaje interactivo: ${err.message}\n\n`;
      txtError += `*📋 Enlaces generados:*\n\n`;
      
      for (const result of results) {
        txtError += `*${result.name}*\n`;
        txtError += `• Enlace: ${result.url}\n`;
        txtError += `• Tamaño: ${result.size}\n`;
        txtError += `• Expiración: ${result.expires}\n\n`;
      }
      
      await conn.reply(m.chat, txtError, m);
    }


  } catch (e) {
    await conn.reply(m.chat, '[ ❗ ] ' + e.message, m)
  }
}

handler.help = ['tourlAll']
handler.tags = ['tools']
handler.command = ['tourlAll']

export default handler

async function uploadService(svc, path) {
  const form = new FormData()
  for (const [k, v] of Object.entries(svc.extra)) form.append(k, v)
  const stream = fs.createReadStream(path)
  stream.on('error', err => { throw new Error('Error lectura: ' + err.message) })
  form.append(svc.field, stream)
  const res = await fetch(svc.url, { method: 'POST', headers: form.getHeaders(), body: form })
  if (!res.ok) throw new Error(`HTTP ${res.status}`)
  let json
  try { json = await res.json() } catch (err) { throw new Error('JSON inválido: ' + err.message) }
  const url = json.data?.response
            || json.data?.file
            || json.files?.[0]?.url
            || json.files?.[0]?.src
            || json.url
            || json.src
            || (Array.isArray(json) ? json[0]?.url || json[0]?.src : undefined)
  if (!url) throw new Error('No URL: ' + JSON.stringify(json))
  return url
}