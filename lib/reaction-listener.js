import { partidas, EMOJI_TITULAR, EMOJI_SUPLENTE, MAX_TITULARES, MAX_SUPLENTES, generarMensaje } from '../plugins/4vs4.js';

export default function setupReactionListener(conn) {
    conn.ev.on('messages.upsert', async ({ messages }) => {
        const m = messages[0];
        if (!m?.message?.reactionMessage) return;

        const chat = m.key.remoteJid;
        const id = m.message.reactionMessage.key.id;
        const emoji = m.message.reactionMessage.text;
        const user = m.message.reactionMessage.key.participant;

        const partida = partidas[chat];
        if (!partida || partida.msgId !== id || partida.finalizado) return;
        if (!emoji || (emoji !== EMOJI_TITULAR && emoji !== EMOJI_SUPLENTE)) return;

        const yaEnLista = partida.titulares.includes(user) || partida.suplentes.includes(user);
        if (yaEnLista) return;

        if (emoji === EMOJI_TITULAR && partida.titulares.length < MAX_TITULARES) {
            partida.titulares.push(user);
        } else if (emoji === EMOJI_SUPLENTE && partida.suplentes.length < MAX_SUPLENTES) {
            partida.suplentes.push(user);
        } else {
            return;
        }

        const completo = partida.titulares.length === MAX_TITULARES && partida.suplentes.length === MAX_SUPLENTES;
        if (completo) partida.finalizado = true;

        try {
            await conn.sendMessage(chat, { delete: partida.msgKey });
        } catch (e) {
            console.log('[ERROR AL BORRAR MENSAJE]', e);
        }

        const nuevoMensaje = generarMensaje(partida.titulares, partida.suplentes);
        const enviado = await conn.sendMessage(chat, {
            text: nuevoMensaje,
            mentions: [...partida.titulares, ...partida.suplentes]
        });

        partida.msgId = enviado.key.id;
        partida.msgKey = enviado.key;
    });
}