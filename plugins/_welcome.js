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

  // Enlace para el botón (modifica aquí el enlace que quieras)
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

    // Prepara media
    const media = await conn.prepareWAMessageMedia(
      { image: { url: ppUser } },
      { upload: conn.waUploadToServer }
    );

    // Construye mensaje interactivo con botón y imagen
    const msg = proto.Message.fromObject({
      imageMessage: media.imageMessage,
      caption: texto,
      footer: "𝙋𝙞𝙠𝙖𝙘𝙝𝙪 - 𝘽𝙤𝙩",
      buttons: [
        {
          buttonId: 'url_button',
          buttonText: { displayText: textoBoton },
          type: 1
        }
      ],
      headerType: 4 // imagen con botón
    });

    await conn.sendMessage(m.chat, msg, { quoted: m });
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

    const media = await conn.prepareWAMessageMedia(
      { image: { url: ppUser } },
      { upload: conn.waUploadToServer }
    );

    const msg = proto.Message.fromObject({
      imageMessage: media.imageMessage,
      caption: texto,
      footer: "𝙋𝙞𝙠𝙖𝙘𝙝𝙪 - 𝘽𝙤𝙩",
      buttons: [
        {
          buttonId: 'url_button',
          buttonText: { displayText: textoBoton },
          type: 1
        }
      ],
      headerType: 4
    });

    await conn.sendMessage(m.chat, msg, { quoted: m });
  }
}