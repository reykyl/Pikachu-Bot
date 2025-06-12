export const partidas = {};
export const EMOJI_TITULAR = '❤️';
export const EMOJI_SUPLENTE = '👍';
export const MAX_TITULARES = 4;
export const MAX_SUPLENTES = 4;

export function generarMensaje(titulares = [], suplentes = []) {
  const lista = (arr, total) =>
    Array.from({ length: total }, (_, i) => {
      const user = arr[i];
      return user ? `> ${i + 1}. @${user.split('@')[0]}` : `> ${i + 1}. ⏳`;
    }).join('\n');

  return `*╭━[ 𝙋𝘼𝙍𝙏𝙄𝘿𝘼 𝟰𝙫𝟰 - 𝐂𝐎𝐌𝐏𝐄 ]━⬣*\n\n` +
         `*📌 Titulares:*\n${lista(titulares, MAX_TITULARES)}\n\n` +
         `*📌 Suplentes:*\n${lista(suplentes, MAX_SUPLENTES)}\n\n` +
         `❤️ = Titular\n👍 = Suplente\n\n` +
         `*Esperando reacciones...*`;
}

export default {
  command: ['4vs4'],
  tags: ['juegos'],
  help: ['4vs4'],
  description: 'Organiza partida 4 vs 4',
  async handler(m, { conn }) {
    const chat = m.chat;

    if (partidas[chat] && !partidas[chat].finalizado) {
      return m.reply('⚠️ Ya hay una partida en curso en este chat.');
    }

    const titulares = [];
    const suplentes = [];

    const texto = generarMensaje(titulares, suplentes);

    const enviado = await conn.sendMessage(chat, {
      text: texto,
      mentions: [],
    });

    partidas[chat] = {
      msgId: enviado.key.id,
      msgKey: enviado.key,
      titulares,
      suplentes,
      finalizado: false,
    };

    // Opcional: agregar automáticamente las reacciones al mensaje inicial
    await conn.sendMessage(chat, {
      react: { text: EMOJI_TITULAR, key: enviado.key }
    });
    await conn.sendMessage(chat, {
      react: { text: EMOJI_SUPLENTE, key: enviado.key }
    });
  }
};