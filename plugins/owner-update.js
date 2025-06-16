import { execSync } from 'child_process';

let handler = async (m, { conn, args, command }) => {
  const mensajeTexto = m.text?.toLowerCase() || '';

  // Aceptar comandos con o sin prefijo
  const isMatch = /^(update|actualizar)$/i.test(command || '') || /^(update|actualizar)$/i.test(mensajeTexto);
  if (!isMatch) return;

  // Reacción visual si está habilitado
  const emoji = global.db?.data?.chats?.[m.chat]?.customEmoji || '⚡';
  m.react?.(emoji);

  try {
    await conn.reply(m.chat, '⚙️ Actualizando el bot, por favor espera unos segundos...', m);

    // Ejecutar git pull
    const output = execSync('git pull' + (args.length ? ' ' + args.join(' ') : '')).toString().trim();

    let response = '';
    if (output.includes('Already up to date')) {
      response = '✅ El bot ya está actualizado. No se encontraron cambios.';
    } else {
      response = `✅ Bot actualizado correctamente:\n\n\`\`\`\n${output}\n\`\`\``;
    }

    await conn.reply(m.chat, response, m);
  } catch (error) {
    try {
      const statusOutput = execSync('git status --porcelain').toString().trim();

      if (statusOutput) {
        const conflictedFiles = statusOutput.split('\n').filter(line =>
          !line.includes('pikachuSession/') &&
          !line.includes('.cache/') &&
          !line.includes('tmp/')
        );

        if (conflictedFiles.length > 0) {
          const msg = `⚠️ Conflictos detectados en:\n\n` +
            conflictedFiles.map(f => `• ${f.slice(3)}`).join('\n') +
            `\n\n🔧 Resuélvelo manualmente o reinstala el bot.`;

          return await conn.reply(m.chat, msg, m);
        }
      }
    } catch (statusError) {
      console.error('Error al verificar estado git:', statusError);
    }

    await conn.reply(m.chat, `❌ Error al actualizar:\n\n${error.message || error}`, m);
  }
};

handler.help = ['update', 'actualizar'];
handler.tags = ['owner'];
handler.command = /^update|actualizar$/i;
handler.rowner = true;

export default handler;