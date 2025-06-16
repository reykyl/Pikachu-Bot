import { execSync } from 'child_process';

const handler = async (m, { conn, args, command }) => {
  const mensajeTexto = m.text?.trim().toLowerCase() || '';
  const cmd = command?.toLowerCase() || '';

  // Soporte para comandos con o sin prefijo
  const isMatch = /^(update|actualizar)$/i.test(cmd) || /^(update|actualizar)$/i.test(mensajeTexto);
  if (!isMatch) return;

  const emoji = global.db?.data?.chats?.[m.chat]?.customEmoji || '⚡';
  if (m.react) m.react(emoji);

  try {
    await conn.reply(m.chat, '🌶️ Actualizando el bot, por favor espera unos segundos...', m);

    const output = execSync(`git pull ${args.join(' ')}`.trim()).toString().trim();

    const response = output.includes('Already up to date')
      ? '✅ El bot ya está actualizado. No hay nuevos cambios.'
      : `✅ Bot actualizado correctamente:\n\n\`\`\`\n${output}\n\`\`\``;

    await conn.reply(m.chat, response, m);
  } catch (error) {
    try {
      const statusOutput = execSync('git status --porcelain').toString().trim();

      const conflictedFiles = statusOutput
        .split('\n')
        .filter(line =>
          line &&
          !line.includes('pikachuSession/') &&
          !line.includes('.cache/') &&
          !line.includes('tmp/')
        );

      if (conflictedFiles.length > 0) {
        const msg = `⚠️ Conflictos detectados en los siguientes archivos:\n\n` +
          conflictedFiles.map(f => `• ${f.slice(3)}`).join('\n') +
          `\n\n🔧 Por favor resuélvelos manualmente o reinstala el bot.`;

        return await conn.reply(m.chat, msg, m);
      }
    } catch (statusError) {
      console.error('❌ Error al verificar estado de git:', statusError);
    }

    await conn.reply(m.chat, `❌ Error al actualizar el bot:\n\n${error.message || error}`, m);
  }
};

// Esto es lo único que necesitas para que funcione con o sin prefijo
handler.command = /^$/; // Esto evita que el sistema lo bloquee
handler.rowner = true;
handler.help = ['update', 'actualizar'];
handler.tags = ['owner'];

export default handler;