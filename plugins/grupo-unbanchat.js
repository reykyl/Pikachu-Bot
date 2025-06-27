let handler = async (m, { conn, usedPrefix, command, args }) => {
  if (!(m.chat in global.db.data.chats)) 
    return conn.reply(m.chat, '❌ *¡ESTE CHAT NO ESTÁ REGISTRADO EN EL MUNDO PIKACHU!*', m, rcanal);

  let chat = global.db.data.chats[m.chat];

  if (command === 'pikachu') {
    if (args.length === 0) {
      const estado = chat.isBanned ? '⚠️ *DESCARGADO*' : '⚡ *CARGADO*';
      const info = `🔋 *CENTRO DE CONTROL DE PIKACHU-BOT* ⚡  
╭━━━━━━━━━━━━━━━━━━━━━━━╮  
┃ *🎮 COMANDOS DE ENERGÍA:*  
┃ ✧ *${usedPrefix}pikachu on* – ⚡ Encender  
┃ ✧ *${usedPrefix}pikachu off* – 💤 Apagar  
╰━━━━━━━━━━━━━━━━━━━━━━━╯  
📡 *Estado actual:* ${estado}`;

      return conn.reply(m.chat, info, m, rcanal);
    }

    if (args[0] === 'off') {
      if (chat.isBanned) 
        return conn.reply(m.chat, '⚠️ *¡PIKACHU-BOT YA ESTABA DESCARGADO EN ESTE CHAT!*', m, rcanal);

      chat.isBanned = true;
      return conn.reply(m.chat, '🪫 *¡PIKACHU-BOT AHORA ESTÁ DESCARGADO EN ESTE CHAT!*', m, rcanal);
    } else if (args[0] === 'on') {
      if (!chat.isBanned) 
        return conn.reply(m.chat, '🔌 *¡PIKACHU-BOT YA ESTABA CARGADO Y LISTO PARA COMBATIR!*', m, rcanal);

      chat.isBanned = false;
      return conn.reply(m.chat, '⚡ *¡PIKACHU-BOT CARGADO Y LISTO PARA LA AVENTURA!*', m, rcanal);
    }
  }
};

handler.help = ['pikachu'];
handler.tags = ['grupo'];
handler.command = ['pikachu'];
handler.admin = true;

export default handler;