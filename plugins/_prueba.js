// handler para comando .vincular
let handler = async (m, { conn, command, usedPrefix }) => {
  const secret = generarCodigo() // función que genera el código, por ejemplo: GAOK-IG36
  const texto = `🔐 *Tu código de vinculación es:*`;
  const footer = `📡 Usa este código para vincular tu sub-bot`;
  //const image = 'https://i.imgur.com/AaJzNHz.jpeg'; // Puedes poner cualquier imagen
  const buttons = [
    { buttonId: `${usedPrefix}menu`, buttonText: { displayText: "📜 Menú" }, type: 1 },
    { buttonId: `${usedPrefix}info`, buttonText: { displayText: "ℹ️ Información" }, type: 1 }
  ];
  const copyText = `${secret}`; // Texto final que aparece como si fuera 'copiable'

  await conn.sendButton2(m.chat, texto, footer, buttons, copyText, null, m);
};

// Generador de código aleatorio
function generarCodigo() {
  const letras = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  const numeros = '0123456789';
  const parte1 = Array(4).fill().map(() => letras[Math.floor(Math.random() * letras.length)]).join('');
  const parte2 = Array(4).fill().map(() => numeros[Math.floor(Math.random() * numeros.length)]).join('');
  return `${parte1}-${parte2}`;
}

handler.command = /^vincular$/i;

export default handler;