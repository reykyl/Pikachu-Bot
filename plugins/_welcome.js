//© código creado por Deylin 
//https://github.com/Deylin-eliac 
//➤ no quites créditos

import fetch from 'node-fetch'
import { WAMessageStubType, proto, generateWAMessageFromContent } from '@whiskeysockets/baileys'

async function obtenerPais(numero) {
  try {
    let number = numero.replace("@s.whatsapp.net", "")
    const res = await fetch(`https://g-mini-ia.vercel.app/api/infonumero?numero=${number}`)
    const data = await res.json()
    if (data && data.pais) return data.pais
    if (data?.bandera && data?.nombre) return `${data.bandera} ${data.nombre}`
    return "🌐 Desconocido"
  } catch {
    return "🌐 Desconocido"
  }
}

async function enviarBienvenidaDespedida({ conn, m, tipo, quien, groupMetadata, totalMembers }) {
  const taguser = `@${quien.split('@')[0]}`
  const fecha = new Date().toLocaleString("es-ES", { timeZone: "America/Mexico_City" })
  const pais = await obtenerPais(quien)
  let ppUser = 'https://i.imgur.com/0f2Nw7H.jpeg'
  try {
    ppUser = await conn.profilePictureUrl(quien, 'image')
  } catch {}

  const frases = {
    bienvenida: [
      "¡Pika Pika! Bienvenido al grupo.",
      "¡Un rayo de energía ha llegado al grupo!",
      "Pikachu dice que este grupo ahora es 100% más eléctrico ⚡",
      "¡Esperamos que la pases genial, entrenador!",
      "Bienvenido al equipo, ¡que empiece la aventura Pokémon!"
    ],
    despedida: [
      "Pikachu te dice adiós con una descarga de cariño.",
      "Otro entrenador deja el grupo... ¡Buena suerte!",
      "¡Hasta la próxima, no olvides tus Pokéballs!",
      "El grupo se queda con menos voltaje ⚡",
      "Pikachu te extrañará 🥺"
    ]
  }

  const frase = tipo === 'bienvenida'
    ? frases.bienvenida[Math.floor(Math.random() * frases.bienvenida.length)]
    : frases.despedida[Math.floor(Math.random() * frases.despedida.length)]

  const texto = tipo === 'bienvenida'
    ? `*⚡──『 𝑩𝑰𝑬𝑵𝑽𝑬𝑵𝑰𝑫𝑶/𝑨 』──🧃*\n👤 *Usuario:* ${taguser}\n🌍 *País:* ${pais}\n💬 *Grupo:* *${groupMetadata.subject}*\n👥 *Miembros:* *${totalMembers + 1}*\n📅 *Fecha:* *${fecha}*\n⚡ *Mensaje:* ${frase}`
    : `*⚡──『 𝑫𝑬𝑺𝑷𝑬𝑫𝑰𝑫𝑨 』──🧃*\n👤 *Usuario:* ${taguser}\n🌍 *País:* ${pais}\n💬 *Grupo:* *${groupMetadata.subject}*\n👥 *Miembros:* *${totalMembers - 1}*\n📅 *Fecha:* *${fecha}*\n⚡ *Mensaje:* ${frase}`

  const messageContent = {
    templateMessage: {
      hydratedTemplate: {
        imageMessage: await conn.prepareMessageMedia({ image: { url: ppUser } }, { upload: conn.waUploadToServer }).then(media => media.imageMessage),
        hydratedContentText: texto,
        hydratedFooterText: 'Pikachu Bot by Deylin',
        hydratedButtons: [
          {
            urlButton: {
              displayText: '✐ Canal oficial',
              url: 'https://whatsapp.com/channel/0029VawF8fBBvvsktcInIz3m'
            }
          }
        ]
      }
    }
  }

  const msg = generateWAMessageFromContent(m.chat, messageContent, { quoted: m })
  await conn.relayMessage(m.chat, msg.message, { messageId: msg.key.id })
}

export async function before(m, { conn, participants, groupMetadata }) {
  try {
    if (!m.messageStubType || !m.isGroup) return
    const chat = global.db?.data?.chats?.[m.chat] || {}
    if (!chat.welcome) return
    const quien = m.messageStubParameters?.[0]
    if (!quien) return
    const totalMembers = participants.length

    if (m.messageStubType === WAMessageStubType.GROUP_PARTICIPANT_ADD) {
      await enviarBienvenidaDespedida({
        conn, m,
        tipo: 'bienvenida',
        quien,
        groupMetadata,
        totalMembers
      })
    }

    if (
      m.messageStubType === WAMessageStubType.GROUP_PARTICIPANT_REMOVE ||
      m.messageStubType === WAMessageStubType.GROUP_PARTICIPANT_LEAVE
    ) {
      await enviarBienvenidaDespedida({
        conn, m,
        tipo: 'despedida',
        quien,
        groupMetadata,
        totalMembers
      })
    }
  } catch (e) {
    console.error('[❌ ERROR EN BIENVENIDA/DESPEDIDA]', e)
  }
}