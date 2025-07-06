//© código creado por Deylin 
//https://github.com/Deylin-eliac 
//➤  no quites creditos 

import { WAMessageStubType, generateWAMessageFromContent, proto } from '@whiskeysockets/baileys'
import fetch from 'node-fetch'

async function obtenerPais(numero) {
  try {
    let number = numero.replace("@s.whatsapp.net", "");
    const res = await fetch(`https://g-mini-ia.vercel.app/api/infonumero?numero=${number}`);
    const data = await res.json();

    if (data && data.pais) return data.pais;
    if (data && data.bandera && data.nombre) return `${data.bandera} ${data.nombre}`;

    return "🌐 Desconocido";
  } catch (e) {
    return "🌐 Desconocido";
  }
}

export async function before(m, { conn, participants, groupMetadata }) {
  if (!m.messageStubType || !m.isGroup) return;
//  if (m.chat === "120363402481697721@g.us") return;

  const who = m.messageStubParameters?.[0];
  if (!who) return;

  const taguser = `@${who.split("@")[0]}`;
  const chat = global.db?.data?.chats?.[m.chat] || {};
  const totalMembers = participants.length;
  const date = new Date().toLocaleString("es-ES", { timeZone: "America/Mexico_City" });

  const pais = await obtenerPais(who);
  let ppUser = 'https://raw.githubusercontent.com/Deylin-Eliac/Pikachu-Bot/refs/heads/main/src/IMG-20250613-WA0194.jpg';

  try {
    ppUser = await conn.profilePictureUrl(who, 'image');
  } catch (e) {}

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

  const fraseRandomBienvenida = frasesBienvenida[Math.floor(Math.random() * frasesBienvenida.length)];
  const fraseRandomDespedida = frasesDespedida[Math.floor(Math.random() * frasesDespedida.length)];

  if (chat.welcome) {
    if (m.messageStubType === WAMessageStubType.GROUP_PARTICIPANT_ADD) {
      const bienvenida = `
*⚡─『 𝑩𝑰𝑬𝑵𝑽𝑬𝑵𝑰𝑫𝑶/𝑨 』─🧃*
👤 *Usuario:* ${taguser}
🌍 *País:* ${pais}
💬 *Grupo:* *${groupMetadata.subject}*
👥 *Miembros:* *${totalMembers + 1}*
📅 *Fecha:* *${date}*
⚡ *Mensaje:* ${fraseRandomBienvenida}`.trim();

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

    if (
      m.messageStubType === WAMessageStubType.GROUP_PARTICIPANT_LEAVE ||
      m.messageStubType === WAMessageStubType.GROUP_PARTICIPANT_REMOVE
    ) {
      const despedida = `
*⚡──『 𝑫𝑬𝑺𝑷𝑬𝑫𝑰𝑫𝑨 』──🧃*
👤 *Usuario:* ${taguser}
🌍 *País:* ${pais}
💬 *Grupo:* *${groupMetadata.subject}*
👥 *Miembros:* *${totalMembers - 1}*
📅 *Fecha:* *${date}*
⚡ *Mensaje:* ${fraseRandomDespedida}`.trim();

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






let handler = async (m, { conn }) => {
    if (["can"].includes(command)) {
  const texto = `
✨ Pulsa el botón para unirte al canal oficial
  `.trim()

  const messageContent = {
    viewOnceMessage: {
      message: {
        messageContextInfo: {
          deviceListMetadata: {},
          deviceListMetadataVersion: 2
        },
        interactiveMessage: proto.Message.InteractiveMessage.create({
          body: proto.Message.InteractiveMessage.Body.create({
            text: texto
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

  const msg = generateWAMessageFromContent(m.chat, messageContent, { quoted: m })
  await conn.relayMessage(m.chat, msg.message, { messageId: msg.key.id })
}
}

handler.command = ['can']
handler.register = true

export default handler


