const handler = async (m, { conn }) => {
  const sections = [
    {
      title: "Copia este código",
      rows: [
        {
          title: "📋 Copiar Código",
          description: "Toca aquí para ver y copiar el código",
          rowId: ".copiarcodigo"
        }
      ]
    }
  ];

  const listMessage = {
    text: "Presiona el botón para ver el código que puedes copiar:",
    footer: "by Deylin-eliac",
    title: "🧾 Copiar código al portapapeles",
    buttonText: "Ver código",
    sections
  };

  await conn.sendMessage(m.chat, listMessage, { quoted: m });
};

handler.command = ['h'];
export default handler;