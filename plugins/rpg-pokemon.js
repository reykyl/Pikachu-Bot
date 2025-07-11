import fs from 'fs'
import path from 'path'

const usuariosPath = path.join('./src/database/usuarios.json')
const pokemonesPath = path.join('./src/database/pokemones.json')

let handler = async (m, { conn, args }) => {
  const userId = m.sender.replace(/[^0-9]/g, '')
  let usuarios = {}

  // Cargar usuarios
  if (fs.existsSync(usuariosPath)) {
    usuarios = JSON.parse(fs.readFileSync(usuariosPath))
  }

  // Comprobamos si el usuario ya tiene un Pokémon
  if (usuarios[userId]?.pokemon) {
    return m.reply(`🧢 Ya tienes un Pokémon atrapado: *${usuarios[userId].pokemon.nombre}*\n\nUsa *.perfil* para ver los detalles.`)
  }

  // Cargar lista de pokemones
  const pokemones = JSON.parse(fs.readFileSync(pokemonesPath))
  const poke = pokemones[Math.floor(Math.random() * pokemones.length)]

  // Guardar para atrapar en memoria temporal
  global.pokemonEnEspera ??= {}
  global.pokemonEnEspera[userId] = poke

  const caption = `🌟 ¡Un Pokémon salvaje apareció!\n\n` +
                  `📛 Nombre: *${poke.nombre}*\n` +
                  `🎯 Tipo: ${poke.tipo.join(', ')}\n` +
                  `❤️ Vida base: ${poke.vidaBase}\n\n` +
                  `¿Quieres atraparlo?\n\n✅ Solo puedes tener *1* Pokémon.`

  await conn.sendMessage(m.chat, {
    image: { url: poke.imagen },
    caption,
    footer: 'Pikachu-Bot RPG',
    buttons: [
      { buttonId: `.atrapar-confirmar`, buttonText: { displayText: '🎯 Atrapar Pokémon' }, type: 1 },
      { buttonId: `.atrapar-ignorar`, buttonText: { displayText: '❌ Ignorar' }, type: 1 }
    ],
    headerType: 4
  }, { quoted: m })
}

handler.command = /^atrapar$/i

handler.before = async (m, { conn }) => {
  if (!m.text.startsWith('.atrapar-')) return

  const userId = m.sender.replace(/[^0-9]/g, '')
  let usuarios = {}

  if (fs.existsSync(usuariosPath)) {
    usuarios = JSON.parse(fs.readFileSync(usuariosPath))
  }

  if (usuarios[userId]?.pokemon) {
    return m.reply(`🧢 Ya tienes un Pokémon atrapado.`)
  }

  const action = m.text.trim()

  if (action === '.atrapar-confirmar') {
    const poke = global.pokemonEnEspera?.[userId]
    if (!poke) return m.reply('❗ No hay Pokémon en espera.')

    usuarios[userId] = {
      nombre: (await conn.getName(m.sender)) || 'Usuario',
      comida: 3,
      pociones: 1,
      pokemon: {
        id: poke.id,
        nombre: poke.nombre,
        alias: poke.nombre,
        nivel: 1,
        vida: poke.vidaBase,
        vidaMax: poke.vidaBase,
        exp: 0,
        fechaCaptura: new Date().toISOString()
      }
    }

    fs.writeFileSync(usuariosPath, JSON.stringify(usuarios, null, 2))
    delete global.pokemonEnEspera[userId]
    return m.reply(`🎉 ¡Has atrapado a *${poke.nombre}*! Usa *.perfil* para verlo.`)

  } else if (action === '.atrapar-ignorar') {
    delete global.pokemonEnEspera[userId]
    return m.reply('🚶‍♂️ Ignoraste al Pokémon salvaje.')
  }
}

export default handler