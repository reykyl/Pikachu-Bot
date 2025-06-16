import fetch from 'node-fetch';

const API_MAIN = 'https://api.siputzx.my.id/api/m/brat';
const TIMEOUT = 10000; // 10 segundos

const fetchWithTimeout = async (url, timeout = TIMEOUT) => {
    return Promise.race([
        fetch(url),
        new Promise((_, reject) => setTimeout(() => reject(new Error('Tiempo de espera agotado 🕒')), timeout))
    ]);
};

const handler = async (m, { conn, args, usedPrefix, command }) => {
    const pikaReact = (emoji) => conn.sendMessage(m.chat, { react: { text: emoji, key: m.key } });
    const pikaReply = (text) => conn.reply(m.chat, text, m);

    const texto = args.join(" ").trim();
    if (!texto) {
        return pikaReply(`> ⚡