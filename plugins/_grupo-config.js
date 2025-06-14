//© código creado por Deylin 
//https://github.com/deylin-eliac 
//➤  no quites créditos

let handler = async (m, { conn, args, participants, groupMetadata, usedPrefix, command }) => {
  const icono = 'https://files.catbox.moe/hnif5j.jpg'; 
  const emoji = '⚡';
  const emoji2 = '🔒';
  const group = m.chat;
  const totalMembers = participants.length;

  if (command === 'link' || command === 'enlace') {
    const link = 'https://chat.whatsapp.com/' + await conn.groupInviteCode(group);
    await conn.reply(m.chat, 
`*⚡🌩️──『 𝑳𝑰𝑵𝑲 𝑷𝑰𝑲𝑨𝑪𝑯𝑼 』──🌩️⚡*

📛 *Grupo:* ${groupMetadata.subject}
👥 *Miembros:* ${totalMembers}

🔗 *Enlace mágico:* 
${link}

🐭 ¡Pikachu dice que lo compartas con los mejores entrenadores! ⚡`, 
    m, { detectLink: true });
    return;
  }

  if (command === 'del' || command === 'delete') {
    if (!m.quoted) return conn.reply(m.chat, `${emoji} Por favor, cita el mensaje que deseas eliminar.`, m);
    try {
      let delet = m.message.extendedTextMessage.contextInfo.participant;
      let bang = m.message.extendedTextMessage.contextInfo.stanzaId;
      return conn.sendMessage(m.chat, { delete: { remoteJid: m.chat, fromMe: false, id: bang, participant: delet }});
    } catch {
      return conn.sendMessage(m.chat, { delete: m.quoted.vM.key });
    }
  }

  if (command === 'group' || command === 'grupo') {
    const isClose = {
      'open': 'not_announcement',
      'close': 'announcement',
      'abierto': 'not_announcement',
      'cerrado': 'announcement',
      'on': 'not_announcement',
      'off': 'announcement'
    }[(args[0] || '').toLowerCase()];

    if (!isClose) {
      return conn.reply(m.chat, 
`${emoji} *Opciones válidas para configurar el grupo:*

✦ *${usedPrefix + command} open* - 🗣️ Todos pueden hablar  
✦ *${usedPrefix + command} close* - 🔇 Solo admins

🐭 *Pikachu necesita una orden clara, entrenador.* ⚡`, m);
    }

    await conn.groupSettingUpdate(m.chat, isClose);

    if (isClose === 'not_announcement') {
      m.reply(`${emoji} *¡Pikachu liberó el grupo!* Todos pueden escribir ⚡`);
    }

    if (isClose === 'announcement') {
      m.reply(`${emoji2} *¡Pikachu cerró el grupo!* Solo los admins pueden escribir 🔒`);
    }
  }
};

handler.help = ['link', 'group open / close', 'del', 'delete'];
handler.tags = ['grupo'];
handler.command = ['link', 'enlace', 'group', 'grupo', 'del', 'delete'];


handler.group = true;
handler.botAdmin = (m) => ['group', 'grupo', 'del', 'delete'].includes(m.command);
handler.admin = (m) => ['group', 'grupo', 'del', 'delete'].includes(m.command);

export default handler;