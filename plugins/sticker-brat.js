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

        // 🌀 Pikachu preparando el rayo sticker
        await conn.sendMessage(m.chat, { react: { text: '⚡', key: m.key } });

        const res = await fetch(apiUrl);
        const stickerBuffer = await res.buffer();

        await conn.sendMessage(
            m.chat,
            {
                sticker: stickerBuffer,
                packname: 'Pikabot⚡',
                author: await conn.getName(m.sender)
            },
            { quoted: m }
        );

        // ✅ ¡Pika trabajo completo!
        await conn.sendMessage(m.chat, { react: { text: '✅', key: m.key } });

    } catch (err) {
        console.error('❌ Pikachu falló:', err);
        await conn.sendMessage(m.chat, { react: { text: '❌', key: m.key } });

        await conn.reply(
            m.chat,
            '⚠️ Pikachu no pudo crear el sticker... prueba con otro texto~',
            m
        );
    }
};

handler.help = ['brat <texto>'];
handler.tags = ['sticker'];
handler.command = /^brat(icker)?$/i;

export default handler;