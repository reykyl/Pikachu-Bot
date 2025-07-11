import fs from 'fs'

const usuariosPath = '..src/database/usuarios.json'
const pokemonesPath = '..src/database/pokemones.json'

let handler = async (m, { conn, command, args }) => {
  const userId = m.sender.replace(/[^0-9]/g, '')
  let usuarios = {}
  if (fs.existsSync(usuariosPath)) {
    usuarios = JSON.parse(fs.readFileSync(usuariosPath))
  }

  if (command === 'atrapar') {
    if (usuarios[userId]?.pokemon) {
      return m.reply(`🧢 Ya tienes un Pokémon atrapado: ${usuarios[userId].pokemon.nombre}. Usa *.perfil* para verlo.`)
    }

    const pokemones = JSON.parse(fs.readFileSync(pokemonesPath))
    const poke = pokemones[Math.floor(Math.random() * pokemones.length)]

    let mensaje = `🌟 ¡Un Pokémon salvaje apareció!\n\n` +
                  `📛 Nombre: *${poke.nombre}*\n` +
                  `🎯 Tipo: ${poke.tipo.join(', ')}\n` +
                  `❤️ Vida base: ${poke.vidaBase}\n\n` +
                  `¿Quieres atraparlo?\n\n` +
                  `✅ Solo puedes tener *1* Pokémon.`

    await conn.sendMessage(m.chat, {
      image: { url: poke.imagen },
      caption: mensaje,
      footer: 'Pikachu-Bot RPG',
      buttons: [
        { buttonId: `.atrapar atraparlo ${poke.id}`, buttonText: { displayText: '🎯 Atrapar Pokémon' }, type: 1 },
        { buttonId: `.atrapar ignorar`, buttonText: { displayText: '❌ Ignorar' }, type: 1 }
      ],
      headerType: 4
    }, { quoted: m })
  }

  
  if (args[0] === 'atraparlo') {
    if (usuarios[userId]?.pokemon) return m.reply('🧢 Ya atrapaste uno.')

    const pokeId = args[1]
    if (!pokeId) return m.reply('❗ Falta el ID del Pokémon.')

    const pokemones = JSON.parse(fs.readFileSync(pokemonesPath))
    const pokemon = pokemones.find(p => p.id === pokeId)
    if (!pokemon) return m.reply('❌ Pokémon no encontrado.')

    usuarios[userId] = {
      nombre: (await conn.getName(m.sender)) || 'Usuario',
      comida: 3,
      pociones: 1,
      pokemon: {
        id: pokemon.id,
        nombre: pokemon.nombre,
        alias: pokemon.nombre,
        nivel: 1,
        vida: pokemon.vidaBase,
        vidaMax: pokemon.vidaBase,
        exp: 0,
        fechaCaptura: new Date().toISOString()
      }
    }

    fs.writeFileSync(usuariosPath, JSON.stringify(usuarios, null, 2))
    return m.reply(`🎉 ¡Has atrapado a *${pokemon.nombre}*! Usa *.perfil* para verlo.`)
  }

  
  if (args[0] === 'ignorar') {
    return m.reply('🚶‍♂️ Ignoraste al Pokémon salvaje...')
  }
}

handler.command = ['atrapar', 'atraparlo']
export default handler