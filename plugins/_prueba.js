// © Comando creado por Deylin - https://github.com/Deylin-Eliac

import fetch from 'node-fetch';
import { downloadContentFromMessage } from '@whiskeysockets/baileys';
import { writeFileSync } from 'fs';
import { tmpdir } from 'os';
import path from 'path';
import axios from 'axios';

const APIKEY = "Sylphiette's";

let handler = async (m, { conn, args, text }) => {
  if (!text) throw '*✳️ Ingresa el nombre del pack que deseas buscar*\n\nEj: .stickerly gatos';

  const res = await fetch(`https://api.sylphy.xyz/stickerly/search?q=${encodeURIComponent(text)}&apikey=${APIKEY}`);
  const json = await res.json();

  if (!json.status || !json.result || json.result.length === 0) {
    throw '❌ No se encontraron packs de stickers.';
  }

  const pack = json.result[0]; // El primer resultado
  const packUrl = pack.url;

  const packData = await fetch(`https://api.sylphy.xyz/stickerly/download?url=${encodeURIComponent(packUrl)}&apikey=${APIKEY}`);
  const stickerJson = await packData.json();

  if (!stickerJson.status || !stickerJson.result || stickerJson.result.length === 0) {
    throw '❌ No se pudieron obtener los stickers del pack.';
  }

  const stickers = stickerJson.result.slice(0, 10); // Máximo 10
  const stickerBuffers = [];

  for (let i = 0; i < stickers.length; i++) {
    const url = stickers[i];
    const res = await axios.get(url, { responseType: 'arraybuffer' });
    stickerBuffers.push({ sticker: res.data });
  }

  await conn.sendMessage(m.chat, stickerBuffers, { 
    quoted: m 
  });
};

handler.help = ['stickerly <texto>'];
handler.tags = ['sticker'];
handler.command = /^stickerly$/i;

export default handler;