/*
const handler = async (m, { conn }) => {
  const buttons = [
    { buttonId: '.owner', buttonText: { displayText: '👑 creador' }, type: 1 },
    buttons: [
  { buttonId: '.menu', buttonText: { displayText: '📋 Menú' }, type: 1 },
]
  ];

  const buttonMessage = {
    text: '✨ *Prueba del botsito* ✨',
    footer: '⚡ ¡Pikachu-Bot en acción!',
    buttons: buttons,
    headerType: 1
  };

  await conn.sendMessage(m.chat, buttonMessage, { quoted: m });
};

handler.help = ['m'];
handler.tags = ['tools'];
handler.command = ['m'];

export default handler;
*/


const handler = async (m, conn) => {
    const jid = m.chat;

    const imageUrl = 'https://files.catbox.moe/b0woxx.jpg'; // Reemplaza con la URL de tu imagen
    const productName = "Xeon Bot Incorporado";
    const productDescription = "¡Estoy legalmente equivocado, pero éticamente correcto! Presentamos a un chico de ensueño llamado _carlos_";
    const productPrice = "$12.00";
    const buttonText = "Ver Detalles";
    const buttonId = "VER_DETALLES_XEON_BOT";

    const message = {
        image: { url: imageUrl },
        caption: `*${productName}*\n\n${productDescription}\n\n*Precio: ${productPrice}*\n\nPara más información, presiona "Ver Detalles".`,
        buttons: [
            {
                buttonId: buttonId,
                buttonText: { displayText: buttonText },
                type: 1
            }
        ],
        headerType: 4
    };

    try {
        await conn.sendMessage(jid, message);
    } catch (error) {
        conn.sendMessage(jid, { text: 'Lo siento, no pude enviar la información del producto en este momento. Intenta de nuevo más tarde.' });
    }
};

handler.help = ['comprar', 'buy'];
handler.command = ['comprar', 'bu'];
handler.tags = ['ventas', 'productos'];
handler.register = true;
handler.limit = false;

export default handler