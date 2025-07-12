let handler = async (m, { conn }) => {
  const jid = m.chat;

  try {
    
    await conn.reply(jid, `⚡🐭 *¡Hola, humano! Soy Pikachu-Bot* ⚡\n\nActualmente soy un bot privado y no tengo subbots activos.\n\n¡Pero puedes tenerme en tu grupo o proyecto! 🤖✨\n\nRevisa mi catálogo oficial a continuación para más información sobre cómo alquilar mis servicios.`, m);

    
    await conn.sendMessage(jid, {
      product: {
        productImage: {
          url: icono
        },
        title: "⚡ Pikachu-Bot - Desarrollado por Deylin",
        description: "🤖 Alquila o compra Pikachu-Bot para tus grupos. Incluye funciones avanzadas, sistema estable y soporte técnico personalizado.",
        currencyCode: "USD",
        priceAmount1000: 5000, // 5.00 USD
        retailerId: "pikachu-bot",
        productId: "24502048122733040",
        productImageCount: 1
      },
      businessOwnerJid: "50433191934@s.whatsapp.net"
    }, { messageType: 'product' });

  } catch (error) {
    console.error('Error enviando catálogo:', error);
    conn.reply(jid, '❌ No se pudo enviar el catálogo. Verifica que el productId y el número Business sean correctos.', m);
  }
};


handler.command = ['serbot', 'qr', 'code'];
handler.register = true;

export default handler;