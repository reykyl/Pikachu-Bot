process.env['NODE_TLS_REJECT_UNAUTHORIZED'] = '1'

import './config.js'
import { join, dirname } from 'path'
import { fileURLToPath } from 'url'
import { platform } from 'process'
import fs from 'fs/promises'
import { readdirSync, existsSync, mkdirSync, statSync, unlinkSync, readFileSync, rmSync } from 'fs'
import cfonts from 'cfonts'
import { createRequire } from 'module'
import chalk from 'chalk'
import syntaxerror from 'syntax-error'
import { tmpdir } from 'os'
import { format } from 'util'
import Pino from 'pino'
import { Boom } from '@hapi/boom'
import { makeWASocket, protoType, serialize } from './lib/simple.js'
import { Low, JSONFile } from 'lowdb'
import { mongoDB, mongoDBV2 } from './lib/mongoDB.js'
import store from './lib/store.js'
import yargs from 'yargs'
import { spawn } from 'child_process'
import lodash from 'lodash'
import readline from 'readline'
import NodeCache from 'node-cache'

const { chain } = lodash
const PORT = process.env.PORT || process.env.SERVER_PORT || 3000

let { say } = cfonts
console.log(chalk.bold.redBright(`\n🧃 Iniciando Pikachu-bot ⚡\n`))
say('Pikachu Bot 🧃', { font: 'block', align: 'center', colors: ['magentaBright'] })
say(`Developed By • Deylin`, { font: 'console', align: 'center', colors: ['blueBright'] })

protoType()
serialize()

global.__filename = function(pathURL = import.meta.url, rmPrefix = platform !== 'win32') {
  return rmPrefix ? /file:\/\/\//.test(pathURL) ? fileURLToPath(pathURL) : pathURL : pathToFileURL(pathURL).toString()
}
global.__dirname = function(pathURL) { return dirname(global.__filename(pathURL, true)) }
global.__require = function(dir = import.meta.url) { return createRequire(dir) }

global.API = (name, path = '/', query = {}, apikeyqueryname) => (name in global.APIs ? global.APIs[name] : name) + path + (query || apikeyqueryname ? '?' + new URLSearchParams(Object.entries({...query, ...(apikeyqueryname ? {[apikeyqueryname]: global.APIKeys[name in global.APIs ? global.APIs[name] : name]} : {})})) : '')

global.timestamp = { start: new Date }
const __dirname = global.__dirname(import.meta.url)

