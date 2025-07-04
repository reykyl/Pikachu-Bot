let handler = async (m, { conn }) => {
  const jid = m.chat;

  try {
    await conn.sendMessage(jid, {
      productMessage: {
        product: {
          productImage: { url: 'https://files.catbox.moe/b0woxx.jpg' }, // Imagen visible en catálogo
          title: 'Xeon Bot Incorporado',
          description: 'Hola, soy Pikach Bot',
          currencyCode: 'USD',
          priceAmount1000: 12000, // $12.00
          retailerId: 'Pikachu-bot',
          productImageCount: 1
        },
        businessOwnerJid: '50433191934@s.whatsapp.net',
        productId: '24502048122733040'
      }
    });
  } catch (e) {
    console.error('❌ Error al enviar el producto:', e);
    m.reply('❌ No se pudo enviar el producto. Asegúrate de estar usando una cuenta *WhatsApp Business* y que el *productId* esté activo.');
  }
};

handler.help = ['comprar'];
handler.command = ['comprar'];
handler.tags = ['ventas'];
handler.register = true;

export default handler;