import { WAMessageStubType } from '@whiskeysockets/baileys';
import fetch from 'node-fetch';
import pkg from '@whiskeysockets/baileys';
const { generateWAMessageFromContent, prepareWAMessageMedia, proto } = pkg;
import moment from 'moment-timezone';

export async function before(m, { conn, participants, groupMetadata }) {
  if (!m.messageStubType || !m.isGroup) return true;
  
  moment.tz.setDefault('America/Lima');
  const date = moment().format('DD/MM/YYYY');
  const time = moment().format('HH:mm:ss');
  const week = moment().format('dddd');
  
  let who = m.messageStubParameters[0];
  let taguser = `+${who.split('@')[0]}`;
  let chat = global.db.data.chats[m.chat];
  let defaultImage = 'https://files.catbox.moe/evwxsx.jpg';

  let welcomeAudioUrl = 'https://qu.ax/ejKuy.mp3';
  let farewellAudioUrl = 'https://qu.ax/syuTL.mp4';

  let owner = groupMetadata.owner || (participants.length ? participants[0].id : null);
  let ownerTag = owner ? `+${owner.split('@')[0]}` : 'Desconocido';
  
  let memberCount = participants.length;
  let newMemberCount = m.messageStubType === WAMessageStubType.GROUP_PARTICIPANT_ADD ? memberCount : memberCount - 1;

  if (chat.welcome) {
    let pp = await conn.profilePictureUrl(m.messageStubParameters[0], 'image').catch(_ => 'https://files.catbox.moe/xr2m6u.jpg')
    let img = await (await fetch(`${pp}`)).buffer()
    let media = await prepareWAMessageMedia({ image: img }, { upload: conn.waUploadToServer });

    if (m.messageStubType === WAMessageStubType.GROUP_PARTICIPANT_ADD) {
      let welcomeMsg = `

> ✐ Usa *#menu* para ver los comandos disponibles`;

      let msg = generateWAMessageFromContent(m.chat, {
        viewOnceMessage: {
          message: {
            messageContextInfo: {
              deviceListMetadata: {},
              deviceListMetadataVersion: 2
            },
            interactiveMessage: proto.Message.InteractiveMessage.create({
              body: proto.Message.InteractiveMessage.Body.create({
                text: welcomeMsg
              }),
              footer: proto.Message.InteractiveMessage.Footer.create({
                text: '¡Disfruta tu estadía en el grupo!'
              }),
              header: proto.Message.InteractiveMessage.Header.create({
                title: "",
                subtitle: "",
                hasMediaAttachment: true
              }),
              nativeFlowMessage: proto.Message.InteractiveMessage.NativeFlowMessage.create({
                buttons: [
                  {
                    name: "quick_reply",
                    buttonParamsJson: JSON.stringify({
                      "display_text": "canal 🧢",
                      "id": "#canal"
                    })
                  },
                  {
                    name: "quick_reply",
                    buttonParamsJson: JSON.stringify({
                      "display_text": "👤 AutoReg",
                      "id": "#reg user.19"
                    })
                  },
                  {
                    name: "quick_reply",
                    buttonParamsJson: JSON.stringify({
                      "display_text": "Menu Completo ⚡️",
                      "id": "#menu"
                    })
                  }
                ]
              })
            })
          }
        }
      }, {});

      msg.message.viewOnceMessage.message.interactiveMessage.header.imageMessage = proto.Message.ImageMessage.fromObject(media.imageMessage);
      await conn.relayMessage(m.chat, msg.message, { messageId: msg.key.id });
      await conn.sendMessage(m.chat, { audio: { url: welcomeAudioUrl }, mimetype: 'audio/mpeg', ptt: true });
    }

    if (m.messageStubType === WAMessageStubType.GROUP_PARTICIPANT_LEAVE || 
        m.messageStubType === WAMessageStubType.GROUP_PARTICIPANT_REMOVE) {
      let farewellMsg = `
╭┈ ↷
│ ✐ ꒷ꕤ💜ദ ᴜsᴜᴀʀɪᴏ sᴀʟɪᴏ ᴅᴇʟ ɢʀᴜᴘᴏ
│ *👋 ᴜsᴜᴀʀɪᴏ:* ${taguser}
│ *👥 ᴍɪᴇᴍʙʀᴏs ʀᴇsᴛᴀɴᴛᴇs:* ${memberCount - 1}
│ *🍬 ɢʀᴜᴘᴏ:* ${groupMetadata.subject}
│ *👑 ᴏᴡɴᴇʀ:* ${ownerTag}
│ *🕒 ʜᴏʀᴀ:* ${time}
│ *📅 ғᴇᴄʜᴀ:* ${date}
│ *🗓️ ᴅíᴀ:* ${week}
╰─────────────────

> ✐ Esperamos verte de nuevo pronto`;

      let msg = generateWAMessageFromContent(m.chat, {
        viewOnceMessage: {
          message: {
            messageContextInfo: {
              deviceListMetadata: {},
              deviceListMetadataVersion: 2
            },
            interactiveMessage: proto.Message.InteractiveMessage.create({
              body: proto.Message.InteractiveMessage.Body.create({
                text: farewellMsg
              }),
              footer: proto.Message.InteractiveMessage.Footer.create({
                text: '¡Hasta pronto!'
              }),
              header: proto.Message.InteractiveMessage.Header.create({
                title: "",
                subtitle: "",
                hasMediaAttachment: true
              }),
              nativeFlowMessage: proto.Message.InteractiveMessage.NativeFlowMessage.create({
                buttons: [
                  {
                    name: "quick_reply",
                    buttonParamsJson: JSON.stringify({
                      "display_text": "Creador 🍟",
                      "id": "#owner"
                    })
                  },
                  {
                    name: "quick_reply",
                    buttonParamsJson: JSON.stringify({
                      "display_text": "Menu 📚",
                      "id": "#menu"
                    })
                  }
                ]
              })
            })
          }
        }
      }, {});

      msg.message.viewOnceMessage.message.interactiveMessage.header.imageMessage = proto.Message.ImageMessage.fromObject(media.imageMessage);
      await conn.relayMessage(m.chat, msg.message, { messageId: msg.key.id });
      await conn.sendMessage(m.chat, { audio: { url: farewellAudioUrl }, mimetype: 'audio/mp4', ptt: true });
    }
  }
  return true;
}