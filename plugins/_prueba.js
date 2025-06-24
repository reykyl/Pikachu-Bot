const {
    default: makeWASocket,
    DisconnectReason,
    useMultiFileAuthState
} = require('@whiskeysockets/baileys');
const pino = require('pino');
const {
    Boom
} = require('@hapi/boom');

async function connectToWhatsApp() {
    const {
        state,
        saveCreds
    } = await useMultiFileAuthState('auth_info_baileys');

    const sock = makeWASocket({
        logger: pino({
            level: 'silent'
        }),
        auth: state,
        printQRInTerminal: true
    });

    sock.ev.on('connection.update', (update) => {
        const {
            connection,
            lastDisconnect
        } = update;
        if (connection === 'close') {
            const shouldReconnect = (lastDisconnect.error instanceof Boom) ?
                lastDisconnect.error.output.statusCode !== DisconnectReason.loggedOut :
                true;
            console.log('connection closed due to ', lastDisconnect.error, ', reconnecting ', shouldReconnect);
            // reconnect if not logged out
            if (shouldReconnect) {
                connectToWhatsApp();
            }
        } else if (connection === 'open') {
            console.log('opened connection');
        }
    });

    sock.ev.on('creds.update', saveCreds);

    sock.ev.on('messages.upsert', async m => {
        console.log(JSON.stringify(m, undefined, 2));

        const msg = m.messages[0];
        if (!msg.message) return;

        const from = msg.key.remoteJid;
        const type = Object.keys(msg.message)[0];
        const text = (type === 'conversation') ? msg.message.conversation : (type === 'extendedTextMessage') ? msg.message.extendedTextMessage.text : '';

        if (text.startsWith('!copy ')) {
            const contentToCopy = text.substring('!copy '.length).trim();

            if (contentToCopy) {
                // Generate a message with a button to copy the content
                // Baileys doesn't have a native "copy button" feature like some other APIs.
                // We will simulate it by providing the text clearly and instructing the user.
                // For a more advanced "copy button", you'd typically need to use a custom
                // button type if Baileys supported it directly, or a web-based solution
                // if you were interacting with a web client.

                // For a simple bot, the most straightforward way is to present the text
                // and explain how to copy it.
                await sock.sendMessage(from, {
                    text: `¡Aquí tienes!\n\n\`\`\`${contentToCopy}\`\`\`\n\n_Puedes copiar este texto manteniendo presionado el mensaje._`
                }, {
                    quoted: msg
                });

                // If you want to use interactive buttons for other purposes (not direct "copy" functionality for text),
                // you can explore interactive messages. However, directly making a button copy arbitrary text
                // in the native WhatsApp client via the API is generally not supported.
                /*
                // Example of an interactive button (not for direct text copy, but for other actions)
                const buttons = [
                    { buttonId: 'copy_action', buttonText: { displayText: 'Copiar Texto (no funcional)' }, type: 1 }
                ];

                const buttonMessage = {
                    text: `Aquí tienes el contenido que pediste:\n\n${contentToCopy}`,
                    footer: 'Presiona el botón para una acción (la copia directa no es posible así).',
                    buttons: buttons,
                    headerType: 1
                };

                await sock.sendMessage(from, buttonMessage);
                */

            } else {
                await sock.sendMessage(from, {
                    text: 'Por favor, proporciona el texto o enlace que quieres que copie. Ejemplo: `!copy Hola mundo`'
                }, {
                    quoted: msg
                });
            }
        }
    });
}

connectToWhatsApp();

handler.help = ['copy <texto>'];
handler.tags = ['tools'];
handler.command = /^!copy\s.+/i;

export default handler;