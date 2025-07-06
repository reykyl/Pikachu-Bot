//© código creado por Deylin 
//https://github.com/Deylin-eliac 
//➤  no quites créditos

import { WAMessageStubType, generateWAMessageFromContent, proto } from '@whiskeysockets/baileys'
import fetch from 'node-fetch'

// ───── FUNCION AUXILIAR ─────
async function obtenerPais(numero) {
  try {
    let number = numero.replace("@s.whatsapp.net", "");
    const res = await fetch(`https://g-mini-ia.vercel.app/api/infonumero?numero=${number}`);
    const data = await res.json();

    if (data?.pais) return data.pais;
    if (data?.bandera && data?.nombre) return `${data.bandera} ${data.nombre}`;
    return "🌐 Desconocido";
  } catch (e) {
    return "🌐 Desconocido";
  }
}

// ───── BIENVENIDA Y DESPEDIDA AUTOMÁTICA ─────
export async function before(m, { conn, participants, groupMetadata }) {
  if (!m.messageStubType || !m.isGroup) return;

  const who = m.messageStubParameters?.[0];
  if (!who) return;

  const taguser = `@${who.split("@")[0]}`;
  const chat = global.db?.data?.chats?.[m.chat] || {};
  const totalMembers = participants.length;
  const date = new Date().toLocaleString("es-ES", { timeZone: "America/Mexico_City" });

  const pais = await obtenerPais(who);
  let ppUser = 'https://raw.githubusercontent.com/Deylin-Eliac/Pikachu-Bot/refs/heads/main/src/IMG-20250613-WA0194.jpg';
  try { ppUser = await conn.profilePictureUrl(who, 'image'); } catch {}

  const frasesBienvenida = [
    "¡Pika Pika! Bienvenido al grupo.",
    "¡Un rayo de energía ha llegado al grupo!",
    "Pikachu dice que este grupo ahora es 100% más eléctrico ⚡",
    "¡Esperamos que la pases genial, entrenador!",
    "Bienvenido al equipo, ¡que empiece la aventura Pokémon!"
  ];
  const frasesDespedida = [
    "Pikachu te dice adiós con una descarga de cariño.",
    "Otro entrenador deja el grupo... ¡Buena suerte!",
    "¡Hasta la próxima, no olvides tus Pokéballs!",
    "El grupo se queda con menos voltaje ⚡",
    "Pikachu te extrañará 🥺"
  ];

  const bienvenida = `
*⚡─『 𝑩𝑰𝑬𝑵𝑽𝑬𝑵𝑰𝑫𝑶/𝑨 』─🧃*
👤 *Usuario:* ${taguser}
🌍 *País:* ${pais}
💬 *Grupo:* *${groupMetadata.subject}*
👥 *Miembros:* *${totalMembers + 1}*
📅 *Fecha:* *${date}*
⚡ *Mensaje:* ${frasesBienvenida[Math.floor(Math.random() * frasesBienvenida.length)]}`.trim();

  const despedida = `
*⚡──『 𝑫𝑬𝑺𝑷𝑬𝑫𝑰𝑫𝑨 』──🧃*
👤 *Usuario:* ${taguser}
🌍 *País:* ${pais}
💬 *Grupo:* *${groupMetadata.subject}*
👥 *Miembros:* *${totalMembers - 1}*
📅 *Fecha:* *${date}*
⚡ *Mensaje:* ${frasesDespedida[Math.floor(Math.random() * frasesDespedida.length)]}`.trim();

  if (chat.welcome) {
    if (m.messageStubType === WAMessageStubType.GROUP_PARTICIPANT_ADD) {
      await conn.sendMessage(m.chat, {
        image: { url: ppUser },
        caption: bienvenida,
        footer: "Pikachu Bot by Deylin",
        buttons: [
          {
            buttonId: '.can',
            buttonText: { displayText: '✐ Canal oficial' },
            type: 1
          }
        ],
        headerType: 4,
        mentions: [who]
      });
    }

    if ([WAMessageStubType.GROUP_PARTICIPANT_LEAVE, WAMessageStubType.GROUP_PARTICIPANT_REMOVE].includes(m.messageStubType)) {
      await conn.sendMessage(m.chat, {
        image: { url: ppUser },
        caption: despedida,
        footer: "Pikachu Bot by Deylin",
        buttons: [
          {
            buttonId: '.can',
            buttonText: { displayText: '✐ Canal oficial' },
            type: 1
          }
        ],
        headerType: 4,
        mentions: [who]
      });
    }
  }
}

// ───── COMANDO .can ─────
const handler = async (m, { conn, command }) => {
  const texto = `✨ Pulsa el botón para unirte al canal oficial`.trim();

  const messageContent = {
    viewOnceMessage: {
      message: {
        messageContextInfo: {
          deviceListMetadata: {},
          deviceListMetadataVersion: 2
        },
        interactiveMessage: proto.Message.InteractiveMessage.create({
          body: proto.Message.InteractiveMessage.Body.create({ text: texto }),
          footer: proto.Message.InteractiveMessage.Footer.create({ text: 'Pikachu Bot by Deylin' }),
          header: proto.Message.InteractiveMessage.Header.create({ hasMediaAttachment: false }),
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

  const msg = generateWAMessageFromContent(m.chat, messageContent, { quoted: m });
  await conn.relayMessage(m.chat, msg.message, { messageId: msg.key.id });
}

handler.command = ['can']

export default handler