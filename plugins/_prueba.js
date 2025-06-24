import axios from 'axios';

let handler = async (m, { text }) => {
  // Puedes permitir que el usuario escriba el código a copiar (opcional)
  const codigo = text || 'DESC20';
  const nombre = 'Deylin'; // Aquí puedes usar m.sender o personalizarlo

  try {
    const res = await axios.post('https://graph.facebook.com/v19.0/YOUR_PHONE_NUMBER_ID/messages', {
      messaging_product: 'whatsapp',
      to: m.sender.split('@')[0], // Número destino (usuario que usó el comando)
      type: 'template',
      template: {
        name: 'promocion_codigo',
        language: { code: 'es_MX' },
        components: [
          {
            type: 'body',
            parameters: [
              { type: 'text', text: nombre },
              { type: 'text', text: codigo }
            ]
          },
          {
            type: 'button',
            sub_type: 'copy_code',
            index: 0,
            parameters: [
              {
                type: 'coupon_code',
                coupon_code: codigo
              }
            ]
          }
        ]
      }
    }, {
      headers: {
        Authorization: `Bearer YOUR_WHATSAPP_TOKEN`,
        'Content-Type': 'application/json'
      }
    });

    m.reply('✅ Código enviado con botón de copiar al WhatsApp del usuario.');
  } catch (e) {
    console.error(e.response?.data || e.message);
    m.reply('❌ Error al enviar el mensaje con la API de WhatsApp.');
  }
};

handler.command = ['copiarcodigo'];
export default handler;