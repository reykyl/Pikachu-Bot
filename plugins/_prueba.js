// En tu archivo 'copycode.js' (o similar) dentro de tu carpeta de comandos
const handler = async (sock, m, chatUpdate, store) => {
    // 'sock' es la instancia de Baileys socket
    // 'm' es el objeto del mensaje
    // 'chatUpdate' y 'store' son útiles para el contexto del chat y la gestión del estado

    const prefix = '/'; // Define tu prefijo de comando aquí

    // Verifica si el mensaje comienza con el comando /copycode
    if (m.message && m.message.conversation && m.message.conversation.toLowerCase().startsWith(prefix + 'copycode')) {
        await sock.sendMessage(m.key.remoteJid, { text: '¡Entendido! Estoy configurado para detectar códigos de restablecimiento de contraseña de Facebook automáticamente. Si me envías un mensaje con uno, lo procesaré.' });
        // O podrías pedir al usuario que envíe el código:
        // await sock.sendMessage(m.key.remoteJid, { text: 'Por favor, envíame el código de Facebook que deseas que procese.' });
    }
};

handler.command = /^copycode$/i; // El comando que activa este handler
handler.description = 'Información sobre la detección de códigos de Facebook.'; // Una descripción para tu ayuda

export default handler; // Exporta el handler
