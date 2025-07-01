export async function before(m, { conn }) { 
  if (!m.text || !global.prefix.test(m.text)) return;

  const chat = global.db.data.chats[m.chat];
  if (chat?.isBanned) return; 

  const usedPrefix = global.prefix.exec(m.text)[0];
  const command = m.text.slice(usedPrefix.length).trim().split(' ')[0].toLowerCase();

  const validCommand = (command, plugins) => {
    for (let plugin of Object.values(plugins)) {
      if (plugin.command && (Array.isArray(plugin.command) ? plugin.command : [plugin.command]).includes(command)) {
        return true;
      }
    }
    return false;
  };

  if (!command) return;
  if (command === "bot") return;

  if (validCommand(command, global.plugins)) {
    let user = global.db.data.users[m.sender];
    if (!user.commands) user.commands = 0;
    user.commands += 1;
  } else {
    const comando = m.text.trim().split(' ')[0];
    const pikachuReply = `
╭━━━〔 ⚡ *𝙋𝙞𝙠𝙖𝙘𝙝𝙪 𝘽𝙤𝙩* ⚡ 〕━━━⬣
┃ *¡Comando no reconocido!*
┃ 
┃ ⚠️ El comando:
┃ ✘  *${comando}*
┃ ━━━━━━━━━━━━━━━━━
┃ ❗ No existe en mi lista
┃ 📜 Usa *#menu* para ver todos 
┃ los comandos disponibles
╰━━━━━━━━━━━━━━━━━━━━━⬣`.trim();

    await conn.reply(m.chat, pikachuReply, m, rcanal);
  }
}