global.opts = new Object(yargs(process.argv.slice(2)).exitProcess(false).parse())
global.prefix = new RegExp('^[#/!⚡.🧃]')
global.db = new Low(/https?:\/\//.test(opts['db'] || '') ? new cloudDBAdapter(opts['db']) : new JSONFile('./src/database/database.json'))
global.DATABASE = global.db

global.loadDatabase = async function loadDatabase() {
  if (global.db.READ) {
    return new Promise(resolve => setInterval(async function() {
      if (!global.db.READ) {
        clearInterval(this)
        resolve(global.db.data == null ? global.loadDatabase() : global.db.data)
      }
    }, 1000))
  }
  if (global.db.data !== null) return
  global.db.READ = true
  await global.db.read().catch(console.error)
  global.db.READ = null
  global.db.data = {
    users: {},
    chats: {},
    stats: {},
    msgs: {},
    sticker: {},
    settings: {},
    ...(global.db.data || {}),
  }
  global.db.chain = chain(global.db.data)
}
await global.loadDatabase()

const { useMultiFileAuthState, MessageRetryMap, fetchLatestBaileysVersion, makeCacheableSignalKeyStore, jidNormalizedUser } = await import('@whiskeysockets/baileys')
const { state, saveState, saveCreds } = await useMultiFileAuthState(global.sessions)
const msgRetryCounterCache = new NodeCache()
const { version } = await fetchLatestBaileysVersion()
let phoneNumber = global.botNumber

const methodCodeQR = process.argv.includes("qr")
const methodCode = !!phoneNumber || process.argv.includes("code")
const MethodMobile = process.argv.includes("mobile")
const rl = readline.createInterface({ input: process.stdin, output: process.stdout })
const question = texto => new Promise(resolver => rl.question(texto, resolver))

let opcion

if (methodCodeQR) opcion = '1'
if (!methodCodeQR && !methodCode && !existsSync(`./${sessions}/creds.json`)) {
  do {
    opcion = await question(chalk.bgMagenta.white('🧃 Seleccione una opción:\n') + chalk.bold.green('1. Con código QR\n') + chalk.bold.cyan('2. Con código de texto de 8 dígitos\n--> '))
    if (!/^[1-2]$/.test(opcion)) {
      console.log(chalk.bold.redBright(`⚡ No se permiten números que no sean 1 o 2.`))
    }
  } while (opcion !== '1' && opcion !== '2' || existsSync(`./${sessions}/creds.json`))
}

console.info = () => {}
console.debug = () => {}

const connectionOptions = {
  logger: Pino({ level: 'silent' }),
  printQRInTerminal: opcion == '1' || methodCodeQR,
  mobile: MethodMobile,
  browser: ['Ubuntu', 'Edge', '110.0.1587.56'],
  auth: {
    creds: state.creds,
    keys: makeCacheableSignalKeyStore(state.keys, Pino({ level: "fatal" }).child({ level: "fatal" }))
  },
  markOnlineOnConnect: true,
  generateHighQualityLinkPreview: true,
  getMessage: async (clave) => {
    let jid = jidNormalizedUser(clave.remoteJid)
    let msg = await store.loadMessage(jid, clave.id)
    return msg?.message || ""
  },
  msgRetryCounterCache,
  version
}

global.conn = makeWASocket(connectionOptions)
global.conn.sendAlbumMessage = function(jid, messages, quoted) {
  return sendAlbumMessage(this, jid, messages, quoted)
}

if (!existsSync(`./${sessions}/creds.json`) && (opcion === '2' || methodCode)) {
  opcion = '2'
  if (!conn.authState.creds.registered) {
    let addNumber
    if (!!phoneNumber) {
      addNumber = phoneNumber.replace(/[^0-9]/g, '')
    } else {
      do {
        phoneNumber = await question(chalk.bgBlack(chalk.bold.greenBright(`⚡ Ingrese el número de WhatsApp.\n🧃 Ejemplo: 57321×××××××\n---> `)))
        phoneNumber = phoneNumber.replace(/\D/g,'')
        if (!phoneNumber.startsWith('+')) phoneNumber = `+${phoneNumber}`
      } while (!await isValidPhoneNumber(phoneNumber))
      rl.close()
      addNumber = phoneNumber.replace(/\D/g, '')
      setTimeout(async () => {
        let codeBot = await conn.requestPairingCode(addNumber)
        codeBot = codeBot?.match(/.{1,4}/g)?.join("-") || codeBot
        console.log(chalk.bold.white(chalk.bgMagenta(`🧃 CÓDIGO DE VINCULACIÓN `)), chalk.bold.white(chalk.white(codeBot)))
      }, 3000)
    }
  }
}

conn.isInit = false
conn.well = false

if (!opts['test']) {
  if (global.db) setInterval(async () => {
    if (global.db.data) await global.db.write()
  }, 30 * 1000)
}

async function connectionUpdate(update) {
  const { connection, lastDisconnect, isNewLogin } = update
  global.stopped = connection
  if (isNewLogin) conn.isInit = true
  const code = lastDisconnect?.error?.output?.statusCode || lastDisconnect?.error?.output?.payload?.statusCode
  if (code && code !== DisconnectReason.loggedOut && conn?.ws.socket == null) {
    await global.reloadHandler(true).catch(console.error)
    global.timestamp.connect = new Date
  }
  if (global.db.data == null) await global.loadDatabase()
  if (update.qr != 0 && update.qr != undefined || methodCodeQR) {
    if (opcion == '1' || methodCodeQR) {
      console.log(chalk.bold.yellow(`\n❐ ESCANEA EL CÓDIGO QR EXPIRA EN 45 SEGUNDOS`))
    }
  }
  if (connection == 'open') {
    console.log(chalk.bold.green('\n🧃 Pikachu-bot Conectada con éxito 🪽'))
  }
  let reason = new Boom(lastDisconnect?.error)?.output?.statusCode
  if (connection === 'close') {
    if (reason === DisconnectReason.badSession) {
      console.log(chalk.bold.cyanBright(`\n⚠︎ SIN CONEXIÓN, BORRE LA CARPETA ${global.sessions} Y ESCANEA EL CÓDIGO QR ⚠︎`))
    } else if (reason === DisconnectReason.connectionClosed) {
      console.log(chalk.bold.magentaBright(`\n╭┄┄┄┄┄┄┄┄┄┄┄┄┄┄ • • • ┄┄┄┄┄┄┄┄┄┄┄┄┄┄ ☹\n┆ ⚠︎ CONEXION CERRADA, RECONECTANDO....\n╰┄┄┄┄┄┄┄┄┄┄┄┄┄┄ • • • ┄┄┄┄┄┄┄┄┄┄┄┄┄┄ ☹`))
      await global.reloadHandler(true).catch(console.error)
    } else if (reason === DisconnectReason.connectionLost) {
      console.log(chalk.bold.blueBright(`\n╭┄┄┄┄┄┄┄┄┄┄┄┄┄┄ • • • ┄┄┄┄┄┄┄┄┄┄┄┄┄┄ ☂\n┆ ⚠︎ CONEXIÓN PERDIDA CON EL SERVIDOR, RECONECTANDO....\n╰┄┄┄┄┄┄┄┄┄┄┄┄┄┄ • • • ┄┄┄┄┄┄┄┄┄┄┄┄┄┄ ☂`))
      await global.reloadHandler(true).catch(console.error)
    } else if (reason === DisconnectReason.connectionReplaced) {
      console.log(chalk.bold.yellowBright(`\n╭┄┄┄┄┄┄┄┄┄┄┄┄┄┄ • • • ┄┄┄┄┄┄┄┄┄┄┄┄┄┄ ✗\n┆ ⚠︎ CONEXIÓN REEMPLAZADA, SE HA ABIERTO OTRA NUEVA SESION, POR FAVOR, CIERRA LA SESIÓN ACTUAL PRIMERO.\n╰┄┄┄┄┄┄┄┄┄┄┄┄┄┄ • • • ┄┄┄┄┄┄┄┄┄┄┄┄┄┄ ✗`))
    } else if (reason === DisconnectReason.loggedOut) {
      console.log(chalk.bold.redBright(`\n⚠︎ SIN CONEXIÓN, BORRE LA CARPETA ${global.sessions} Y ESCANEA EL CÓDIGO QR ⚠︎`))
      await global.reloadHandler(true).catch(console.error)
    } else if (reason === DisconnectReason.restartRequired) {
      console.log(chalk.bold.cyanBright(`\n╭┄┄┄┄┄┄┄┄┄┄┄┄┄┄ • • • ┄┄┄┄┄┄┄┄┄┄┄┄┄┄ ✓\n┆ ✧ CONECTANDO AL SERVIDOR...\n╰┄┄┄┄┄┄┄┄┄┄┄┄┄┄ • • • ┄┄┄┄┄┄┄┄┄┄┄┄┄┄ ✓`))
      await global.reloadHandler(true).catch(console.error)
    } else if (reason === DisconnectReason.timedOut) {
      console.log(chalk.bold.yellowBright(`\n╭┄┄┄┄┄┄┄┄┄┄┄┄┄┄ • • • ┄┄┄┄┄┄┄┄┄┄┄┄┄┄ ▸\n┆ ⧖ TIEMPO DE CONEXIÓN AGOTADO, RECONECTANDO....\n╰┄┄┄┄┄┄┄┄┄┄┄┄┄┄ • • • ┄┄┄┄┄┄┄┄┄┄┄┄┄┄ ▸`))
      await global.reloadHandler(true).catch(console.error)
    } else {
      console.log(chalk.bold.redBright(`\n⚠︎！ RAZON DE DESCONEXIÓN DESCONOCIDA: ${reason || 'No encontrado'} >> ${connection || 'No encontrado'}`))
    }
  }
}
process.on('uncaughtException', console.error)

let isInit = true
let handler = await import('./handler.js')
global.reloadHandler = async function(restatConn) {
  try {
    const Handler = await import(`./handler.js?update=${Date.now()}`).catch(console.error)
    if (Object.keys(Handler || {}).length) handler = Handler
  } catch (e) {
    console.error(e)
  }
  if (restatConn) {
    try { global.conn.ws.close() } catch {}
    conn.ev.removeAllListeners()
    global.conn = makeWASocket(connectionOptions)
    isInit = true
  }
  if (!isInit) {
    conn.ev.off('messages.upsert', conn.handler)
    conn.ev.off('connection.update', conn.connectionUpdate)
    conn.ev.off('creds.update', conn.credsUpdate)
  }
  conn.handler = handler.handler.bind(global.conn)
  conn.connectionUpdate = connectionUpdate.bind(global.conn)
  conn.credsUpdate = saveCreds.bind(global.conn, true)
  conn.ev.on('messages.upsert', conn.handler)
  conn.ev.on('connection.update', conn.connectionUpdate)
  conn.ev.on('creds.update', conn.credsUpdate)
  isInit = false
  return true
}

// Subbot loader – optimizada para concurrencia
global.rutaJadiBot = join(__dirname, './JadiBots')

if (global.pikaJadibts) {
  if (!existsSync(global.rutaJadiBot)) mkdirSync(global.rutaJadiBot, { recursive: true })

  const subbots = readdirSync(global.rutaJadiBot, { withFileTypes: true })
    .filter(dirent => dirent.isDirectory())
    .map(dirent => dirent.name)

  await Promise.all(subbots.map(async nombreSubbot => {
    const pathSubbot = join(global.rutaJadiBot, nombreSubbot)
    const archivosSubbot = await fs.readdir(pathSubbot)
    if (archivosSubbot.includes('creds.json')) {
      try {
        pikaJadiBot({
          pathpikaJadiBot: pathSubbot,
          m: null,
          conn,
          args: '',
          usedPrefix: '/',
          command: 'serbot'
        })
      } catch (e) { }
    }
  }))
}

// Plugin loader – optimizada para concurrencia
const pluginFolder = global.__dirname(join(__dirname, './plugins/index'))
const pluginFilter = filename => /\.js$/.test(filename)
global.plugins = {}

async function filesInit() {
  const files = readdirSync(pluginFolder).filter(pluginFilter)
  await Promise.all(files.map(async filename => {
    try {
      const file = global.__filename(join(pluginFolder, filename))
      const module = await import(file)
      global.plugins[filename] = module.default || module
    } catch (e) {
      conn.logger.error(e)
      delete global.plugins[filename]
    }
  }))
}
await filesInit()

global.reload = async (_ev, filename) => {
  if (pluginFilter(filename)) {
    const dir = global.__filename(join(pluginFolder, filename), true)
    if (filename in global.plugins) {
      if (existsSync(dir)) conn.logger.info(` updated plugin - '${filename}'`)
      else {
        conn.logger.warn(`deleted plugin - '${filename}'`)
        return delete global.plugins[filename]
      }
    } else conn.logger.info(`new plugin - '${filename}'`)
    const err = syntaxerror(readFileSync(dir), filename, { sourceType: 'module', allowAwaitOutsideFunction: true })
    if (err) conn.logger.error(`syntax error while loading '${filename}'\n${format(err)}`)
    else {
      try {
        const module = (await import(`${global.__filename(dir)}?update=${Date.now()}`))
        global.plugins[filename] = module.default || module
      } catch (e) {
        conn.logger.error(`error require plugin '${filename}\n${format(e)}'`)
      } finally {
        global.plugins = Object.fromEntries(Object.entries(global.plugins).sort(([a], [b]) => a.localeCompare(b)))
      }
    }
  }
}
Object.freeze(global.reload)
fs.watch(pluginFolder, (eventType, filename) => global.reload(eventType, filename))
await global.reloadHandler()


async function clearTmp() {
  try {
    const tmpDir = join(__dirname, 'tmp')
    const filenames = await fs.readdir(tmpDir)
    await Promise.all(filenames.map(file => fs.unlink(join(tmpDir, file))))
  } catch { }
}

async function purgeSession() {
  try {
    let directorio = await fs.readdir(`./${sessions}`)
    let filesFolderPreKeys = directorio.filter(file => file.startsWith('pre-key-'))
    await Promise.all(filesFolderPreKeys.map(file => fs.unlink(`./${sessions}/${file}`)))
  } catch { }
}

async function purgeSessionSB() {
  try {
    const listaDirectorios = await fs.readdir(`./${jadi}/`)
    await Promise.all(listaDirectorios.map(async directorio => {
      if (statSync(`./${jadi}/${directorio}`).isDirectory()) {
        const DSBPreKeys = (await fs.readdir(`./${jadi}/${directorio}`)).filter(fileInDir => fileInDir.startsWith('pre-key-'))
        await Promise.all(DSBPreKeys.map(fileInDir => fileInDir !== 'creds.json' ? fs.unlink(`./${jadi}/${directorio}/${fileInDir}`) : undefined))
      }
    }))
  } catch (err) { }
}

async function purgeOldFiles() {
  const directories = [`./${sessions}/`, `./${jadi}/`]
  await Promise.all(directories.map(async dir => {
    try {
      const files = await fs.readdir(dir)
      await Promise.all(files.map(file => file !== 'creds.json' ? fs.unlink(join(dir, file)) : undefined))
    } catch { }
  }))
}


setInterval(async () => { if (global.stopped === 'close' || !conn || !conn.user) return; await clearTmp() }, 1000 * 60 * 4)
setInterval(async () => { if (global.stopped === 'close' || !conn || !conn.user) return; await purgeSession() }, 1000 * 60 * 10)
setInterval(async () => { if (global.stopped === 'close' || !conn || !conn.user) return; await purgeSessionSB() }, 1000 * 60 * 10)
setInterval(async () => { if (global.stopped === 'close' || !conn || !conn.user) return; await purgeOldFiles() }, 1000 * 60 * 10)


async function _quickTest() {
  const test = await Promise.all([
    spawn('ffmpeg'),
    spawn('ffprobe'),
    spawn('ffmpeg', ['-hide_banner', '-loglevel', 'error', '-filter_complex', 'color', '-frames:v', '1', '-f', 'webp', '-']),
    spawn('convert'),
    spawn('magick'),
    spawn('gm'),
    spawn('find', ['--version']),
  ].map(p => Promise.race([
    new Promise(resolve => p.on('close', code => resolve(code !== 127))),
    new Promise(resolve => p.on('error', _ => resolve(false)))
  ])))
  const [ffmpeg, ffprobe, ffmpegWebp, convert, magick, gm, find] = test
  const s = global.support = { ffmpeg, ffprobe, ffmpegWebp, convert, magick, gm, find }
  Object.freeze(global.support)
}

_quickTest().then(() => conn.logger.info(chalk.bold(`✦  H E C H O\n`.trim()))).catch(console.error)

async function isValidPhoneNumber(number) {
  try {
    number = number.replace(/\s+/g, '')
    if (number.startsWith('+521')) number = number.replace('+521', '+52')
    else if (number.startsWith('+52') && number[4] === '1') number = number.replace('+52 1', '+52')
    const parsedNumber = phoneUtil.parseAndKeepRawInput(number)
    return phoneUtil.isValidNumber(parsedNumber)
  } catch { return false }
}