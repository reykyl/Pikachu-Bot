var handler = async (m, { conn, command, text }) => {
  if (!text) return conn.reply(
    m.chat,
    `⚡️💛 *¡Pika-Pika! Necesito dos nombres para calcular el amor electrizante...*\n\nEjemplo: *#${command} Ash Misty*`,
    m
  );

  let [nombre1, ...resto] = text.split(' ');
  let nombre2 = (resto || []).join(' ');

  if (!nombre2) return conn.reply(
    m.chat,
    `💫 *Ups... falta el segundo nombre, entrenador.*\n\nUsa así: *#${command} Pikachu Eevee*`,
    m
  );

  let porcentaje = Math.floor(Math.random() * 101); // 0 a 100
  let frases = [
    `⚡️💛 *${nombre1}* y *${nombre2}* tienen un *${porcentaje}%* de compatibilidad. ¡Pika-amor! 💖`,
    `🌩️ *${nombre1}* siente chispas por *${nombre2}* con un *${porcentaje}%* de electricidad romántica. ✨`,
    `💘 Según el radar de amor Pokémon, *${nombre1}* y *${nombre2}* tienen un *${porcentaje}%* de conexión 💞`,
    `⚡ *Pikachu detecta una energía del *${porcentaje}%* entre *${nombre1}* y *${nombre2}*. ¡Eso puede evolucionar! 🥰`,
    `💓 *${nombre1}* y *${nombre2}* tienen un *${porcentaje}%* de probabilidad de ser la mejor pareja del equipo Rocket ❤️‍🔥`
  ];

  let resultado = frases[Math.floor(Math.random() * frases.length)];

  conn.reply(m.chat, resultado, m, {
    mentions: conn.parseMention(resultado)
  });
};

handler.help = ['ship', 'amor', 'pareja', 'love', 'compatibilidad']
handler.tags = ['fun']
handler.command = /^(ship|amor|pareja|love|compatibilidad)$/i

handler.group = true;
handler.register = true;

export default handler;