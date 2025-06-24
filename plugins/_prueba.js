let handler = async (m, { conn }) => {
  try {
    const canalJid = '0029VawF8fBBvvsktcInIz3m@newsletter';

    await conn.sendMessage(canalJid, {
      text: '📢 Mensaje de prueba enviado desde el bot ✅'
    });

    await m.reply('✅ Mensaje enviado correctamente (revisa si aparece en el canal).');

  } catch (e) {
    console.error('❌ Error real:', e);
    await m.reply('❌ Error al enviar al canal: ' + (e?.message || e));
  }
};

handler.command = ['probarcanal'];
handler.rowner = true;
export default handler;