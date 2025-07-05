// © Comando creado por Deylin - https://github.com/Deylin-Eliac

import fetch from 'node-fetch';
import axios from 'axios';

const APIKEY = "Sylphiette's";

let handler = async (m, { conn, args, text }) => {
  let query = text || m.quoted?.text;

  if (!query) return m.reply('*✳️ Escribe o responde un mensaje con el nombre del pack de stickers*\n\nEj: .stickerly gatos');

  try {
    m.reply(`🔍 Buscando stickers para: *${query}*...`);

    const res = await fetch(`https://api.sylphy.xyz/stickerly/search?q=${encodeURIComponent(query)}&apikey=${APIKEY}`);
    const json = await res.json();

    if (!json.status || !json.result || json.result.length === 0)
      return m.reply('❌ No se encontraron packs de stickers.');

    const pack = json.result[0]; // Primer resultado
    const packUrl = pack.url;

    const res2 = await fetch(`https://api.sylphy.xyz/stickerly/download?url=${encodeURIComponent(packUrl)}&apikey=${APIKEY}`);
    const json2 = await res2.json();

    if (!json2.status || !json2.result || json2.result.length === 0)
      return m.reply('❌ No se pudieron obtener los stickers del pack.');

    const stickers = json2.result.slice(0, 10); // Máximo 10
    const stickerBuffers = [];

    for (let i = 0; i < stickers.length; i++) {
      const url = stickers[i];
      const { data } = await axios.get(url, { responseType: 'arraybuffer' });
      stickerBuffers.push({ sticker: data });
    }

    await conn.sendMessage(m.chat, stickerBuffers, { quoted: m });

  } catch (e) {
    console.error(e);
    m.reply('⚠️ Ocurrió un error al obtener los stickers.');
  }
};

handler.help = ['stickerly <texto>'];
handler.tags = ['sticker'];
handler.command = /^stickerly$/i;

export default handler;