import pkg from '@whiskeysockets/baileys';
const { generateWAMessageFromContent, prepareWAMessageMedia, proto } = pkg;
import moment from 'moment-timezone';
import { xpRange } from '../lib/levelling.js';

let handler = async (m, { conn, usedPrefix }) => {
    let d = new Date(new Date().getTime() + 3600000);
    let locale = 'es';
    let week = d.toLocaleDateString(locale, { weekday: 'long' });
    let date = d.toLocaleDateString(locale, { day: 'numeric', month: 'long', year: 'numeric' });
    let _uptime = process.uptime() * 1000;
    let uptime = clockString(_uptime);

    let who = m.quoted ? m.quoted.sender : m.mentionedJid && m.mentionedJid[0] ? m.mentionedJid[0] : m.fromMe ? conn.user.jid : m.sender;
    if (!(who in global.db.data.users)) throw `✳️ El usuario no se encuentra en mi base de datos`;

    let user = global.db.data.users[who];
    let { level, exp, role } = user;
    let { min, xp, max } = xpRange(level, global.multiplier);
    let greeting = ucapan();
    let name = await conn.getName(m.sender);
    let prem = global.db.data.users[m.sender].premium;
    let totalexp = exp;
    let totalreg = Object.keys(global.db.data.users).length;
    let version = '3.0.0';

    let d2 = new Date();
    d2.setHours(d2.getHours() - 5);
    let time = d2.toLocaleTimeString('es-PE', {
        hour: 'numeric',
        minute: 'numeric',
        second: 'numeric',
        hour12: true,
        timeZone: 'America/Lima'
    });

    let str = `
╭┈ ↷
│ ✐ ꒷ꕤ💎ദ ᴅᴀᴛᴏs ᴅᴇʟ ᴜsᴜᴀʀɪᴏ
│ *📊 ɴɪᴠᴇʟ:* ${level} (${exp}/${max})
│ *⚡ xᴘ ᴛᴏᴛᴀʟ:* ${totalexp}
│ *👑 ʀᴏʟ:* ${role}
│ *💎 ᴘʀᴇᴍɪᴜᴍ:* ${prem ? '✅' : '❌'}
│ ✦ Info » User 🅘
╰─────────────────

╭┈ ↷
│ ✐ ꒷ꕤ💎ദ ɪɴғᴏʀᴍᴀᴄɪóɴ ᴅᴇʟ ʙᴏᴛ
│ *👨💻 ᴄʀᴇᴀᴅᴏʀ:* +595 972 314588
│ *🔖 ᴠᴇʀsɪóɴ:* ${version}
│ *👥 ᴜsᴜᴀʀɪᴏs:* ${totalreg}
│ *📚 ʟɪʙʀᴇʀɪᴀ:* Baileys-MD
│ *🛡️ ᴍᴏᴅᴏ:* ${global.opts['self'] ? 'Privado' : 'Público'}
│ *⏱️ ᴛɪᴇᴍᴘᴏ ᴀᴄᴛɪᴠᴏ:* ${uptime}
│ ✦ Info » System 🅢
╰─────────────────

╭┈ ↷
│ ✐ ꒷ꕤ💎ദ ɪɴғᴏʀᴍᴀᴄɪóɴ ᴅᴇ ғᴇᴄʜᴀ
│ *🕒 ʜᴏʀᴀ:* ${time}
│ *📅 ғᴇᴄʜᴀ:* ${date}
│ *🗓️ ᴅíᴀ:* ${week}
│ ✦ Info » Time 🅣
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
                    body: proto.Message.InteractiveMessage.Body.create({
                        text: str
                    }),
                    footer: proto.Message.InteractiveMessage.Footer.create({
                        text: dev
                    }),
                    header: proto.Message.InteractiveMessage.Header.create({
                        title: "",
                        subtitle: "",
                        hasMediaAttachment: true
                    }),
                    nativeFlowMessage: proto.Message.InteractiveMessage.NativeFlowMessage.create({
                        buttons: [
                            {
                                name: "single_select",
                                buttonParamsJson: JSON.stringify({
                                    title: "✐ ꒷ꕤ🍉ദ ᴘʀᴇᴄɪᴏɴᴇ ᴀǫᴜɪ́",
                                    sections: [
                                        {
                                            title: "✐ ꒷ꕤ☂️ദ ᴍᴇɴᴜ ᴘʀɪɴᴄɪᴘᴀʟ",
                                            rows: [
                                                {
                                                    title: "✐ ꒷ꕤ💎ദ ɪɴғᴏʀᴍᴀᴄɪᴏ́ɴ ᴅᴇ ʟᴀ ʙᴏᴛ",
                                                    description: "Muestra información detallada de la bot",
                                                    id: ".infobot"
                                                },
                                                {
                                                    title: "✐ ꒷ꕤ💎ദ ᴠᴇʀ ᴠᴇʟᴏᴄɪᴅᴀᴅ",
                                                    description: "Comprueba la velocidad de la bot",
                                                    id: ".ping"
                                                },
                                                {
                                                    title: "✐ ꒷ꕤ💎ദ ᴍᴇɴᴜ ᴄᴏᴍᴘʟᴇᴛᴏ",
                                                    description: "Muestra el menu de comandos completo de la bot",
                                                    id: ".allmenu"
                                                },
                                                {
                                                    title: "✐ ꒷ꕤ💎ദ ᴘʀᴏᴘɪᴇᴛᴀʀɪᴏ",
                                                    description: "Contacta con el creador del bot",
                                                    id: ".owner"
                                                }
                                            ]
                                        },
                                        {
                                            title: "✐ ꒷ꕤ☂️ദ ᴇsᴛᴀᴅᴏ ʏ ʀᴇᴅᴇs",
                                            rows: [
                                                {
                                                    title: "✐ ꒷ꕤ💎ദ ᴇsᴛᴀᴅᴏ ᴅᴇ ʟᴀ ʙᴏᴛ",
                                                    description: "Verifica el estado actual de la bot",
                                                    id: ".estado"
                                                },
                                                {
                                                    title: "✐ ꒷ꕤ💎ദ ᴄᴜᴇɴᴛᴀs ᴏғɪᴄɪᴀʟᴇs",
                                                    description: "Redes sociales y canales oficiales",
                                                    id: ".cuentasoficiales"
                                                }
                                            ]
                                        },
                                        {
                                            title: "✐ ꒷ꕤ☂️ദ ɢʀᴜᴘᴏs ɴɪɴᴏ ɴᴀᴋᴀɴᴏ",
                                            rows: [
                                                {
                                                    title: "✐ ꒷ꕤ💎ദ ɢʀᴜᴘᴏs ᴘʀɪɴᴄɪᴘᴀʟᴇs",
                                                    description: "Únete al los grupos principales de la bot",
                                                    id: ".grupos"
                                                }
                                            ]
                                        }
                                    ]
                                })
                            },
                            {
                                name: "quick_reply",
                                buttonParamsJson: "{\"display_text\":\"✐ ꒷ꕤ🌹ദ ᴅᴏɴᴀʀ\",\"id\":\".donar\"}"
                            },
                            {
                                name: "quick_reply",
                                buttonParamsJson: "{\"display_text\":\"✐ ꒷ꕤ👤ദ ᴀᴜᴛᴏ ᴠᴇʀɪғɪᴄᴀʀ\",\"id\":\".reg name.19\"}"
                            },
                            {
                                name: "quick_reply",
                                buttonParamsJson: "{\"display_text\":\"✐ ꒷ꕤ☂️ദ ᴠᴇʀ sɪsᴛᴇᴍᴀ\",\"id\":\".sistema\"}"
                            },
                            {
                                "name": "cta_url",
                                "buttonParamsJson": "{\"display_text\":\"✐ ꒷ꕤ🩰 ᴄᴀɴᴀʟ ɴɪɴᴏ ɴᴀᴋᴀɴᴏ\",\"url\":\"https://whatsapp.com/channel/0029Vb4cQJu2f3EB7BS7o11M\",\"merchant_url\":\"https://whatsapp.com/channel/0029Vb4cQJu2f3EB7BS7o11M\"}"
                            }
                        ]
                    })
                })
            }
        }
    }, {});

    msg.message.viewOnceMessage.message.interactiveMessage.header.imageMessage = proto.Message.ImageMessage.fromObject(media.imageMessage);
    await conn.relayMessage(m.chat, msg.message, { messageId: msg.key.id });
}

handler.help = ['menu', 'helph'];
handler.tags = ['main'];
handler.command = ['menuh', 'help', 'commands'];

export default handler;

function clockString(ms) {
    let h = isNaN(ms) ? '--' : Math.floor(ms / 3600000);
    let m = isNaN(ms) ? '--' : Math.floor(ms / 60000) % 60;
    let s = isNaN(ms) ? '--' : Math.floor(ms / 1000) % 60;
    return [h, m, s].map(v => v.toString().padStart(2, 0)).join(':');
}

function ucapan() {
    const time = moment.tz('America/Lima').format('HH');
    let res = "Buen día";
    if (time >= 4 && time < 10) res = "Buenos días 🌅";
    if (time >= 10 && time < 15) res = "Buenas tardes 🌞";
    if (time >= 15 && time < 18) res = "Buenas tardes 🌇";
    if (time >= 18) res = "Buenas noches 🌙";
    return res;
}