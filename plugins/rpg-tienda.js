let handler = async (m, { command }) => {
  const menu = `
🛒 *TIENDA POKÉMON*

Puedes comprar objetos con *.comprar [item] [cantidad]*

🎁 Artículos disponibles:
- 🧴 *pocion* – Recupera 10% de vida – 💰 20 monedas
- 🍎 *comida* – (futuro uso) – 💰 15 monedas
- 💊 *revivir* – Revive a tu Pokémon (futuro) – 💰 50 monedas

💰 Escribe: *.comprar pocion 2*
  `.trim()
  m.reply(menu)
}

handler.help = ['tienda']
handler.tags = ['juegos']
handler.command = ['tienda']
handler.register = true

export default handler