

let handler = async (m, { conn }) => {
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
        priceAmount1000: 19990, // 19.99 USD (multiplica por 1000)
        retailerId: "1466", // Tu ID de negocio
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

handler.help = ['comprar'];
handler.command = ['comprar'];
handler.tags = ['ventas'];
handler.register = true;

export default handler;