import fs from 'fs'

const pokemonesPath = './src/database/pokemones.json'
const usuariosPath = './src/database/usuarios.json'

function cargarJSONSeguro(ruta, valorDefault = {}) {
  try {
    if (!fs.existsSync(ruta)) {
      fs.writeFileSync(ruta, JSON.stringify(valorDefault, null, 2))
      return valorDefault
    }
    const raw = fs.readFileSync(ruta, 'utf-8').trim()
    if (!raw) {
      fs.writeFileSync(ruta, JSON.stringify(valorDefault, null, 2))
      return valorDefault
    }
    return JSON.parse(raw)
  } catch (e) {
    throw new Error(`❌ Error leyendo ${ruta}:\n${e.message}`)
  }
}

let handler = async (m, { conn, args }) => {
  try {
    const userId = m.sender.replace(/[^0-9]/g, '')
    const usuarios = cargarJSONSeguro(usuariosPath)
    const pokemones = cargarJSONSeguro(pokemonesPath, [])

    if (!Array.isArray(pokemones) || pokemones.length === 0)
      return m.reply('⚠️ La lista de pokemones está vacía o dañada.')

    if (args[0]?.toLowerCase() === 'sí' || args[0]?.toLowerCase() === 'si') {
      if (usuarios[userId]?.pokemon)
        return m.reply('🧢 Ya atrapaste un Pokémon.')

      const poke = global.pokemonEnEspera?.[userId]
      if (!poke) return m.reply('❗ No hay ningún Pokémon en espera para atrapar.')

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
    }

    if (args[0]?.toLowerCase() === 'no') {
      delete global.pokemonEnEspera?.[userId]
      return m.reply('🚶‍♂️ Has ignorado al Pokémon salvaje.')
    }

    if (usuarios[userId]?.pokemon) {
      return m.reply(`🧢 Ya tienes un Pokémon atrapado: *${usuarios[userId].pokemon.nombre}*.\nUsa *.perfil* para verlo.`)
    }

    const poke = pokemones[Math.floor(Math.random() * pokemones.length)]
    global.pokemonEnEspera ??= {}
    global.pokemonEnEspera[userId] = poke

    const texto = `🌟 ¡Un Pokémon salvaje apareció!\n\n` +
                  `📛 Nombre: *${poke.nombre}*\n` +
                  `🎯 Tipo: ${poke.tipo.join(', ')}\n` +
                  `❤️ Vida base: ${poke.vidaBase}\n\n` +
                  `¿Quieres atraparlo?\n✍️ Escribe *.atrapar sí* para atraparlo o *.atrapar no* para ignorarlo.`

    await conn.sendFile(m.chat, poke.imagen, 'poke.jpg', texto, m)

  } catch (err) {
    console.error(err)
    return m.reply(err.message || '❌ Error inesperado.')
  }
}

handler.help = ['atrapar']
handler.tags = ['juegos']
handler.command = ['atrapar']
handler.register = true

export default handler