import fs from 'fs'
import path from 'path'

function cargarJSON(ruta) {
  if (!fs.existsSync(ruta)) {
    fs.writeFileSync(ruta, '{}')
    return {}
  }
  const contenido = fs.readFileSync(ruta, 'utf-8').trim()
  if (!contenido) {
    fs.writeFileSync(ruta, '{}')
    return {}
  }
  try {
    return JSON.parse(contenido)
  } catch (e) {
    console.error('Error parseando JSON en', ruta, e)
    fs.writeFileSync(ruta, '{}')
    return {}
  }
}

const usuariosPath = path.join('./src/database/usuarios.json')
const pokemonesPath = path.join('./src/database/pokemones.json')

let handler = async (m, { conn, args }) => {
  const userId = m.sender.replace(/[^0-9]/g, '')
  let usuarios = cargarJSON(usuariosPath)

  if (usuarios[userId]?.pokemon) {
    return m.reply(`🧢 Ya tienes un Pokémon atrapado: *${usuarios[userId].pokemon.nombre}*.\n\nUsa *.perfil* para verlo.`)
  }

  const pokemones = JSON.parse(fs.readFileSync(pokemonesPath)) // asumo que pokemones.json está bien formado

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