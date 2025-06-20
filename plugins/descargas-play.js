// editado y reestructurado por 
// https://github.com/deylin-eliac 

import yts from "yt-search";
import fetch from "node-fetch";

const handler = async (m, { conn, text, usedPrefix, command }) => {
  await m.react("⚡️");

  if (!text.trim()) {
    return conn.reply(m.chat, "*Ｏ(≧∇≦)Ｏ🧃* *Pikachu-Bot* | Dime el nombre de la canción que estás buscando, ¡Pika!", m);
  }

  try {
    const search = await yts(text);
    if (!search.all.length) {
      return m.reply("*(>_<)🧃* Pikachu no encontró nada con ese nombre...");
    }

    const video = search.videos[0];
    const { title, timestamp, views, ago, url, thumbnail, author } = video;
    const vistas = formatViews(views);
    const thumb = (await conn.getFile(thumbnail))?.data;

    const info = `⚡🐭 
\`Pikachu-Bot - Descargas Pokémon\`
*🎵 Título:* ${title}
> 🎬 *Duración:* ${timestamp}
> 👀 *Vistas:* ${vistas}
> 🎤 *Canal:* ${author?.name || "Desconocido"}
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

    await m.react("🎧");
    await conn.reply(m.chat, info, m, JT);

    const isAudio = ["play", "yta", "ytmp3"].includes(command);
    const isVideo = ["play2", "ytv", "ytmp4"].includes(command);
    const apiUrl = isAudio
      ? `https://mode-api-sigma.vercel.app/api/mp3?url=${encodeURIComponent(url)}`
      : isVideo
      ? `https://mode-api-sigma.vercel.app/api/index?url=${encodeURIComponent(url)}`
      : null;

    if (!apiUrl) return;

    const res = await fetch(apiUrl);
    const json = await res.json();
    const dl = json?.url || json?.result?.url;

    if (!dl) {
      return m.reply("❌ Pikachu no pudo encontrar el enlace de descarga.");
    }

    if (isAudio) {
      return conn.sendMessage(m.chat, {
        audio: { url: dl },
        mimetype: "audio/mpeg",
        fileName: `${title}.mp3`,
        contextInfo: {
          externalAdReply: {
            title: packname,
            body: dev,
            sourceUrl: redes,
            thumbnailUrl: icono,
            mediaType: 1,
            showAdAttribution: true,
            renderLargerThumbnail: false
          }
        }
      }, { quoted: m });
    }

    if (isVideo) {
      return conn.sendMessage(m.chat, {
        video: { url: dl },
        mimetype: "video/mp4",
        fileName: `${title}.mp4`,
        caption: "🎬 Aquí tienes tu video, descargado por *Pikachu-Bot MD* ⚡",
        thumbnail: thumb,
        contextInfo: {
          externalAdReply: {
            title: packname,
            body: dev,
            sourceUrl: redes,
            thumbnailUrl: icono,
            mediaType: 1,
            previewType: "PHOTO",
            showAdAttribution: true,
            renderLargerThumbnail: false
          }
        }
      }, { quoted: m });
    }

  } catch (e) {
    console.error("❌ Error:", e);
    m.reply(`⚠️ Ocurrió un error eléctrico: ${e.message}`);
  }
};

handler.command = handler.help = ["play", "play2", "ytmp3", "yta", "ytmp4", "ytv"];
handler.tags = ["downloader"];

export default handler;

function formatViews(views) {
  if (typeof views !== "number") return "Desconocido";
  return views >= 1000
    ? (views / 1000).toFixed(1) + "k (" + views.toLocaleString() + ")"
    : views.toString();
}