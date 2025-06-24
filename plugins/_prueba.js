const buttons = [
  {buttonId: 'id1', buttonText: {displayText: 'Haz clic para copiar'}, type: 1}
];

const buttonMessage = {
    text: "Aquí está tu código:",
    footer: 'Presiona el botón para copiar',
    buttons: buttons,
    headerType: 1
}

await conn.sendMessage(m.chat, buttonMessage);
};

handler.command = ['h'];
export default handler;