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
      priceAmount1000: 12000, // $12.00
      retailerId: 'Pikachu-bot',
      productImageCount: 1
    },
    businessOwnerJid: '50433191934@s.whatsapp.net',
    productId: '24502048122733040' // 👈 Este es el ID del producto real de tu catálogo
  }

  await conn.sendMessage(jid, { productMessage });
};

handler.help = ['comprar', 'producto'];
handler.command = ['comprar', 'producto'];
handler.tags = ['ventas'];
handler.register = true;

export default handler;