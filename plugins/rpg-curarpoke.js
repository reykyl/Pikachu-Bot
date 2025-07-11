import fs from 'fs'

const usuariosPath = './src/database/usuarios.json'

function cargarJSON(ruta, valorDefault = {}) {
  try {
    if (!fs.existsSync(ruta)) fs.writeFileSync(ruta, JSON.stringify(valorDefault, null, 2))
    const data = fs.readFileSync(ruta, 'utf-8').trim()
    return data ? JSON.parse(data) : valorDefault
  } catch (e) {
    return valorDefault
  }
}

function guardarJSON(ruta, data) {
  fs.writeFileSync(ruta, JSON.stringify(data, null, 2))
}

let handler = async (m, { conn }) => {
  const userId = m.sender.replace(/[^0-9]/g, '')
  const usuarios = cargarJSON(usuariosPath)
  const user = usuarios[userId]

  if (!user || !user.pokemon) {
    return m.reply('😢 No tienes un Pokémon para curar. Usa *.atrapar* primero.')
  }

  user.pokemon.vida = user.pokemon.vidaMax
  guardarJSON(usuariosPath, usuarios)

  return m.reply(`🧑‍⚕️ Tu *${user.pokemon.nombre}* ha sido curado al 100%. ❤️`)
}

handler.help = ['curar']
handler.tags = ['juegos']
handler.command = ['curar']
handler.register = true

export default handler