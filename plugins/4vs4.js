import makeWASocket, { useMultiFileAuthState } from '@whiskeysockets/baileys';
import P from 'pino';

const { state, saveCreds } = await useMultiFileAuthState('auth');

const sock = makeWASocket({
  printQRInTerminal: true,
  auth: state,
  logger: P({ level: 'silent' }),
});

sock.ev.on('creds.update', saveCreds);

// Captura reacciones
sock.ev.on('messages.reaction', async (reaction) => {
  const emoji = reaction.text;
  const user = reaction.key.participant;
  const msgId = reaction.key.id;
  const chat = reaction.key.remoteJid;

  console.log(`🔥 Reacción detectada: ${emoji} de ${user} en ${chat} sobre mensaje ${msgId}`);

  // ✉️ Enviar respuesta en el mismo chat
  const texto = `Recibí tu reacción ${emoji}, @${user.split('@')[0]} 👀`;
  await sock.sendMessage(chat, {
    text: texto,
    mentions: [user]
  });
});