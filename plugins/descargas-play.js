import fetch from "node-fetch";
import yts from "yt-search";
import axios from "axios";
import iconv from "iconv-lite";

const formatAudio = ["mp3", "m4a", "webm", "acc", "flac", "opus", "ogg", "wav"];
const formatVideo = ["360", "480", "720", "1080", "1440", "4k"];

const ddownr = {
  download: async (url, format) => {
    if (!formatAudio.includes(format) && !formatVideo.includes(format)) {
      throw new Error("⚠️ Pika Pika~ Ese formato no es compatible.");
    }

    const res = await axios.get(`https://p.oceansaver.in/ajax/download.php?format=${format}&url=${encodeURIComponent(url)}&api=dfcb6d76f2f6a9894gjkege8a4ab232222`, {
      headers: { "User-Agent": "Mozilla/5.0" },
      responseType: "arraybuffer",
    });

    const json = JSON.parse(iconv.decode(res.data, "utf-8"));
    if (!json?.success) throw new Error("⛔ Pikachu no pudo encontrar los detalles del video.");

    const downloadUrl = await ddownr.cekProgress(json.id);
    return { id: json.id, title: json.title, image: json.info.image, downloadUrl };
  },

  cekProgress: async (id) => {
    const url = `https://p.oceansaver.in/ajax/progress.php?id=${id}`;
    for (let i = 0; i < 6; i++) {
      const res = await axios.get(url, {
        headers: { "User-Agent": "Mozilla/5.0" },
        responseType: "arraybuffer",
      });

      const json = JSON.parse(iconv.decode(res.data, "utf-8"));
      if (json?.success && json.progress === 1000) return json.download_url;

      await new Promise(res => setTimeout(res, 800));
    }
    throw new Error("❌ Pikachu se cansó de esperar el enlace de descarga.");
  }
};

const handler = async (m, { conn, text, usedPrefix, command }) => {
  await m.react('⚡️');
  if (!text.trim()) return conn.reply("*Ｏ(≧∇≦)Ｏ🧃* *Pikachu-Bot* | Dime el nombre de la canción que estás buscando, ¡Pika!", m, rcanal);

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

    if (["play2", "ytv", "ytmp4"].includes(command)) {
      const sources = [
        `https://api.siputzx.my.id/api/d/ytmp4?url=${url}`,
        `https://api.zenkey.my.id/api/download/ytmp4?apikey=zenkey&url=${url}`,
        `https://axeel.my.id/api/download/video?url=${encodeURIComponent(url)}`,
        `https://delirius-apiofc.vercel.app/download/ytmp4?url=${url}`
      ];

      const getValidVideo = async () => {
        const fetchWithTimeout = async (src, timeout = 5000) =>
          Promise.race([
            fetch(src).then(res => (res.ok ? res.json() : null)),
            new Promise(resolve => setTimeout(() => resolve(null), timeout)),
          ]);

        for (const src of sources) {
          const json = await fetchWithTimeout(src);
          const dl = json?.data?.dl || json?.result?.download?.url || json?.downloads?.url || json?.data?.download?.url;
          if (dl) return dl;
        }
        throw new Error("❌ Pikachu no encontró enlaces de video válidos.");
      };

      const videoUrl = await getValidVideo();

      return conn.sendMessage(m.chat, {
        video: { url: videoUrl },
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
            renderLargerThumbnail: false,
          }
        }
      }, { quoted: m });
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