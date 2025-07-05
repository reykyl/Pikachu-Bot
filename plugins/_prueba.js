import pkg from '@whiskeysockets/baileys';
const { generateWAMessageFromContent, prepareWAMessageMedia, proto } = pkg;
import moment from 'moment-timezone';
import { xpRange } from '../lib/levelling.js';
import fetch from 'node-fetch';

let handler = async (m, { conn }) => {
  let d = new Date(new Date().getTime() + 3600000);
  let locale = 'es';
  let week = d.toLocaleDateString(locale, { weekday: 'long' });
  let date = d.toLocaleDateString(locale, { day: 'numeric', month: 'long', year: 'numeric' });
  let _uptime = process.uptime() * 1000;
  let uptime = clockString(_uptime);

  let who = m.sender;
  let user = global.db.data.users[who];
  if (!user) throw '❌ Usuario no registrado en la base de datos';

  let { level, exp, role } = user;
  let { min, xp, max } = xpRange(level, global.multiplier);
  let prem = user.premium;
  let totalexp = exp;
  let totalreg = Object.keys(global.db.data.users).length;
  let version = '3.0.0';

  let d2 = new Date();
  d2.setHours(d2.getHours() - 5);
  let time = d2.toLocaleTimeString('es-PE', {
    hour: 'numeric', minute: 'numeric', second: 'numeric',
    hour12: true, timeZone: 'America/Lima'
  });

  let str = `
╭┈ ↷
│ ✐ ꒷ꕤ💎ദ ᴅᴀᴛᴏs ᴅᴇʟ ᴜsᴜᴀʀɪᴏ
│ *📊 ɴɪᴠᴇʟ:* ${level} (${exp}/${max})
│ *⚡ xᴘ ᴛᴏᴛᴀʟ:* ${totalexp}
│ *👑 ʀᴏʟ:* ${role}
│ *💎 ᴘʀᴇᴍɪᴜᴍ:* ${prem ? '✅' : '❌'}
╰─────────────────

╭┈ ↷
│ ✐ ꒷ꕤ💎ദ ɪɴғᴏʀᴍᴀᴄɪóɴ ᴅᴇʟ ʙᴏᴛ
│ *👨💻 ᴄʀᴇᴀᴅᴏʀ:* +595 972 314588
│ *🔖 ᴠᴇʀsɪóɴ:* ${version}
│ *👥 ᴜsᴜᴀʀɪᴏs:* ${totalreg}
│ *📚 ʟɪʙʀᴇʀɪᴀ:* Baileys-MD
│ *🛡️ ᴍᴏᴅᴏ:* ${global.opts['self'] ? 'Privado' : 'Público'}
│ *⏱️ ᴛɪᴇᴍᴘᴏ ᴀᴄᴛɪᴠᴏ:* ${uptime}
╰─────────────────

╭┈ ↷
│ ✐ ꒷ꕤ💎ദ ɪɴғᴏʀᴍᴀᴄɪóɴ ᴅᴇ ғᴇᴄʜᴀ
│ *🕒 ʜᴏʀᴀ:* ${time}
│ *📅 ғᴇᴄʜᴀ:* ${date}
│ *🗓️ ᴅíᴀ:* ${week}
╰─────────────────`;

  let image = await (await fetch('https://ucarecdn.com/f14f203b-2bd8-4506-8be4-cb90a8043954/69b7334e7122.jpg')).buffer();
  let media = await prepareWAMessageMedia({ image }, { upload: conn.waUploadToServer });

  let msg = generateWAMessageFromContent(m.chat, {
    viewOnceMessage: {
      message: {
        messageContextInfo: {
          deviceListMetadata: {},
          deviceListMetadataVersion: 2
        },
        interactiveMessage: proto.Message.InteractiveMessage.create({
          body: proto.Message.InteractiveMessage.Body.create({ text: str }),
          footer: proto.Message.InteractiveMessage.Footer.create({ text: "ᴘɪᴋᴀᴄʜᴜ - ʙᴏᴛ" }),
          header: proto.Message.InteractiveMessage.Header.create({
            hasMediaAttachment: true
          }),
          nativeFlowMessage: proto.Message.InteractiveMessage.NativeFlowMessage.create({
            buttons: [
              {
                name: "cta_url",
                buttonParamsJson: JSON.stringify({
                  display_text: "✐ ꒷ꕤ🩰 ᴄᴀɴᴀʟ ɴɪɴᴏ ɴᴀᴋᴀɴᴏ",
                  url: "https://whatsapp.com/channel/0029Vb4cQJu2f3EB7BS7o11M",
                  merchant_url: "https://whatsapp.com/channel/0029Vb4cQJu2f3EB7BS7o11M"
                })
              }
            ]
          })
        })
      }
    }
  }, { userJid: m.chat });

  msg.message.viewOnceMessage.message.interactiveMessage.header.imageMessage = proto.Message.ImageMessage.fromObject(media.imageMessage);
  await conn.relayMessage(m.chat, msg.message, { messageId: msg.key.id });
};

handler.command = ['menu', 'help', 'commands'];
export default handler;

// Funciones auxiliares
function clockString(ms) {
  let h = isNaN(ms) ? '--' : Math.floor(ms / 3600000);
  let m = isNaN(ms) ? '--' : Math.floor(ms / 60000) % 60;
  let s = isNaN(ms) ? '--' : Math.floor(ms / 1000) % 60;
  return [h, m, s].map(v => v.toString().padStart(2, 0)).join(':');
}

function ucapan() {
  const time = moment.tz('America/Lima').format('HH');
  if (time >= 4 && time < 10) return "Buenos días 🌅";
  if (time >= 10 && time < 15) return "Buenas tardes 🌞";
  if (time >= 15 && time < 18) return "Buenas tardes 🌇";
  if (time >= 18) return "Buenas noches 🌙";
  return "Buen día";
}