import fs from 'fs'
import path from 'path'

const usuariosPath = path.join('./src/database/usuarios.json')
const pokemonesPath = path.join('./src/database/pokemones.json')

let handler = async (m, { conn, args }) => {
  try {
    const userId = m.sender.replace(/[^0-9]/g, '')
    let usuarios = {}

    if (fs.existsSync(usuariosPath)) {
      usuarios = JSON.parse(fs.readFileSync(usuariosPath))
    }

    if (usuarios[userId]?.pokemon) {
      return m.reply(`🧢 Ya tienes un Pokémon atrapado: *${usuarios[userId].pokemon.nombre}*.\n\nUsa *.perfil* para verlo.`)
    }

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

  } catch (error) {
    console.error('Error en comando atrapar:', error)
    m.reply('❌ Ocurrió un error, intenta más tarde.')
  }
}

handler.command = ['atrapar']
export default handler