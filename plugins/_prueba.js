const handler = async (m, { conn }) => {
    // Si el mensaje viene de un botón 'Haz clic para copiar'
    if (m.text === 'id1') { // Verifica si el 'buttonId' enviado es 'id1'
        const codigoReal = 'DESC20';
        const mensajeCodigo = `Aquí tienes tu código:\n\`\`\`\n${codigoReal}\n\`\`\`\n\nPresiona el código de arriba para que te aparezca la opción de copiar.`;
        await conn.sendMessage(m.chat, { text: mensajeCodigo }, { quoted: m });
    } else {
        // Este es el mensaje inicial con el botón
        const buttons = [
            { buttonId: 'id1', buttonText: { displayText: 'Haz clic para ver el código' }, type: 1 }
        ];

        const buttonMessage = {
            text: "Necesitas un código? Presiona el botón:",
            footer: 'Te lo enviaré en un formato fácil de copiar.',
            buttons: buttons,
            headerType: 1
        };
        await conn.sendMessage(m.chat, buttonMessage);
    }
};

handler.command = ['h'];
export default handler;
