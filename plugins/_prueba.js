

/*let handler = async (m, { conn }) => {
  const jid = m.chat;

  try {
    const productMessage = {
      product: {
        productImage: {
          url: 'https://files.catbox.moe/b0woxx.jpg'
        },
        title: "Pikachu-bot - Development by Deylin ",
        description: " Alquila o compra Pikachu Bot para tus grupos.",
        currencyCode: "USD",
        priceAmount1000: 5000, // 5.00 USD
       // retailerId: "1466", // Tu ID de negocio
        productId: "24502048122733040", 
        productImageCount: 1,
      },
      businessOwnerJid: "50433191934@s.whatsapp.net" 
    };

    await conn.sendMessage(jid, productMessage, { messageType: 'product' });
  } catch (error) {
    console.error('Error enviando catálogo:', error);
    conn.reply(jid, '❌ No se pudo enviar el catálogo. Verifica que el productId y el número Business sean correctos.', m);
  }
};

handler.help = ['comprar', 'producto', 'compra'];
handler.command = ['comprar', 'producto', 'compra'];
handler.tags = ['ventas'];
handler.register = true;

export default handler;
*/


let handler = async (m, { conn }) => {
  const canal = '120363229276610692@newsletter'; // Reemplaza por tu canal real

  try {
    await conn.sendMessage(canal, {
      image: { url: 'https://files.catbox.moe/b0woxx.jpg' },
      caption: `🛒 *Pikachu-bot - By Deylin*\n\nAlquila o compra Pikachu Bot para tus grupos por solo *$5.00 USD*.

📦 Ver producto: https://wa.me/p/24502048122733040/50433191934`,
    });

    // Opcional: también enviar en el chat actual
    await conn.sendMessage(m.chat, {
      text: '✅ El anuncio fue enviado al canal correctamente.',
    });
  } catch (e) {
    console.error('Error enviando al canal:', e);
    conn.reply(m.chat, '❌ No se pudo enviar el anuncio al canal.', m);
  }
};

handler.help = ['publicarbot'];
handler.command = ['publicarbot'];
handler.tags = ['ventas'];
handler.register = true;

export default handler;