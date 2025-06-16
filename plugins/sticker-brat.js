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
        const apiUrl = `https://api.lolhuman.xyz/api/attp?apikey=TuApiKeyLolhuman&text=${text}`;

        // ⏳ Pikachu está creando tu sticker...
        await conn.sendMessage(m.chat, { react: { text: '⚡', key: m.key } });

        const response = await fetch(apiUrl);
        const buffer = await response.buffer();

        await conn.sendMessage(
            m.chat,
            {
                sticker: buffer,
                packname: 'Pikabot⚡',
                author: await conn.getName(m.sender)
            },
            { quoted: m }
        );

        await conn.sendMessage(m.chat, { react: { text: '✅', key: m.key } });

    } catch (err) {
        console.error('❌ Pikachu falló:', err);
        await conn.sendMessage(m.chat, { react: { text: '❌', key: m.key } });

        await conn.reply(
            m.chat,
            '⚠️ Pikachu no pudo crear el sticker... prueba otra vez