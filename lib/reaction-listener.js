import { partidas, EMOJI_TITULAR, EMOJI_SUPLENTE, MAX_TITULARES, MAX_SUPLENTES, generarMensaje } from '../plugins/4vs4.js'

export default async function handleReaction({ conn, emoji, user, chat, msgId }) {
  const partida = partidas[chat];
  if (!partida || partida.msgId !== msgId || partida.finalizado) return;

  // ❌ Ignorar si el bot reaccionó
  if (user === conn.user.id) return;

  // ❌ Ignorar si ya está en la lista
  const yaEnLista = partida.titulares.includes(user) || partida.suplentes.includes(user);
  if (yaEnLista) return;

  // ✅ Agregar según la reacción
  if (emoji === EMOJI_TITULAR && partida.titulares.length < MAX_TITULARES) {
    partida.titulares.push(user);
  } else if (emoji === EMOJI_SUPLENTE && partida.suplentes.length < MAX_SUPLENTES) {
    partida.suplentes.push(user);
  } else {
    return;
  }

  // ✅ Verificar si la partida se completó
  const completo = partida.titulares.length === MAX_TITULARES && partida.suplentes.length === MAX_SUPLENTES;
  if (completo) {
    partida.finalizado = true;
  }

  // ❌ Borrar mensaje anterior
  try {
    await conn.sendMessage(chat, { delete: partida.msgKey });
  } catch (e) {
    console.error('❗ Error al borrar el mensaje anterior:', e);
  }

  // ✅ Enviar nuevo mensaje actualizado
  const nuevoTexto = generarMensaje(partida.titulares, partida.suplentes);
  const enviado = await conn.sendMessage(chat, {
    text: nuevoTexto,
    mentions: [...partida.titulares, ...partida.suplentes],
  });

  // ✅ Actualizar nueva key/id del mensaje
  partida.msgId = enviado.key.id;
  partida.msgKey = enviado.key;

  // ✅ Volver a poner las reacciones
  if (!partida.finalizado) {
    await conn.sendMessage(chat, { react: { text: EMOJI_TITULAR, key: enviado.key } });
    await conn.sendMessage(chat, { react: { text: EMOJI_SUPLENTE, key: enviado.key } });
  }
}