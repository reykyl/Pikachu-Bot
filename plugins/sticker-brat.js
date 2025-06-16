/* Código optimizado por Angel para Pikachu Bot */

import fetch from 'node-fetch';
import AbortController from 'abort-controller';

// === Textos personalizables ===
const TEXTS = {
    usage: (prefix, cmd) =>
        `*⚡ Usa bien el comando:*\n> *${prefix + cmd} <texto>*\n\n_Ejemplo:_\n${prefix + cmd} soy un brat`,

    tooLong: (max, length) =>
        `❗ *Texto demasiado largo* (máx. ${max} caracteres)\n\nTu texto tiene *${length}* caracteres.`,

    errorGeneric: '*❌ Ocurrió un error inesperado al generar el sticker.*',
    errorTimeout: '*⏱️ La API tardó demasiado en responder.*',
    errorTip: '_Tip: Revisa tu conexión o intenta más tarde._',
    errorDetail: (msg) => `🔧 *Detalle técnico:* ${msg}`
};

const MAX_TEXTO = 40;
const STICKER_CACHE = new Map(); // Cache en memoria: texto => Buffer
let USAGE_COUNT = 0; // Contador de uso

const handler = async (m, { conn, args, usedPrefix, command }) => {
    const start = Date.now(); // Tiempo inicial

    try {
        const inputText = args.join(' ').trim();

        if (!inputText)
            return conn.reply(m.chat, TEXTS.usage(usedPrefix, command), m);

        if (inputText.length > MAX_TEXTO)
            return conn.reply(m.chat, TEXTS.tooLong(MAX_TEXTO, inputText.length), m);

        await conn.sendMessage(m.chat, { react: { text: '⚡', key: m.key } });

        let buffer;

        // Verificamos si ya existe en la cache
        if (STICKER_CACHE.has(inputText)) {
            buffer = STICKER_CACHE.get(inputText);
            console.log(`✅ Usando sticker cacheado para: "${inputText}"`);
        } else {
            const apiUrl = `https://api.siputzx.my.id/api/m/brat?text=${encodeURIComponent(inputText)}`;

            const controller = new AbortController();
            const timeout = setTimeout(() => controller.abort(), 10000);

            let res;
            try {
                res = await fetch(apiUrl, { signal: controller.signal });
            } finally {
                clearTimeout(timeout);
            }

            if (!res.ok) throw new Error(`API falló (${res.status})`);

            buffer = await res.buffer();
            STICKER_CACHE.set(inputText, buffer); // Guardar en cache
        }

        await conn.sendMessage(m.chat, {
            sticker: buffer,
            packname: 'Barboza',
            author: await conn.getName(m.sender)
        }, { quoted: m });

        await conn.sendMessage(m.chat, { react: { text: '✅', key: m.key } });

        USAGE_COUNT++;
        console.log(`📊 [STATS] /brat usado ${USAGE_COUNT} veces.`);
        console.log(`⏱️ Tiempo de ejecución: ${Date.now() - start}ms`);

    } catch (err) {
        console.error('[ERROR EN /brat]', err);

        const isTimeout = err.name === 'AbortError' || err.message.includes('timeout');
        const msgError = isTimeout ? TEXTS.errorTimeout : TEXTS.errorGeneric;

        await conn.sendMessage(m.chat, { react: { text: '❌', key: m.key } });

        await conn.reply(m.chat,
            `${msgError}\n\n${TEXTS.errorTip}\n\n${TEXTS.errorDetail(err.message)}`,
            m
        );
    }
};

export default handler;