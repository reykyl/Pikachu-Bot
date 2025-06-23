import PhoneNumber from 'awesome-phonenumber';
import chalk from 'chalk';
import { watchFile } from 'fs';

const urlRegex = (await import('url-regex-safe')).default({ strict: false });

export default async function (m, conn = { user: {} }) {
  let senderName = await conn.getName(m.sender);
  let senderNumber = PhoneNumber('+' + m.sender.replace('@s.whatsapp.net', '')).getNumber('international');
  let chatName = await conn.getName(m.chat);
  let chatType = m.isGroup ? '👥 Grupo' : '💌 Chat Privado';

  let text = (m.text || '').replace(/\u200e+/g, '');
  if (text.length < 4096) {
    text = text.replace(urlRegex, url => chalk.blueBright(url));
    if (m.mentionedJid) {
      for (let jid of m.mentionedJid) {
        const name = await conn.getName(jid);
        text = text.replace('@' + jid.split('@')[0], chalk.blueBright('@' + name));
      }
    }
  }

  // DISEÑO PIKACHU 🟡
  console.log(chalk.yellowBright(`
╭──────── ⚡ 𝙋𝙞𝙠𝙖𝙘𝙝𝙪 𝙇𝙤𝙜 ⚡ ────────⬣
│ ${chalk.cyan(chatType)}: ${chalk.white(chatName)}
│ 🧍 Usuario: ${chalk.green(senderNumber)} ~ ${chalk.white(senderName)}
╰────────────────────────────────────⬣
💬 ${chalk.cyan(text)}
`.trim()));

  console.log();
}

let file = global.__filename(import.meta.url);
watchFile(file, () => {
  console.log(chalk.redBright("🔄 Se actualizó 'lib/print.js'"));
});