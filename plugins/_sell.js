let handler = async (m, { conn }) => {
  const jid = m.chat;

  try {
    const productMessage = {
      product: {
        productImage: {
          url: icono
        },
        title: "Pikachu-bot - Development by Deylin ",
        description: " Alquila o compra Pikachu Bot para tus grupos.",
        currencyCode: "USD",
        priceAmount1000: 5000, // 5.00 USD
        retailerId: "1466", 
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

handler.help = ['producto', 'compra'];
handler.command = ['producto', 'compra', 'buy'];
handler.tags = ['ventas'];
handler.register = true;

export default handler;
