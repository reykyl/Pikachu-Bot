const handler = async (m, { conn }) => {
    const codigoACopiar = 'PRUEBA_COPIAR_XYZ'; // Usa un código diferente para asegurar que es un mensaje nuevo
    const mensajeConFormatoDeCodigo = `Aquí está tu código:`;
    const code = `\`\`\`\n${codigoACopiar}\n\`\`\``;

    await conn.sendMessage(m.chat, {
        text: mensajeConFormatoDeCodigo
        code: code
    }, { quoted: m });
};

handler.command = ['h'];
export default handler;
