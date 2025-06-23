// editado y reestructurado por 
// https://github.com/deylin-eliac 

import fetch from "node-fetch";
import yts from "yt-search";
import axios from "axios";

const formatAudio = ["mp3", "m4a", "webm", "acc", "flac", "opus", "ogg", "wav"];
const formatVideo = ["360", "480", "720", "1080", "1440", "4k"];

const ddownr = {
  download: async (url, format) => {
    if (!formatAudio.includes(format) && !formatVideo.includes(format)) {
      throw new Error("⚠️ Pika Pika~ Ese formato no es compatible.");
    }

    try {
      const { data } = await axios.get(`https://p.oceansaver.in/ajax/download.php?format=${format}&url=${encodeURIComponent(url)}&api=dfcb6d76f2f6a9894gjkege8a4ab232222`, {
        headers: { "User-Agent": "Mozilla/5.0" }
      });

      if (data?.success) {
        const { id, title, info } = data;
        const downloadUrl = await ddownr.cekProgress(id);
        return { id, title, image: info.image, downloadUrl };
      }

      throw new Error("⛔ Pikachu no pudo encontrar los detalles del video.");
    } catch (error) {
      throw new Error("❌ Error al procesar la descarga.");
    }
  },

  cekProgress: async (id) => {
    const url = `https://p.oceansaver.in/ajax/progress.php?id=${id}`;
    const headers = { "User-Agent": "Mozilla/5.0" };

    for (let i = 0; i < 10; i++) {
      try {
        const { data } = await axios.get(url, { headers });
        if (data?.success && data.progress === 1000) return data.download_url;
      } catch { }
      await new Promise(res => setTimeout(res, 2000));
    }

    throw new Error("❌ Tiempo de espera agotado para obtener el enlace de descarga.");
  }
};

const handler = async (m, { conn, text, usedPrefix, command }) => {
  await m.react('⚡️');

  if (!text.trim()) {
    return conn.reply(m.chat, "*Ｏ(≧∇≦)Ｏ🧃* *Pikachu-Bot* | Dime el nombre de la canción que estás buscando, ¡Pika!", m, rcanal);
  }

  try {
    const { all } = await yts(text);
    if (!all.length) return m.reply("*(>_<)🧃* Pikachu no encontró nada con ese nombre...");

    const videoInfo = all[0];
    const { title, thumbnail, timestamp, views, ago, url } = videoInfo;
    const vistas = formatViews(views);
    const thumb = (await conn.getFile(thumbnail))?.data;

    const infoMessage = `⚡🐭 
              \`Pikachu-Bot - Descargas Pokémon\`
*🎵 Título:* ${title}
> 🎬 *Duración:* ${timestamp}
> 🎤 *Canal:* ${videoInfo.author?.name || "Desconocido"}
> 👀 *Vistas:* ${vistas}
> 📅 *Publicado:* ${ago}
> 🔗 *Enlace:* ${url}`;

    const JT = {
      contextInfo: {
        externalAdReply: {
          title: botname,
          body: "¡Pika Pikachu-bot! El bot eléctrico que necesitas.",
          mediaType: 1,
          previewType: 0,
          mediaUrl: url,
          sourceUrl: url,
          thumbnail: thumb,
          renderLargerThumbnail: true
        }
      }
    };

    await m.react('🎧');
    await conn.reply(m.chat, infoMessage, m, JT);

    if (["play", "yta", "ytmp3"].includes(command)) {
      const api = await ddownr.download(url, "mp3");

      const doc = {
        audio: { url: api.downloadUrl },
        mimetype: 'audio/mpeg',
        fileName: `${title}.mp3`,
        contextInfo: {
          externalAdReply: {
            showAdAttribution: true,
            title: packname,
            body: dev,
            mediaUrl: null,
            description: null,
            thumbnailUrl: icono,
            sourceUrl: redes,
            mediaType: 1,
            renderLargerThumbnail: false,
          }
        }
      };

      return await conn.sendMessage(m.chat, doc, { quoted: m });
    }

    if (["play2", "ytv", "ytmp4"].includes(command)) {
      const sources = [
        `https://api.siputzx.my.id/api/d/ytmp4?url=${url}`,
        `https://api.zenkey.my.id/api/download/ytmp4?apikey=zenkey&url=${url}`,
        `https://axeel.my.id/api/download/video?url=${encodeURIComponent(url)}`,
        `https://delirius-apiofc.vercel.app/download/ytmp4?url=${url}`
      ];

      const getSource = async (src) => {
        const res = await fetch(src);
        const json = await res.json();
        return json?.data?.dl || json?.result?.download?.url || json?.downloads?.url || json?.data?.download?.url;
      };

      try {
        const downloadUrl = await Promise.any(sources.map(src => getSource(src)));

        await conn.sendMessage(m.chat, {
          video: { url: downloadUrl },
          fileName: `${title}.mp4`,
          mimetype: "video/mp4",
          caption: "🎬 Aquí tienes tu video, descargado por *Pikachu-Bot MD* ⚡",
          thumbnail: thumb,
          contextInfo: {
            externalAdReply: {
              showAdAttribution: true,
              title: packname,
              body: dev,
              mediaUrl: null,
              description: null,
              previewType: "PHOTO",
              thumbnailUrl: icono,
              sourceUrl: redes,
              mediaType: 1,
              renderLargerThumbnail: false
            }
          }
        }, { quoted: m });
      } catch {
        return m.reply("❌ Pikachu no pudo encontrar un enlace válido para descargar.");
      }
    }

  } catch (error) {
    console.error("❌ Error:", error);
    return m.reply(`⚠️ Ocurrió un error eléctrico: ${error.message}`);
  }
};

handler.command = handler.help = ["play", "play2", "ytmp3", "yta", "ytmp4", "ytv"];
handler.tags = ["downloader"];

export default handler;

function formatViews(views) {
  if (typeof views !== "number" || isNaN(views)) return "Desconocido";
  return views >= 1000
    ? (views / 1000).toFixed(1) + "k (" + views.toLocaleString() + ")"
    : views.toString();
}