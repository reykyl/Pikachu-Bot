const handler = async (m, { conn }) => {
    const codigoACopiar = 'EQ3M-WGSK'; // El texto que quieres que el usuario pueda copiar
    // Formatea el mensaje para que WhatsApp lo reconozca como un bloque de código
    const mensajeConFormatoDeCodigo = `Aquí está tu código:\n\`\`\`\n${codigoACopiar}\n\`\`\``;

    await conn.sendMessage(m.chat, {
        text: mensajeConFormatoDeCodigo
    }, { quoted: m }); // Envía el mensaje al chat
};

handler.command = ['h']; // O el comando que uses para activarlo
export default handler;
