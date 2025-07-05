//© código creado por Deylin 
//https://github.com/Deylin-eliac 
//➤ no quites créditos

import { WAMessageStubType, proto } from '@whiskeysockets/baileys'
import fetch from 'node-fetch'

async function obtenerPais(numero) {
  try {
    let number = numero.replace("@s.whatsapp.net", "");
    const res = await fetch(`https://g-mini-ia.vercel.app/api/infonumero?numero=${number}`);
    const data = await res.json();

    if (data && data.pais) return data.pais;
    if (data && data.bandera && data.nombre) return `${data.bandera} ${data.nombre}`;
    return "🌐 Desconocido";
  } catch {
    return "🌐 Desconocido";
  }
}

export async function before(m, { conn, participants, groupMetadata }) {
  if (!m.messageStubType || !m.isGroup) return;

  const who = m.messageStubParameters?.[0];
  if (!who) return;

  const taguser = `@${who.split("@")[0]}`;
  const chat = global.db?.data?.chats?.[m.chat] || {};
  if (!chat.welcome) return;

  const pais = await obtenerPais(who);
  const totalMembers = participants.length;
  const date = new Date().toLocaleString("es-ES", { timeZone: "America/Mexico_City" });

  let ppUser = 'https://i.imgur.com/0f2Nw7H.jpeg';
  try {
    ppUser = await conn.profilePictureUrl(who, 'image');
  } catch {}

  const frases = [
    "¡Pika Pika! Bienvenido al grupo.",
    "¡Un rayo de energía ha llegado al grupo!",
    "Pikachu dice que este grupo ahora es 100% más eléctrico ⚡",
    "¡Esperamos que la pases genial, entrenador!",
    "Bienvenido al equipo, ¡que empiece la aventura Pokémon!"
  ];
  const frase = frases[Math.floor(Math.random() * frases.length)];

  if (m.messageStubType === WAMessageStubType.GROUP_PARTICIPANT_ADD) {
    const texto = `
*⚡──『 𝑩𝑰𝑬𝑵𝑽𝑬𝑵𝑰𝑫𝑶/𝑨 』──🧃*
👤 *Usuario:* ${taguser}
🌍 *País:* ${pais}
💬 *Grupo:* *${groupMetadata.subject}*
👥 *Miembros:* *${totalMembers + 1}*
📅 *Fecha:* *${date}*
⚡ *Mensaje:* ${frase}`.trim();

    const media = await conn.prepareWAMessageMedia(
      { image: { url: ppUser } },
      { upload: conn.waUploadToServer }
    );

    const msg = proto.Message.fromObject({
      viewOnceMessage: {
        message: {
          messageContextInfo: {
            deviceListMetadata: {},
            deviceListMetadataVersion: 2
          },
          interactiveMessage: proto.Message.InteractiveMessage.create({
            body: proto.Message.InteractiveMessage.Body.create({ text: texto }),
            footer: proto.Message.InteractiveMessage.Footer.create({ text: "𝙋𝙞𝙠𝙖𝙘𝙝𝙪 - 𝘽𝙤𝙩" }),
            header: proto.Message.InteractiveMessage.Header.create({ hasMediaAttachment: true }),
            nativeFlowMessage: proto.Message.InteractiveMessage.NativeFlowMessage.create({
              buttons: [
                {
                  name: "cta_url",
                  buttonParamsJson: JSON.stringify({
                    display_text: "✐ ꒷ꕤ🩰 Canal Nino Nakano",
                    url: "https://whatsapp.com/channel/0029Vb4cQJu2f3EB7BS7o11M",
                    merchant_url: "https://whatsapp.com/channel/0029Vb4cQJu2f3EB7BS7o11M"
                  })
                }
              ]
            })
          })
        }
      }
    });

    msg.viewOnceMessage.message.interactiveMessage.header.imageMessage =
      proto.Message.ImageMessage.fromObject(media.imageMessage);

    await conn.relayMessage(m.chat, msg, { messageId: m.key.id });
  }
}