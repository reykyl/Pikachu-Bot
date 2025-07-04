let handler = async (m, { conn }) => {
  const jid = m.chat;

  const productMessage = {
    product: {
      productImage: {
        url: 'https://files.catbox.moe/b0woxx.jpg'
      },
      title: 'Xeon Bot Incorporado',
      description: 'Hola, soy Pikach Bot',
      currencyCode: 'USD',
      priceAmount1000: 12000,
      retailerId: 'Pikachu-bot',
      productImageCount: 1
    },
    businessOwnerJid: '50433191934@s.whatsapp.net'
    // ← sin productId para test
  };

  try {
    await conn.sendMessage(jid, { productMessage });
  } catch (e) {
    console.error('❌ Error al enviar el mensaje de producto:', e);
    m.reply('❌ No se pudo enviar el mensaje de producto. Verifica que tu número sea WhatsApp Business y que el productId sea válido.');
  }
};

handler.help = ['comprar', 'producto'];
handler.command = ['comprar', 'producto'];
handler.tags = ['ventas'];
handler.register = true;

export default handler;