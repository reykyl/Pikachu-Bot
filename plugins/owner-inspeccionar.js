let handler = async (m, { conn, args }) => {
  try {
    if (!args[0]) return m.reply('❌ Proporciona la URL de un *grupo* o *canal*.');

    let url = args[0];
    let id, tipo;

    if (url.includes('chat.whatsapp.com')) {
      
      let code = url.split('/').pop().trim();
      id = await conn.groupAcceptInvite(code).catch(() => null);
      if (!id) return m.reply('❌ No se pudo unir temporalmente al grupo para obtener info. Asegúrate de que el enlace es válido.');
      tipo = 'Grupo';
    } else if (url.includes('whatsapp.com/channel/')) {
      
      let rawId = url.split('/channel/').pop().trim();
      id = rawId + '@newsletter';
      tipo = 'Canal';
    } else {
      return m.reply('❌ URL inválida. Solo se permiten enlaces de *grupos* o *canales*.');
    }

    let nombre = await conn.getName(id);
    let participantes = [];
    let descripcion = '';

    if (tipo === 'Grupo') {
      const info = await conn.groupMetadata(id);
      participantes = info.participants.map(p => p.id);
      descripcion = info.desc || 'Sin descripción';
    } else if (tipo === 'Canal') {
      descripcion = 'Canal de WhatsApp (newsletter)';
    }

    let texto = `┌─ ⟡ *INSPECCIÓN DE CHAT*\n│\n│ 📌 *Tipo:* ${tipo}\n│ 🆔 *ID:* ${id}\n│ 📛 *Nombre:* ${nombre}\n│ 👥 *Participantes:* ${participantes.length || 'N/A'}\n│ 📝 *Descripción:* ${descripcion.slice(0, 100)}${descripcion.length > 100 ? '...' : ''}\n│\n└────⟡`;

    await m.reply(texto);
   await m.reply(`${id}`);
  } catch (e) {
    console.error(e);
    await m.reply('❌ Error al inspeccionar el enlace. Asegúrate de que el bot tenga permisos para acceder.');
  }
};

handler.help = ['inspeccionar <url>'];
handler.tags = ['tools'];
handler.command = ['inspeccionar', 'id', 'chatinfo'];
handler.rowner = true;

export default handler;