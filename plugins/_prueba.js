import fetch from 'node-fetch';
import fs from 'fs';
import { Sticker } from 'wa-sticker-formatter';

let handler = async (m, { conn, args, usedPrefix, command }) => {
  const texto = args.join(' ');
  if (!texto) return m.reply(`🔍 Escribe un término para buscar stickers.\n\nEjemplo:\n${usedPrefix + command} gato`);

  
  const apikey = 'Sylphiette\'s';
  const res = await fetch(`https://api.sylphy.xyz/stickerly/search?q=${encodeURIComponent(texto)}&apikey=${apikey}`);
  const data = await res.json();

  if (!data || data.length === 0) return m.reply('❌ No se encontraron stickers.');

  
  const resultados = data.slice(0, 10);
  const stickers = [];

  for (const pack of resultados) {
    try {
      
      const stickerBuffer = await fetch(pack.thumbnail).then(res => res.buffer());
      
      
      const sticker = new Sticker(stickerBuffer, {
        pack: pack.name,
        author: pack.author,
        type: 'default',
        categories: ['🌟'],
        id: `stickerly-${Math.random().toString(36).slice(2)}`,
      });
      const buffer = await sticker.toBuffer();

      
      stickers.push({ sticker: buffer });
    } catch (e) {
      console.log(`Error en ${pack.name}:`, e);
    }
  }

  if (stickers.length === 0) return m.reply('⚠️ No se pudieron generar los stickers.');

  
  await conn.sendMessage(m.chat, {
    sticker: stickers.map(s => s.sticker)
  }, { quoted: m });
};

handler.help = ['stickerly <texto>'];
handler.tags = ['sticker'];
handler.command = /^stickerly$/i;

export default handler;