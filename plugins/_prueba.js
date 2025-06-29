let handler = async (m, { conn }) => {
  const textoCopia = '🔒 Este es tu código de verificación: *123456*';
  const footer = 'Presiona el botón para copiar el código';

  const buttons = [
    ['📋 Copiar código', '123456'] // Esto enviará "123456" cuando el usuario toque el botón
  ];

  await conn.sendButton(m.chat, textoCopia, footer, buttons, m);
};

handler.command = ['cop'];
export default handler;