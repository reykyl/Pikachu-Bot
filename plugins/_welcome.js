// © Código creado por Deylin
// https://github.com/Deylin-eliac
// ➤ No quites créditos

import makeWASocket, { useMultiFileAuthState, DisconnectReason, fetchLatestBaileysVersion, makeCacheableSignalKeyStore, getContentType, proto, generateWAMessageFromContent } from '@whiskeysockets/baileys'
import { Boom } from '@hapi/boom'
import pino from 'pino'
import fetch from 'node-fetch'
import { Low, JSONFile } from 'lowdb'
import { join } from 'path'
import { fileURLToPath } from 'url'
import NodeCache from 'node-cache'

const __dirname = fileURLToPath(new URL('.', import.meta.url))
const dbFile = join(__dirname, 'db.json')

// Configuración base de datos (opcional)
const adapter = new JSONFile(dbFile)
const db = new Low(adapter)
await db.read()
db.data ||= { chats: {} }
await db.write()

// Inicialización
const msgRetryCounterCache = new NodeCache()

async function connectBot() {
  const { state, saveCreds } = await useMultiFileAuthState('session')
  const { version } = await fetchLatestBaileysVersion()

  const sock = makeWASocket({
    version,
    printQRInTerminal: true,
    auth: {
      creds: state.creds,
      keys: makeCacheableSignalKeyStore(state.keys, pino({ level: 'fatal' }).child({ level: 'fatal' }))
    },
    msgRetryCounterCache,
    generateHighQualityLinkPreview: true,
    logger: pino({ level: 'silent' }),
    defaultQueryTimeoutMs: undefined,
    markOnlineOnConnect: true,
  })

  sock.ev.on('creds.update', saveCreds)

  // Reconexión automática
  sock.ev.on('connection.update', async ({ connection, lastDisconnect }) => {
    if (connection === 'close') {
      const shouldReconnect = lastDisconnect?.error?.output?.statusCode !== DisconnectReason.loggedOut
      console.log('🔁 Conexión cerrada', shouldReconnect ? 'Reconectando...' : 'Cerrado completamente')
      if (shouldReconnect) connectBot()
    } else if (connection === 'open') {
      console.log('✅ Bot conectado correctamente')
    }
  })

  // ───── Función auxiliar ─────
  async function obtenerPais(numero) {
    try {
      let number = numero.replace('@s.whatsapp.net', '')
      const res = await fetch(`https://g-mini-ia.vercel.app/api/infonumero?numero=${number}`)
      const data = await res.json()

      if (data?.pais) return data.pais
      if (data?.bandera && data?.nombre) return `${data.bandera} ${data.nombre}`
      return '🌐 Desconocido'
    } catch {
      return '🌐 Desconocido'
    }
  }

  // ───── Bienvenida y despedida ─────
  sock.ev.on('messages.upsert', async ({ messages }) => {
    const m = messages[0]
    if (!m.message || !m.key.remoteJid?.endsWith('@g.us')) return

    const stubType = m.messageStubType
    const who = m.messageStubParameters?.[0]
    if (!who || ![27, 28].includes(stubType)) return // 27: add, 28: remove

    const groupMetadata = await sock.groupMetadata(m.key.remoteJid)
    const participants = groupMetadata.participants
    const totalMembers = participants.length
    const taguser = `@${who.split('@')[0]}`
    const date = new Date().toLocaleString('es-ES', { timeZone: 'America/Mexico_City' })
    const pais = await obtenerPais(who)

    let ppUser = 'https://raw.githubusercontent.com/Deylin-Eliac/Pikachu-Bot/refs/heads/main/src/IMG-20250613-WA0194.jpg'
    try {
      ppUser = await sock.profilePictureUrl(who, 'image')
    } catch {}

    const frasesBienvenida = [
      "¡Pika Pika! Bienvenido al grupo.",
      "¡Un rayo de energía ha llegado al grupo!",
      "Pikachu dice que este grupo ahora es 100% más eléctrico ⚡",
      "¡Esperamos que la pases genial, entrenador!",
      "Bienvenido al equipo, ¡que empiece la aventura Pokémon!"
    ]

    const frasesDespedida = [
      "Pikachu te dice adiós con una descarga de cariño.",
      "Otro entrenador deja el grupo... ¡Buena suerte!",
      "¡Hasta la próxima, no olvides tus Pokéballs!",
      "El grupo se queda con menos voltaje ⚡",
      "Pikachu te extrañará 🥺"
    ]

    const bienvenida = `
*⚡─『 𝑩𝑰𝑬𝑵𝑽𝑬𝑵𝑰𝑫𝑶/𝑨 』─🧃*
👤 *Usuario:* ${taguser}
🌍 *País:* ${pais}
💬 *Grupo:* *${groupMetadata.subject}*
👥 *Miembros:* *${totalMembers + 1}*
📅 *Fecha:* *${date}*
⚡ *Mensaje:* ${frasesBienvenida[Math.floor(Math.random() * frasesBienvenida.length)]}`.trim()

    const despedida = `
*⚡──『 𝑫𝑬𝑺𝑷𝑬𝑫𝑰𝑫𝑨 』──🧃*
👤 *Usuario:* ${taguser}
🌍 *País:* ${pais}
💬 *Grupo:* *${groupMetadata.subject}*
👥 *Miembros:* *${totalMembers - 1}*
📅 *Fecha:* *${date}*
⚡ *Mensaje:* ${frasesDespedida[Math.floor(Math.random() * frasesDespedida.length)]}`.trim()

    const mensaje = stubType === 27 ? bienvenida : despedida

    await sock.sendMessage(m.key.remoteJid, {
      image: { url: ppUser },
      caption: mensaje,
      footer: 'Pikachu Bot by Deylin',
      buttons: [
        {
          buttonId: '.can',
          buttonText: { displayText: '✐ Canal oficial' },
          type: 1
        }
      ],
      headerType: 4,
      mentions: [who]
    })
  })

  // ───── Comando .can ─────
  sock.ev.on('messages.upsert', async ({ messages }) => {
    const m = messages[0]
    const text = m.message?.conversation || m.message?.extendedTextMessage?.text
    if (!text) return

    const command = text.trim().toLowerCase()
    if (command === '.can') {
      const content = {
        viewOnceMessage: {
          message: {
            messageContextInfo: {
              deviceListMetadata: {},
              deviceListMetadataVersion: 2
            },
            interactiveMessage: proto.Message.InteractiveMessage.create({
              body: proto.Message.InteractiveMessage.Body.create({
                text: '✨ Pulsa el botón para unirte al canal oficial'
              }),
              footer: proto.Message.InteractiveMessage.Footer.create({
                text: 'Pikachu Bot by Deylin'
              }),
              header: proto.Message.InteractiveMessage.Header.create({
                hasMediaAttachment: false
              }),
              nativeFlowMessage: proto.Message.InteractiveMessage.NativeFlowMessage.create({
                buttons: [
                  {
                    name: 'cta_url',
                    buttonParamsJson: JSON.stringify({
                      display_text: '✐ Canal oficial',
                      url: 'https://whatsapp.com/channel/0029VawF8fBBvvsktcInIz3m',
                      merchant_url: 'https://whatsapp.com/channel/0029VawF8fBBvvsktcInIz3m'
                    })
                  }
                ]
              })
            })
          }
        }
      }

      const msg = generateWAMessageFromContent(m.key.remoteJid, content, { quoted: m })
      await sock.relayMessage(m.key.remoteJid, msg.message, { messageId: msg.key.id })
    }
  })
}

connectBot()