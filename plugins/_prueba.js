Const handler = async (m, { conn }) => {
    const codigoACopiar = 'MI_CODIGO_SECRETO_123';

    // Construimos el mensaje de forma más directa, asegurando los saltos de línea y los backticks
    const mensajeParaWhatsApp = "Aquí está tu código:\n" +
                               "```\n" +
                               codigoACopiar + "\n" +
                               "```";

    await conn.sendMessage(m.chat, {
        text: mensajeParaWhatsApp
    }, { quoted: m });
};

handler.command = ['h'];
export default handler;
