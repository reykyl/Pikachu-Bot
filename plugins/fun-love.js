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

  let porcentaje = Math.floor(Math.random() * 101); 
  let frases = [
  `⚡️💛 *${nombre1}* y *${nombre2}* tienen un *${porcentaje}%* de compatibilidad. ¡Pika-amor! 💖`,
  `🌩️ *${nombre1}* siente chispas por *${nombre2}* con un *${porcentaje}%* de electricidad romántica. ✨`,
  `💘 Según el radar de amor Pokémon, *${nombre1}* y *${nombre2}* tienen un *${porcentaje}%* de conexión 💞`,
  `⚡ *Pikachu detecta una energía del *${porcentaje}%* entre *${nombre1}* y *${nombre2}*. ¡Eso puede evolucionar! 🥰`,
  `💓 *${nombre1}* y *${nombre2}* tienen un *${porcentaje}%* de probabilidad de ser la mejor pareja del equipo Rocket ❤️‍🔥`,
  `💥 *${nombre1}* lanzó un ataque de amor 💘 y *${nombre2}* recibió *${porcentaje}%* de daño emocional 🥺`,
  `🔥 *Charizard* aprueba esta pareja con un *${porcentaje}%* de pasión ardiente entre *${nombre1}* y *${nombre2}* 🔥`,
  `🍃 *Bulbasaur* dice que *${nombre1}* y *${nombre2}* florecen juntos con un *${porcentaje}%* de ternura 🌸`,
  `❄️ *Glaceon* siente una brisa fría de nervios entre *${nombre1}* y *${nombre2}*, pero con un *${porcentaje}%* de calor interior 💞`,
  `💫 *Mewtwo* ha analizado su ADN y dice que *${nombre1}* y *${nombre2}* tienen un *${porcentaje}%* de fusión perfecta 🧬`,
  `🔮 *Jigglypuff* canta una canción para *${nombre1}* y *${nombre2}* con *${porcentaje}%* de dulzura 💗`,
  `🧡 *${nombre1}* atrapó el corazón de *${nombre2}* con una Pokébola del amor con un *${porcentaje}%* de efectividad 😍`,
  `🌟 ¡Ash y Misty estarían orgullosos! *${nombre1}* y *${nombre2}* tienen un *${porcentaje}%* de historia épica 💘`,
  `⚔️ *Gardevoir* protege este amor con un *${porcentaje}%* de lealtad entre *${nombre1}* y *${nombre2}* 💎`,
  `🎇 El Profesor Oak dice que esta relación tiene un *${porcentaje}%* de probabilidad de convertirse en leyenda Poké-romántica 📚`
]

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
