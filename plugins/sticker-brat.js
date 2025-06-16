import fetch from 'node-fetch';

const handler = async (m, { conn, args, usedPrefix, command }) => {
    try {
        if (!args[0]) {
            return conn.reply(
                m.chat,
                `> 🧠 𝘌𝘴𝘤𝘳𝘪𝘣𝘦 𝘶𝘯 𝘵𝘦𝘹𝘵𝘰 𝘱𝘢𝘳𝘢 𝘤𝘰𝘯𝘷𝘦𝘳𝘵𝘪𝘳 𝘦𝘯 𝘴𝘵𝘪𝘤𝘬𝘦𝘳.\n\n💬 𝘌𝘫𝘦𝘮𝘱𝘭𝘰:\n${usedPrefix + command} hola bola`, 
                m
            );
        }

        const text = encodeURIComponent(args.join(' '));
        const apiUrl = `https://api.dikiotw.my.id/api/sticker/attp?text=${text}`;

        // ⏳ Pika cargando el sticker
        await conn.sendMessage(m.chat, { react: { text: '⏳', key: m.key } });

        const res = await fetch(apiUrl);
        const json = await res.json();

        // 🔎 Mostrar en consola lo que responde la API
        console.log('Respuesta API:', json);

        // ✅ Verificamos si trae una URL válida
        const stickerUrl = json.result || json.url || json?.data?.url;

        if (!stickerUrl) throw new Error('No se encontró la URL del sticker');

        await conn.sendMessage(
            m.chat,
            {
                sticker: { url: stickerUrl },
                packname: 'Barboza',
                author: await conn.getName(m.sender)
            },
            { quoted: m }
        );

        await conn.sendMessage(m.chat, { react: { text: '✅', key: m.key } });

    } catch (err) {
        console.error('❌ Error Pikachu:', err);

        await conn.sendMessage(m.chat, { react: { text: '❌', key: m.key } });

        await conn.reply(
            m.chat,
            '> ⚠️ 𝘗𝘪𝘬𝘢𝘤𝘩𝘶 𝘯𝘰 𝘱𝘶𝘥𝘰 𝘤𝘳𝘦𝘢𝘳 𝘦𝘭 𝘴𝘵𝘪𝘤𝘬𝘦𝘳... 𝘪𝘯𝘵é𝘯𝘵𝘢 𝘭𝘶𝘦𝘨𝘪𝘵𝘰~',
            m
        );
    }
};

handler.help = ['brat <texto>'];
handler.tags = ['sticker'];
handler.command = /^brat(icker)?$/i;

export default handler;