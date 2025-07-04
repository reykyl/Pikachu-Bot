
/*
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
        priceAmount1000: 5000, // 5.00 USD
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
*/



import makeWASocket from '@whiskeysockets/baileys'

async function listarProductos(conn, jid) {
  const businessJid = "50433191934@s.whatsapp.net"; // cambia a tu número Business JID
  try {
    // Obtiene la info del perfil comercial, incluye catálogo si está disponible
    const products = await conn.getBusinessProfile?.(businessJid);

    if (products && products.products && products.products.length) {
      let lista = '*Productos en el catálogo:*\n\n';
      for (let p of products.products) {
        lista += `• *Nombre:* ${p.title}\n`;
        lista += `  *productId:* ${p.productId}\n\n`;
      }
      await conn.sendMessage(jid, { text: lista });
    } else {
      await conn.sendMessage(jid, { text: 'No hay productos en el catálogo o no se pudo obtener.' });
    }
  } catch (e) {
    console.error("Error al obtener productos:", e);
    await conn.sendMessage(jid, { text: '❌ Error al obtener productos del catálogo.' });
  }
}

let handler = async (m, { conn }) => {
  await listarProductos(conn, m.chat);
};

handler.help = ['listarproductos'];
handler.command = ['listarproductos'];
handler.tags = ['ventas'];
handler.register = true;

export default handler;