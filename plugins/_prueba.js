const handler = async (m, { conn }) => {
    const codigoACopiar = 'DESC20';
const mensajeConCodigo = `Aquí está tu código:\n\`\`\`\n${codigoACopiar}\n\`\`\``;
await conn.sendMessage(m.chat, { text: mensajeConCodigo }, { quoted: m });
};

handler.command = ['h']; // O el comando que prefieras
export default handler;
