import fetch from 'node-fetch';

const handler = async (m, { conn, args, usedPrefix, command }) => {
    try {
        // ¡Pika! ¿No escribiste nada? Entonces no hay sticker 🙁
        if (!args[0]) {
            return conn.reply(
                m.chat,
                `> 🧠 𝘌𝘴𝘤𝘳𝘪𝘣𝘦 𝘶𝘯 𝘵𝘦𝘹𝘵𝘰 𝘱𝘢𝘳𝘢 𝘤𝘰𝘯𝘷𝘦𝘳𝘵𝘪𝘳 𝘦𝘯 𝘴𝘵𝘪𝘤𝘬𝘦𝘳.\n\n💬 𝘌𝘫𝘦𝘮𝘱𝘭𝘰:\n${usedPrefix + command} hola bola`, 
                m
            );
        }

        const text = encodeURIComponent(args.join(' '));
        const apiUrl = `https://api.dikiotw.my.id/api/sticker/attp?text=${text}`;

        // ⚡ Pika espera un momentito... estoy generando magia
        await conn.sendMessage(m.chat, { react: { text: '⏳', key: m.key } });

        // 🧃 Pika-pull... llamando a la fábrica de stickers
        const res = await fetch(apiUrl, { timeout: 10000 });
        if (!res.ok) throw new Error(`API falló: ${res.status}`);
        const json = await res.json();
        if (!json.result) throw new Error('Pikachu no entendió la respuesta 😢');

        const stickerUrl = json.result;

        // ✨ Pikachu lanza el sticker con todo el flow
        await conn.sendMessage(
            m.chat,
            {
                sticker: { url: stickerUrl },
                packname: 'Barboza',
                author: await conn.getName(m.sender)
            },
            { quoted: m }
        );

        // ✅ ¡Pikachu dice que salió perfecto!
        await conn.sendMessage(m.chat, { react: { text: '✅', key: m.key } });

    } catch (err) {
        console.error('❌ Pika-error:', err);
        // 💥 Pikachu se cayó... pero se levanta
        await conn.sendMessage(m.chat, { react: { text: '❌', key: m.key } });

        // 🥺 Pikachu lo intentó, pero no pudo esta vez
        await conn.reply(
            m.chat,
            '> ⚠️ 𝘖𝘰𝘰𝘩... 𝘱𝘢𝘳𝘦𝘤𝘦 𝘲𝘶𝘦 𝘩𝘶𝘣𝘰 𝘶𝘯 𝘧𝘢𝘭𝘭