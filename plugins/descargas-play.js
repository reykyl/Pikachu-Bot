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

    const { data } = await axios.get(`https://p.oceansaver.in/ajax/download.php?format=${format}&url=${encodeURIComponent(url)}&api=dfcb6d76f2f6a9894gjkege8a4ab232222`, {
      headers: { "User-Agent": "Mozilla/5.0" },
      responseType: 'json'
    });

    if (!data?.success) throw new Error("⛔ Pikachu no pudo encontrar los detalles del video.");
    const downloadUrl = await ddownr.cekProgress(data.id);
    return { id: data.id, title: data.title, image: data.info.image, downloadUrl };
  },

  cekProgress: async (id) => {
    const url = `https://p.oceansaver.in/ajax/progress.php?id=${id}`;
    for (let i = 0; i < 6; i++) {
      const { data } = await axios.get(url, {
        headers: { "User-Agent": "Mozilla/5.0" },
        responseType: 'json'
      });
      if (data?.success && data.progress === 1000) return data.download_url;
      await new Promise(res => setTimeout(res, 800));
    }
    throw new Error("❌ Pikachu se cansó de esperar el enlace de descarga.");
  }
};

const handler = async (m, { conn, text, usedPrefix, command }) => {
  await m.react('⚡️');
  if (!text.trim()) return conn.reply(m.chat, "*Ｏ(≧∇≦)Ｏ🧃* *Pikachu-Bot* | Dime el nombre de la canción que estás buscando, ¡Pika!", m, rcanal);

  try {
    const search = await yts(text);
    if (!search.all.length) return m.reply("*(>_<)🧃* Pikachu no encontró nada con ese nombre...");

    const vid = search.all[0];
    const { title, url, views, ago, timestamp, thumbnail } = vid;
    const vistas = formatViews(views);

    const info = `⚡🐭 
              \`Pikachu-Bot - Descargas Pokémon\`
*🎵 Título:* ${title}
> 🎬 *Duración:* ${timestamp}
> 🎤 *Canal:* ${vid.author?.name || "Desconocido"}
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
          thumbnail: thumbnail,
          renderLargerThumbnail: true
        }
      }
    };

    await m.react('🎧');
    await conn.reply(m.chat, info, m, JT);

    // Audio (play/yta/ytmp3)
    if (["play", "yta", "ytmp3"].includes(command)) {
      const api = await ddownr.download(url, "mp3");

      return conn.sendFile(m.chat, api.downloadUrl, `${title}.mp3`, null, m, false, {
        mimetype: 'audio/mpeg',
        fileName: `${title}.mp3`,
        contextInfo: {
          externalAdReply: {
            showAdAttribution: true,
            title: packname,
            body: dev,
            thumbnailUrl: icono,
            sourceUrl: redes,
            mediaType: 1,
            renderLargerThumbnail: false,
          }
        }
      });
    }

    // Video (play2/ytv/ytmp4)
    if (["play2", "ytv", "ytmp4"].includes(command)) {
      const sources = [
        `https://api.siputzx.my.id/api/d/ytmp4?url=${url}`,
        `https://api.zenkey.my.id/api/download/ytmp4?apikey=zenkey&url=${url}`,
        `https://axeel.my.id/api/download/video?url=${encodeURIComponent(url)}`,
        `https://delirius-apiofc.vercel.app/download/ytmp4?url=${url}`
      ];

      const getValidVideo = async () => {
        const results = sources.map(async (src) => {
          const res = await fetch(src);
          const json = await res.json();
          return json?.data?.dl || json?.result?.download?.url || json?.downloads?.url || json?.data?.download?.url;
        });
        return await Promise.any(results);
      };

      try {
        const downloadUrl = await getValidVideo();

        return conn.sendMessage(m.chat, {
          video: { url: downloadUrl },
          fileName: `${title}.mp4`,
          mimetype: "video/mp4",
          caption: "🎬 Aquí tienes tu video, descargado por *Pikachu-Bot MD* ⚡",
          thumbnail: await (await conn.getFile(thumbnail)).data,
          contextInfo: {
            externalAdReply: { 
              showAdAttribution: true, 
              title: packname, 
              body: dev, 
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