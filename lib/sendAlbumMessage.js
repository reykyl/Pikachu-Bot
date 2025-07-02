export async function sendAlbumMessage(conn, jid, stickerMessages, quoted) {
  if (!Array.isArray(stickerMessages)) throw new Error('Los mensajes deben estar en un array')

  for (const msg of stickerMessages) {
    await conn.sendMessage(jid, msg, { quoted });
    await new Promise(res => setTimeout(res, 500)); // Pausa para evitar límite
  }
}