import { createHash } from 'crypto';
import fetch from 'node-fetch';

const handler = async (m, { conn, usedPrefix, command, args, isOwner, isAdmin, isROwner }) => {
  let chat = global.db.data.chats[m.chat];
  let user = global.db.data.users[m.sender];
  let bot = global.db.data.settings[conn.user.jid] || {};
  let type = command.toLowerCase();
  let isAll = false, isUser = false;
  let isEnable = chat[type] || false;

  if (args[0] === 'on' || args[0] === 'enable') {
    isEnable = true;
  } else if (args[0] === 'off' || args[0] === 'disable') {
    isEnable = false;
  } else {
    const estado = isEnable ? '✅ Activado' : '❌ Desactivado';
    return conn.reply(m.chat, 
`⚡ *PIKACHU-BOT - CENTRO DE CONTROL* 🐭
━━━━━━━━━━━━━━━━━━━━
🎮 *Un administrador puede activar o desactivar la función ${command} usando:*

✨ *${usedPrefix}${command} on* – Activar  
✨ *${usedPrefix}${command} off* – Desactivar

━━━━━━━━━━━━━━━━━━━━  
📊 *Estado actual:* ${estado}`, m, rcanal);
  }

  switch (type) {
    case 'welcome':
    case 'bv':
    case 'bienvenida':
    case 'autolevelup':
    case 'autonivel':
    case 'autosticker':
    case 'antibot':
    case 'antibots':
    case 'autoaceptar':
    case 'aceptarauto':
    case 'autorechazar':
    case 'rechazarauto':
    case 'autoresponder':
    case 'autorespond':
    case 'antisubbots':
    case 'antisub':
    case 'antisubot':
    case 'antibot2':
    case 'modoadmin':
    case 'soloadmin':
    case 'antiver':
    case 'antiocultar':
    case 'antiviewonce':
    case 'reaction':
    case 'reaccion':
    case 'emojis':
    case 'nsfw':
    case 'nsfwhot':
    case 'nsfwhorny':
    case 'antidelete':
    case 'antieliminar':
    case 'detect':
    case 'avisos':
    case 'detect2':
    case 'eventos':
    case 'autosimi':
    case 'simsimi':
    case 'antilink':
    case 'antilink2':
    case 'antitoxic':
    case 'antitoxicos':
    case 'antitrabas':
    case 'antitraba':
    case 'antifake':
    case 'antivirtuales':
      if (m.isGroup && !(isAdmin || isOwner)) {
        global.dfail('admin', m, conn);
        throw false;
      }
      chat[type] = isEnable;
      break;

    case 'antiprivado':
    case 'antipriv':
    case 'antiprivate':
    case 'antispam':
    case 'antiSpam':
    case 'antispamosos':
    case 'restrict':
    case 'restringir':
    case 'jadibotmd':
    case 'modejadibot':
      if (!isOwner) {
        global.dfail('rowner', m, conn);
        throw false;
      }
      bot[type === 'restrict' || type === 'restringir' ? 'restrict' : type === 'jadibotmd' || type === 'modejadibot' ? 'jadibotmd' : type] = isEnable;
      break;

    case 'autoread':
    case 'autoleer':
    case 'autover':
      if (!isROwner) {
        global.dfail('rowner', m, conn);
        throw false;
      }
      global.opts['autoread'] = isEnable;
      break;
  }

  conn.reply(m.chat, 
`⚡ *PIKACHU-BOT - STATUS ACTUALIZADO* 🐭  
━━━━━━━━━━━━━━━━━━━━  
🔧 Función: *${type}*  
📌 Estado: ${isEnable ? '✨ ACTIVADO' : '❌ DESACTIVADO'}  
📍 Aplicado ${isAll ? 'a todo el bot' : isUser ? 'a este usuario' : 'en este chat'}  
━━━━━━━━━━━━━━━━━━━━`, m, rcanal);
};

handler.help = ['welcome', 'bv', 'bienvenida', 'antiprivado', 'antipriv', 'antiprivate', 'restrict', 'restringir', 'autolevelup', 'autonivel', 'autosticker', 'antibot', 'antibots', 'autoaceptar', 'aceptarauto', 'autorechazar', 'rechazarauto', 'autoresponder', 'autorespond', 'antisubbots', 'antisub', 'antisubot', 'antibot2', 'modoadmin', 'soloadmin', 'autoread', 'autoleer', 'autover', 'antiver', 'antiocultar', 'antiviewonce', 'reaction', 'reaccion', 'emojis', 'nsfw', 'nsfwhot', 'nsfwhorny', 'antispam', 'antiSpam', 'antispamosos', 'antidelete', 'antieliminar', 'jadibotmd', 'modejadibot', 'subbots', 'detect', 'configuraciones', 'avisodegp', 'detect2', 'avisos', 'eventos', 'autosimi', 'simsimi', 'antilink', 'antilink2', 'antitoxic', 'antitoxicos', 'antitraba', 'antitrabas', 'antifake', 'antivirtuales']
handler.tags = ['nable'];
handler.command = ['welcome', 'bv', 'bienvenida', 'antiprivado', 'antipriv', 'antiprivate', 'restrict', 'restringir', 'autolevelup', 'autonivel', 'autosticker', 'antibot', 'antibots', 'autoaceptar', 'aceptarauto', 'autorechazar', 'rechazarauto', 'autoresponder', 'autorespond', 'antisubbots', 'antisubbots', 'antisub', 'antisubot', 'antibot2', 'modoadmin', 'soloadmin', 'autoread', 'autoleer', 'autover', 'antiver', 'antiocultar', 'antiviewonce', 'reaction', 'reaccion', 'emojis', 'nsfw', 'nsfwhot', 'nsfwhorny', 'antispam', 'antiSpam', 'antispamosos', 'antidelete', 'antieliminar', 'jadibotmd', 'modejadibot', 'subbots', 'detect', 'configuraciones', 'avisodegp', 'detect2', 'avisos', 'eventos', 'autosimi', 'simsimi', 'antilink', 'antilink2', 'antitoxic', 'antitoxicos', 'antitraba', 'antitrabas', 'antifake', 'antivirtuales']

export default handler