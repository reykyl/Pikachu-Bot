

let handler = async (m, { conn }) => {
  const jid = m.chat;

  try {
    const productMessage = {
      product: {
        productImage: {
          url: 'https://example.com/image.jpg' // Pon aquí la URL pública de la imagen de tu producto
        },
        title: "Producto Ejemplo",
        description: "Descripción breve del producto",
        currencyCode: "USD",
        priceAmount1000: 19990, // 19.99 USD (multiplica por 1000)
        retailerId: "1234567890", // Tu ID de negocio
        productId: "1234567890123456", // El productId real de tu catálogo WhatsApp Business
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