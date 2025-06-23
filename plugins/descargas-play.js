import yts from "yt-search";
import fetch from "node-fetch";

const handler = async (m, { conn, text, command }) => {
  await m.react("⚡️");

  if (!text) {
    return conn.reply(
      m.chat,
      "*Ｏ(≧∇≦)Ｏ🧃* *Pikachu-Bot* | Dime el nombre de la canción que estás buscando, ¡Pika!",
      m,
      rcanal
    );
  }

  try {
    const search = await yts(text);
    const vid = search.all[0];
    if (!vid) return m.reply("*(>_<)🧃* Pikachu no encontró nada con ese nombre...");

    const { title, url, timestamp, ago, author, thumbnail, views } = vid;

    const vistas = formatViews(views);

    const info = `⚡🐭 
              \`Pikachu-Bot - Descargas Pokémon\`
*🎵 Título:* ${title}
> 🎬 *Duración:* ${timestamp}
> 🎤 *Canal:* ${author?.name || "Desconocido"}
> 👀 *Vistas:* ${vistas}
> 📅 *Publicado:* ${ago}
> 🔗 *Enlace:* ${url}`;

    const preview = {
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

    await m.react("🎧");
    await conn.reply(m.chat, info, m, preview);

    const res = await fetch(`https://api.zenzapis.xyz/downloader/yta?url=${url}&apikey=zenzkey1`);
    const json = await res.json();

    if (!json.status) throw new Error("⚡ Pikachu falló en la descarga...");

    const audio = json.result.url;

    await conn.sendMessage(m.chat, {
      audio: { url: audio },
      mimetype: "audio/mpeg",
      fileName: `${title}.mp3`,
      contextInfo: {
        externalAdReply: {
          showAdAttribution: true,
          title: packname,
          body: dev,
          thumbnailUrl: icono,
          sourceUrl: redes,
          mediaType: 1,
          renderLargerThumbnail: false
        }
      }
    }, { quoted: m });

  } catch (e) {
    console.error("❌ Error:", e);
    return m.reply(`⚠️ Ocurrió un error eléctrico: ${e.message}`);
  }
};

handler.command = ["play"];
handler.help = ["play"];
handler.tags = ["downloader"];
export default handler;

function formatViews(views) {
  if (typeof views !== "number" || isNaN(views)) return "Desconocido";
  return views >= 1000
    ? (views / 1000).toFixed(1) + "k (" + views.toLocaleString() + ")"
    : views.toString();
}