const handler = async (m, { conn }) => {
    const codigoACopiar = `const handler = async (m, { conn }) => {
    const codigoACopiar = 'MI_CODIGO_SECRETO_123';

    // Mensaje con código formateado en bloque
    const mensajeParaWhatsApp = `Aquí está tu código:\n\`\`\`\n${codigoACopiar}\n\`\`\``;

    await conn.sendMessage(m.chat, {
        text: mensajeParaWhatsApp
    }, { quoted: m });
};

handler.command = ['h'];
export default handler;`;

    // Mensaje con código formateado en bloque
    const mensajeParaWhatsApp = `Aquí está tu código:\n\`\`\`\n${codigoACopiar}\n\`\`\``;

    await conn.sendMessage(m.chat, {
        text: mensajeParaWhatsApp
    }, { quoted: m });
};

handler.command = ['h'];
export default handler;