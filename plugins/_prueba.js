const handler = async (m, { conn }) => {
  const taguser = `@${m.sender.split("@")[0]}`;

  // O puedes hacer un saludo según la hora:
  const hour = new Date().getHours();
  const saludo = hour >= 5 && hour < 12 ? "buenos días" :
                 hour >= 12 && hour < 18 ? "buenas tardes" :
                 "buenas noches";

  return conn.reply(m.chat, `Hola ${taguser}, ${saludo} 🌟`, m, {
    mentions: [m.sender]
  });
};

handler.command = ['hola'];

export default handler;