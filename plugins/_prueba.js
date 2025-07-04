let handler = async (m, { conn }) => {
  const jid = m.chat;

  try {
    const productMessage = {
      productMessage: {
        product: {
          productImage: {
            url: 'https://files.catbox.moe/b0woxx.jpg'
          },
          title: 'Pikachu-bot - Development by Deylin',
          description: 'Alquila o compra Pikachu Bot para tus grupos.',
          currencyCode: 'USD',
          priceAmount1000: 5000, // 5.00 USD (en milésimas)
          productImageCount: 1,
          productId: '24502048122733040' 
        },
        businessOwnerJid: '50433191934@s.whatsapp.net'
      }
    }

    await conn.sendMessage(jid, productMessage)
  } catch (error) {
    console.error('Error enviando catálogo:', error)
    conn.reply(jid, '❌ No se pudo enviar el catálogo. Verifica que tu número sea WhatsApp Business y que el productId sea válido.', m)
  }
}

handler.help = ['comprar', 'producto', 'compra']
handler.command = ['comprar', 'producto', 'compra', 'buys']
handler.tags = ['ventas']
handler.register = true

export default handler