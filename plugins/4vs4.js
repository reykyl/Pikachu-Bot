export default {
  async all(conn) {
    conn.ev.on('messages.reaction', async (reaction) => {
      const emoji = reaction.text;
      const user = reaction.key.participant;
      const chat = reaction.key.remoteJid;

      console.log(`🔥 Reacción detectada: ${emoji} de ${user} en ${chat}`);

      await conn.sendMessage(chat, {
        text: `Recibí tu reacción ${emoji}, @${user.split('@')[0]} 👀`,
        mentions: [user]
      });
    });
  }
}