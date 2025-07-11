import fs from 'fs'
import path from 'path'

const usuariosPath = path.join('./src/database/usuarios.json')
const pokemonesPath = path.join('./src/database/pokemones.json')

let handler = async (m, { conn, args }) => {
  const userId = m.sender.replace(/[^0-9]/g, '')
  let usuarios = {}

  if (fs.existsSync(usuariosPath)) {
    usuarios = JSON.parse(fs.readFileSync(usuariosPath))
  }

  // Ya tiene un Pokémon
  if (usuarios[userId]?.pokemon) {
    if (args[0]?.toLowerCase() === 'sí' || args[0]?.toLowerCase() === 'si') {
      return m.reply('❗ Ya tienes un Pokémon atrapado. Usa *.perfil* para verlo.')
    }
    return m.reply(`🧢 Ya atrapaste a *${usuarios[userId].pokemon.nombre}*.\n\nUsa *.perfil* para verlo.`)
  }

  // Ya preguntó si quería atrapar uno
  if (args[0]?.toLowerCase() === 'sí' || args[0]?.toLowerCase() === 'si') {
    const poke = global.pokemonEnEspera?.[userId]
    if (!poke) return m.reply('❗ No hay ningún Pokémon en espera.')

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
    return m.reply('🚶‍♂️ Ignoraste al Pokémon salvaje.')
  }

  // Mostrar Pokémon salvaje
  const pokemones = JSON.parse(fs.readFileSync(pokemonesPath))
  const poke = pokemones[Math.floor(Math.random() * pokemones.length)]

  global.pokemonEnEspera ??= {}
  global.pokemonEnEspera[userId] = poke

  const texto = `🌟 ¡Un Pokémon salvaje apareció!\n\n` +
                `📛 Nombre: *${poke.nombre}*\n` +
                `🎯 Tipo: ${poke.tipo.join(', ')}\n` +
                `❤️ Vida base: ${poke.vidaBase}\n\n` +
                `¿Quieres atraparlo?\n\n` +
                `✍️ Responde con *.atrapar sí* para atraparlo o *.atrapar no* para ignorarlo.`

  await conn.sendFile(m.chat, poke.imagen, 'poke.jpg', texto, m)
}

handler.help = ['atrapar']
handler.tags = ['juegos']
handler.command = ['atrapar']
handler.register = true

export default handler