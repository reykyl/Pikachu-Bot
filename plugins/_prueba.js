let handler = async (m, { conn }) => {
  try {
    await conn.sendMessage('0029VbAix53FnSz4CU0a580q@newsletter', {
      text: '🧃 Prueba directa al canal desde el bot.'
    })
    m.reply('✅ Enviado.')
  } catch (e) {
    m.reply('❌ Error: ' + e.message)
  }
}
handler.command = /^testcanal$/i
export default handler