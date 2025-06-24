
const handler = async (m, { conn}) => {
  const codigo = `/* Código creado por Deylin...\nhttps://github.com/deylin-eliac */`;

  const sections = [
    {
      title: "Copia este código",
      rows: [
        { title: "📋 Copiar Código", description: "Toca aquí para copiar manualmente", rowId: `.copiarcodigo`}
      ]
}
  ];

  const listMessage = {
    text: "Presiona para ver el código que puedes copiar:",
    footer: "by Deylin-eliac",
    title: "🧾 Copiar código al portapapeles",
    buttonText: "Ver código",
    sections
};

  await conn.sendMessage(m.chat, listMessage, { quoted: m});
};

handler.command = /^copiarcodigo$/i;

