/*código hecho por Angel para Pikachu Bot*/

import fetch from 'node-fetch';

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

const handler = async (m, { conn, args, usedPrefix, command }) => {
    try {
        if (!args[0]) {
            return conn.reply(m.chat, TEXTS.usage(usedPrefix, command), m);
        }

        const inputText = args.join(' ').trim();

        if (inputText.length > MAX_TEXTO) {
            return conn.reply(m.chat, TEXTS.tooLong(MAX_TEXTO, inputText.length), m);
        }

        const apiUrl = `https://api.siputzx.my.id/api/m/brat?text=${encodeURIComponent(inputText)}`;

        await conn.sendMessage(m.chat, { react: { text: '⚡', key: m.key } });

        const res = await fetch(apiUrl, { timeout: 10000 });
        if (!res.ok) throw new Error(`API falló (${res.status})`);

        const buffer = await res.buffer();

        await conn.sendMessage(m.chat, {
            sticker: buffer,
            packname: 'Barboza',
            author: await conn.getName(m.sender)
        }, { quoted: m });

        await conn.sendMessage(m.chat, { react: { text: '✅', key: m.key } });

    } catch (err) {
        console.error('[ERROR EN /brat]', err);

        const msgError = err.message.includes('timeout')
            ? TEXTS.errorTimeout
            : TEXTS.errorGeneric;

        await conn.sendMessage(m.chat, { react: { text: '❌', key: m.key } });

        await conn.reply(m.chat,
            `${msgError}\n\n${TEXTS.errorTip