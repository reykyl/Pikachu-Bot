import { makeWASocket, useMultiFileAuthState, DisconnectReason, fetchLatestBaileysVersion } from '@whiskeysockets/baileys';
import Pino from 'pino';
import fs from 'fs';
import path from 'path';

const commands = {};

async function loadCommands() {
    const commandsDir = path.join(process.cwd(), 'commands');
    if (!fs.existsSync(commandsDir)) {
        fs.mkdirSync(commandsDir);
    }

    const commandFileContent = `
const handler = async (m, conn) => {
    const jid = m.chat;

    const imageUrl = 'https://files.catbox.moe/b0woxx.jpg'; // Reemplaza con la URL de tu imagen
    const productName = "Xeon Bot Incorporado";
    const productDescription = "¡Estoy legalmente equivocado, pero éticamente correcto! Presentamos a un chico de ensueño llamado _carlos_";
    const productPrice = "$12.00";
    const buttonText = "Ver Detalles";
    const buttonId = "VER_DETALLES_XEON_BOT";

    const message = {
        image: { url: imageUrl },
        caption: \`*\${productName}*\\n\\n\${productDescription}\\n\\n*Precio: \${productPrice}*\\n\\nPara más información, presiona "Ver Detalles".\`,
        buttons: [
            {
                buttonId: buttonId,
                buttonText: { displayText: buttonText },
                type: 1
            }
        ],
        headerType: 4
    };

    try {
        await conn.sendMessage(jid, message);
    } catch (error) {
        conn.sendMessage(jid, { text: 'Lo siento, no pude enviar la información del producto en este momento. Intenta de nuevo más tarde.' });
    }
};

handler.help = ['comprar', 'buy'];
handler.command = ['comprar', 'buy'];
handler.tags = ['ventas', 'productos'];
handler.register = true;
handler.limit = false;

export default handler;
`;

    const commandFilePath = path.join(commandsDir, 'comprar.js');
    fs.writeFileSync(commandFilePath, commandFileContent.trim());

    const commandFiles = fs.readdirSync(commandsDir).filter(file => file.endsWith('.js'));

    for (const file of commandFiles) {
        const commandModule = await import(`file://${path.join(commandsDir, file)}`);
        if (commandModule.default && commandModule.default.command) {
            const cmdHandler = commandModule.default;
            if (Array.isArray(cmdHandler.command)) {
                cmdHandler.command.forEach(cmd => {
                    commands[cmd.toLowerCase()] = cmdHandler;
                });
            } else {
                commands[cmdHandler.command.toLowerCase()] = cmdHandler;
            }
        }
    }
}

async function connectToWhatsApp() {
    const { state, saveCreds } = await useMultiFileAuthState('auth_info_baileys');
    const { version, isLatest } = await fetchLatestBaileysVersion();

    const sock = makeWASocket({
        logger: Pino({ level: 'silent' }),
        printQRInTerminal: true,
        auth: state,
    });

    sock.ev.on('connection.update', (update) => {
        const { connection, lastDisconnect } = update;
        if (connection === 'close') {
            const shouldReconnect = lastDisconnect.error?.output?.statusCode !== DisconnectReason.loggedOut;
            if (shouldReconnect) {
                connectToWhatsApp();
            }
        }
    });

    sock.ev.on('creds.update', saveCreds);

    sock.ev.on('messages.upsert', async ({ messages }) => {
        const m = messages[0];
        if (!m.message) return;

        const text = m.message.conversation || m.message.extendedTextMessage?.text || '';
        const prefix = '!';

        if (text.startsWith(prefix)) {
            const args = text.slice(prefix.length).trim().split(/ +/);
            const commandName = args.shift().toLowerCase();

            if (commands[commandName]) {
                const handler = commands[commandName];
                try {
                    await handler(m, sock);
                } catch (e) {
                    sock.sendMessage(m.chat, { text: 'Ocurrió un error al ejecutar tu comando.' });
                }
            }
        }

        if (m.message.buttonsResponseMessage) {
            const buttonId = m.message.buttonsResponseMessage.buttonId;
            const remoteJid = m.key.remoteJid;

            if (buttonId === "VER_DETALLES_XEON_BOT") {
                await sock.sendMessage(remoteJid, { text: '¡Claro! Puedes encontrar más detalles y comprar el Xeon Bot aquí: https://tudominio.com/xeonbot' });
            }
        }
    });
}

(async () => {
    await loadCommands();
    connectToWhatsApp();
})();
