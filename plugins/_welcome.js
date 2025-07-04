//© código creado por Deylin 
//https://github.com/Deylin-eliac 
//➤  no quites créditos 

import { WAMessageStubType } from '@whiskeysockets/baileys'
import fetch from 'node-fetch'

const GRUPO_STAFF = '120363402481697721@g.us' // ← ID del grupo del staff
const CHAT_PRIVADO = '50433191934@s.whatsapp.net' // ← Chat privado especial

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
  const totalMembers = participants.length;
  const date = new Date().toLocaleString("es-ES", { timeZone: "America/Mexico_City" });
  const pais = await obtenerPais(who);
  let ppUser = 'https://raw.githubusercontent.com/Deylin-Eliac/Pikachu-Bot/refs/heads/main/src/IMG-20250613-WA0194.jpg';

  try { ppUser = await conn.profilePictureUrl(who, 'image') } catch {}

  // Frases genéricas (públicas)
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

  if (!chat.welcome) return;

  const enviarMensaje = async (tipo, frase) => {
    const texto = tipo === 'bienvenida' ? `
*⚡─『 𝑩𝑰𝑬𝑵𝑽𝑬𝑵𝑰𝑫𝑶/𝑨 』─🧃*
👤 *Usuario:* ${taguser}
🌍 *País:* ${pais}
💬 *Grupo:* *${groupMetadata.subject}*
👥 *Miembros:* *${totalMembers + 1}*
📅 *Fecha:* *${date}*
⚡ *Mensaje:* ${frase}`.trim()
    :
    `
*⚡──『 𝑫𝑬𝑺𝑷𝑬𝑫𝑰𝑫𝑨 』──🧃*
👤 *Usuario:* ${taguser}
🌍 *País:* ${pais}
💬 *Grupo:* *${groupMetadata.subject}*
👥 *Miembros:* *${totalMembers - 1}*
📅 *Fecha:* *${date}*
⚡ *Mensaje:* ${frase}`.trim()

    await conn.sendMessage(m.chat, {
      image: { url: ppUser },
      caption: texto,
      mentions: [who]
    });
  };

  // 👉 Chat privado personalizado
  if (m.chat === CHAT_PRIVADO) {
    if (m.messageStubType === WAMessageStubType.GROUP_PARTICIPANT_ADD) {
      await conn.sendMessage(m.chat, {
        text: `🧃 Has sido agregado al chat privado de administración.\n👤 Usuario: ${taguser}`,
        mentions: [who]
      });
    }
    if (
      m.messageStubType === WAMessageStubType.GROUP_PARTICIPANT_LEAVE ||
      m.messageStubType === WAMessageStubType.GROUP_PARTICIPANT_REMOVE
    ) {
      await conn.sendMessage(m.chat, {
        text: `👋 ${taguser} ha salido del chat privado.`,
        mentions: [who]
      });
    }
    return;
  }

  // 🛡️ Grupo del staff personalizado
  if (m.chat === GRUPO_STAFF) {
    const mensaje = m.messageStubType === WAMessageStubType.GROUP_PARTICIPANT_ADD
      ? `🛡️ Bienvenido al grupo del staff, ${taguser}. Aporta con responsabilidad.`
      : `🛡️ El miembro del staff ${taguser} ha salido del grupo.`;
    await conn.sendMessage(m.chat, {
      text: mensaje,
      mentions: [who]
    });
    return;
  }

  // 🌐 Público general
  if (m.messageStubType === WAMessageStubType.GROUP_PARTICIPANT_ADD) {
    await enviarMensaje('bienvenida', fraseRandomBienvenida);
  }
  if (
    m.messageStubType === WAMessageStubType.GROUP_PARTICIPANT_LEAVE ||
    m.messageStubType === WAMessageStubType.GROUP_PARTICIPANT_REMOVE
  ) {
    await enviarMensaje('despedida', fraseRandomDespedida);
  }
}