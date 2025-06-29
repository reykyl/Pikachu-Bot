let handler = async (m, { conn }) => {
  const textoCopia = '🔒 Este es tu código de verificación: *123456*';
  const footer = 'Presiona el botón para copiar el código';

  await conn.sendButton2(
    m.chat,
    textoCopia,
    [], // no imagen o URL
    footer,
    [
      ['📋 Copiar', 'Copiar'] // Esto solo manda "Copiar" al chat cuando se pulsa
    ],
    null,
    m
  );
};

handler.command = ['cop'];
export default handler;