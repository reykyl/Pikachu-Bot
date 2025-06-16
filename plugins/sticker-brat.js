import fetch from 'node-fetch';

const handler = async (m, { conn, args, usedPrefix, command }) => {
    try {
        if (!args[0]) {
            return conn.reply(
                m.chat,
                `⚡️¡Pika pika! Escribe algo para convertir en sticker~\n\n📝 Ejemplo:\n${usedPrefix + command} hola bola`, 
                m
            );
        }

        const text = encodeURIComponent(args.join(' '));
        const apiUrl = `https://api.xteam.xyz/attp?file&text=${text}`;

        await conn.sendMessage(m.chat, { react: { text: '⚡', key: m.key } });

        const res = await fetch(apiUrl);
        const imageBuffer = await res.buffer();

        // Envíalo como imagen en vez de sticker, para probar
        await conn.sendMessage(
            m.chat,
            {
                image: imageBuffer,
                caption: '👀 Aquí va el sticker pero como imagen, ¿lo ves?',
            },
            { quoted: m }
        );

        await conn.sendMessage(m.chat, { react: { text: '✅', key: m.key } });

    } catch (err) {
        console.error('❌ ERROR:', err);
        await conn.sendMessage(m.chat, { react: { text: '❌', key: m.key } });

        await conn.reply(
            m.chat,
            '⚠️ Pikachu no pudo descargar la imagen... algo raro pasa~',
            m
        );
    }
};

handler.help = ['brat <texto>'];
handler.tags = ['sticker'];
handler.command = /^brat(icker)?$/i;

export default