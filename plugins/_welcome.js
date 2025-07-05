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
  } catch (e) {
    return "🌐 Desconocido";
  }
}

async function enviarMensajeConBotonUrl({ conn, chatId, texto, footer, urlBoton, textoBoton, imagenUrl, mentions, quoted }) {
  // Prepara la media (imagen)
  const media = await conn.prepareMessageMedia({ image: { url: imagenUrl } }, { upload: conn.waUploadToServer })

  // Construye el mensaje template con hydratedButtons (botón URL)
  const templateMessage = {
    templateMessage: {
      hydratedTemplate: {
        imageMessage: media.imageMessage,
        hydratedContentText: texto,
        hydratedFooterText: footer,
        hydratedButtons: [
          {
            urlButton: {
              displayText: textoBoton,
              url: urlBoton
            }
          }
        ]
      }
    }
  }

  await conn.sendMessage(chatId, templateMessage, { mentions, quoted })
}

export async function before(m, { conn, participants, groupMetadata }) {
  if (!m.messageStubType || !m.isGroup) return;

  const who = m.messageStubParameters?.[0];
  if (!who) return;

  const taguser = `@${who.split("@")[0]}`;
  const chat = global.db?.data?.chats?.[m.chat] || {};
  if (!chat.welcome) return;

  const totalMembers = participants.length;
  const date = new Date().toLocaleString("es-ES", { timeZone: "America/Mexico_City" });
  const pais = await obtenerPais(who);

  let ppUser = 'https://i.imgur.com/0f2Nw7H.jpeg'; // imagen por defecto
  try {
    ppUser = await conn.profilePictureUrl(who, 'image');
  } catch {}

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

  // Enlace y texto del botón (modifica el enlace por el que desees)
  const enlaceBoton = "https://whatsapp.com/channel/0029Vb4cQJu2f3EB7BS7o11M";
  const textoBoton = "✐ ꒷ꕤ🩰 Canal Nino Nakano";

  if (m.messageStubType === WAMessageStubType.GROUP_PARTICIPANT_ADD) {
    const texto = `
*⚡──『 𝑩𝑰𝑬𝑵𝑽𝑬𝑵𝑰𝑫𝑶/𝑨 』──🧃*
👤 *Usuario:* ${taguser}
🌍 *País:* ${pais}
💬 *Grupo:* *${groupMetadata.subject}*
👥 *Miembros:* *${totalMembers + 1}*
📅 *Fecha:* *${date}*
⚡ *Mensaje:* ${fraseRandomBienvenida}`.trim();

    await enviarMensajeConBotonUrl({
      conn,
      chatId: m.chat,
      texto,
      footer: "𝙋𝙞𝙠𝙖𝙘𝙝𝙪 - 𝘽𝙤𝙩",
      urlBoton: enlaceBoton,
      textoBoton,
      imagenUrl: ppUser,
      mentions: [who],
      quoted: m
    })
  }

  if (
    m.messageStubType === WAMessageStubType.GROUP_PARTICIPANT_LEAVE ||
    m.messageStubType === WAMessageStubType.GROUP_PARTICIPANT_REMOVE
  ) {
    const texto = `
*⚡──『 𝑫𝑬𝑺𝑷𝑬𝑫𝑰𝑫𝑨 』──🧃*
👤 *Usuario:* ${taguser}
🌍 *País:* ${pais}
💬 *Grupo:* *${groupMetadata.subject}*
👥 *Miembros:* *${totalMembers - 1}*
📅 *Fecha:* *${date}*
⚡ *Mensaje:* ${fraseRandomDespedida}`.trim();

    await enviarMensajeConBotonUrl({
      conn,
      chatId: m.chat,
      texto,
      footer: "𝙋𝙞𝙠𝙖𝙘𝙝𝙪 - 𝘽𝙤𝙩",
      urlBoton: enlaceBoton,
      textoBoton,
      imagenUrl: ppUser,
      mentions: [who],
      quoted: m
    })
  }
}