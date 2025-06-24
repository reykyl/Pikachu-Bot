const handler = async (m, { conn }) => {
  const sections = [
    {
      title: 'Opciones disponibles',
      rows: [
        {
          title: '📋 Copiar código',
          description: 'Toca aquí para ver el código listo para copiar',
          rowId: '.copiarcodigo'
        }
      ]
    }
  ];

  const listMessage = {
    text: 'Selecciona una opción del menú:',
    footer: 'by Deylin-eliac',
    title: '🎁 Código exclusivo disponible',
    buttonText: 'Ver opciones',
    sections
  };

  await conn.sendMessage(m.chat, listMessage, { quoted: m });
};

handler.command = ['codigo'];
export default handler;