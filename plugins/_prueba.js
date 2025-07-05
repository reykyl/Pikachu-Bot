/*import { generateWAMessageFromContent, proto } from '@whiskeysockets/baileys'

let handler = async (m, { conn, args }) => {
  const name = args[0] || 'Sticker URL'
  const url = args[1] || 'https://sticker.ly/s/ABCDEFG'

  const text = `📋 Pulsa el botón para copiar el siguiente enlace:\n\n🔗 ${url}`

  const messageContent = {
    viewOnceMessage: {
      message: {
        messageContextInfo: {
          deviceListMetadata: {},
          deviceListMetadataVersion: 2
        },
        interactiveMessage: proto.Message.InteractiveMessage.create({
          body: proto.Message.InteractiveMessage.Body.create({ text }),
          footer: proto.Message.InteractiveMessage.Footer.create({
            text: 'Pikachu Bot by Deylin'
          }),
          header: proto.Message.InteractiveMessage.Header.create({
            hasMediaAttachment: false
          }),
          nativeFlowMessage: proto.Message.InteractiveMessage.NativeFlowMessage.create({
            buttons: [
              {
                name: 'cta_copy',
                buttonParamsJson: JSON.stringify({
                  display_text: `📎 Copiar ${name}`,
                  copy_code: url
                })
              }
            ]
          })
        })
      }
    }
  }

  const msg = generateWAMessageFromContent(m.chat, messageContent, {})
  await conn.relayMessage(m.chat, msg.message, { messageId: msg.key.id })
}

handler.command = ['cop']
handler.tags = ['tools']
handler.help = ['cop [nombre] [url]']
// ejemplo: .cop Grupo https://chat.whatsapp.com/...

export default handler*/



import { generateWAMessageFromContent, proto } from '@whiskeysockets/baileys'

let handler = async (m, { conn, args }) => {
  const code = args[0] || '0000-0000' // Código por defecto
  const imagenUrl = 'https://files.catbox.moe/b0woxx.jpg'

  const texto = `
╔══════════════════════════╗
║ ✨🐭  P I K A C H U   B O T  ✨ 
╠══════════════════════════╣
║   ╭───(⚡◕ᴥ◕⚡)───╮         
║   │  P I K A   │ C H U !  
║   │   C O D E  │   ⚡      
║   ╰─────────────╯         
╠══════════════════════════╣
║ 🛠️  Sub-Bot – Modo Código    
╟──────────────────────────╢
║ ⟿ Usa este código para un   
║   irte con la fuerza        
║    eléctrica de Pikachu ⚡   
║                            
║ ➥ ❶ Abre ⋮ (tres rayitos)   
║ ➥ ❷ “Dispositivos vinculados”
║ ➥ ❸ Vincular con número     
║ ➥ ❹ Ingresa el código ¡y    
║       Pikaaa! Ya eres parte 
║       del equipo eléctrico  
╟──────────────────────────╢
║ ⚠  Si ya tienes otra sesión 
║    abierta, desconecta para 
║    evitar sobrecarga ⚡      
╚══════════════════════════╝
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
            hasMediaAttachment: true,
            mediaAttachment: proto.Message.InteractiveMessage.MediaAttachment.create({
              imageMessage: {
                url: imagenUrl
              }
            })
          }),
          nativeFlowMessage: proto.Message.InteractiveMessage.NativeFlowMessage.create({
            buttons: [
              {
                name: 'cta_copy',
                buttonParamsJson: JSON.stringify({
                  display_text: '📎 Copiar código',
                  copy_code: code
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

handler.command = ['codebot']
handler.tags = ['serbot']
handler.help = ['codebot [código]']
// ejemplo: .codebot 3492-8893

export default handler