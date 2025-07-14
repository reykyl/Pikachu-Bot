
import { smsg } from './lib/simple.js'
import { format } from 'util'
import { fileURLToPath } from 'url'
import path, { join } from 'path'
import { unwatchFile, watchFile } from 'fs'
import chalk from 'chalk'
import getMensajeSistema from './lib/msmwarning.js'


const { proto } = (await import('@whiskeysockets/baileys')).default
const isNumber = x => typeof x === 'number' && !isNaN(x)
const delay = ms => isNumber(ms) ? new Promise(resolve => setTimeout(resolve, ms)) : Promise.resolve()


function initUser(m) {
  return {
    exp: 0,
    joincount: 1,
    diamond: 3,
    lastadventure: 0,
    health: 100,
    lastclaim: 0,
    lastcofre: 0,
    lastdiamantes: 0,
    lastcode: 0,
    lastduel: 0,
    lastpago: 0,
    lastmining: 0,
    lastcodereg: 0,
    muto: false,
    registered: false,
    genre: '',
    birth: '',
    marry: '',
    description: '',
    packstickers: null,
    name: m.name,
    age: -1,
    regTime: -1,
    afk: -1,
    afkReason: '',
    banned: false,
    useDocument: false,
    bank: 0,
    level: 0,
    role: 'Nuv',
    premium: false,
    premiumTime: 0,
    warn: 0,
    spam: 0,
    antispam: 0,
    antispam2: 0
  }
}


function initChat() {
  return {
    isBanned: false,
    sAutoresponder: '',
    welcome: false,
    autolevelup: false,
    autoresponder: false,
    delete: false,
    autoAceptar: false,
    autoRechazar: false,
    detect: true,
    economy: true,
    gacha: true,
    antiBot: false,
    antiBot2: false,
    modoadmin: false,
    antiLink: true,
    antifake: false,
    reaction: false,
    nsfw: false,
    expired: 0
  }
}


function initSettings() {
  return {
    self: false,
    restrict: true,
    jadibotmd: true,
    antiPrivate: false,
    autoread: false,
    status: 0
  }
}


export async function handler(chatUpdate) {
  this.msgqueque ??= []
  this.uptime ??= Date.now()
  if (!chatUpdate || !chatUpdate.messages?.length) return

  await this.pushMessage(chatUpdate.messages).catch(console.error)
  let m = chatUpdate.messages.at(-1)
  if (!m) return

  if (global.db.data == null) await global.loadDatabase()

  try {
    m = smsg(this, m) || m
    if (!m) return
    m.exp = 0

    
    let user = global.db.data.users[m.sender]
    if (typeof user !== 'object' || !user) global.db.data.users[m.sender] = user = initUser(m)
    // Validaciones de usuario
    Object.entries(initUser(m)).forEach(([k, v]) => {
      if (typeof user[k] === 'undefined') user[k] = v
      if (typeof v === 'number' && !isNumber(user[k])) user[k] = v
    })

    
    let chat = global.db.data.chats[m.chat]
    if (typeof chat !== 'object' || !chat) global.db.data.chats[m.chat] = chat = initChat()
    // Validaciones de chat
    Object.entries(initChat()).forEach(([k, v]) => {
      if (typeof chat[k] === 'undefined') chat[k] = v
      if (typeof v === 'number' && !isNumber(chat[k])) chat[k] = v
    })

    
    let settings = global.db.data.settings[this.user.jid]
    if (typeof settings !== 'object' || !settings) global.db.data.settings[this.user.jid] = settings = initSettings()
    Object.entries(initSettings()).forEach(([k, v]) => {
      if (typeof settings[k] === 'undefined') settings[k] = v
    })

   
    if (opts.nyimak) return
    if (!m.fromMe && opts.self) return
    if (opts.swonly && m.chat !== 'status@broadcast') return
    if (typeof m.text !== 'string') m.text = ''

   
    const detectwhat = m.sender.includes('@lid') ? '@lid' : '@s.whatsapp.net'
    const isROwner = [...global.owner.map(([number]) => number)].map(v => v.replace(/[^0-9]/g, '') + detectwhat).includes(m.sender)
    const isOwner = isROwner || m.fromMe
    const isMods = isOwner || global.mods.map(v => v.replace(/[^0-9]/g, '') + detectwhat).includes(m.sender)
    const isPrems = isROwner || user.premiumTime > 0

    if (m.isBaileys) return

    if (opts.queque && m.text && !(isMods || isPrems)) {
      const queque = this.msgqueque
      const time = 5000
      const previousID = queque.at(-1)
      queque.push(m.id || m.key.id)
      setTimeout(() => {
        if (queque.indexOf(previousID) === -1) return
        queque.splice(queque.indexOf(previousID), 1)
      }, time)
    }

    m.exp += Math.ceil(Math.random() * 10)

    
    // fragmento de código creado por Destroy para yuki-Bot //
async function getLidFromJid(id, conn) {
if (id.endsWith('@lid')) return id
const res = await conn.onWhatsApp(id).catch(() => [])
return res[0]?.lid || id
}
const senderLid = await getLidFromJid(m.sender, conn)
const botLid = await getLidFromJid(conn.user.jid, conn)
const senderJid = m.sender
const botJid = conn.user.jid
const groupMetadata = m.isGroup ? ((conn.chats[m.chat] || {}).metadata || await this.groupMetadata(m.chat).catch(_ => null)) : {}
const participants = m.isGroup ? (groupMetadata.participants || []) : []
const user = participants.find(p => p.id === senderLid || p.id === senderJid) || {}
const bot = participants.find(p => p.id === botLid || p.id === botJid) || {}
const isRAdmin = user?.admin === "superadmin"
const isAdmin = isRAdmin || user?.admin === "admin"
const isBotAdmin = !!bot?.admin

    m.isWABusiness = global.conn.authState?.creds?.platform === 'smba' || global.conn.authState?.creds?.platform === 'smbi'
    m.isChannel = m.chat.includes('@newsletter') || m.sender.includes('@newsletter')

    const pluginsDir = path.join(path.dirname(fileURLToPath(import.meta.url)), './plugins')
    for (const [name, plugin] of Object.entries(global.plugins)) {
      if (!plugin || plugin.disabled) continue
      const pluginFile = join(pluginsDir, name)

      if (typeof plugin.all === 'function') {
        try {
          await plugin.all.call(this, m, { chatUpdate, __dirname: pluginsDir, __filename: pluginFile })
        } catch (e) { console.error(e) }
      }

      if (!opts.restrict && plugin.tags?.includes('admin')) continue

      const str2Regex = str => str.replace(/[|\\{}()[\]^$+*?.⚡]/g, '\\$&')
      const _prefix = plugin.customPrefix || conn.prefix || global.prefix
      const prefixMatches = (_prefix instanceof RegExp
        ? [[_prefix.exec(m.text), _prefix]]
        : Array.isArray(_prefix)
          ? _prefix.map(p => [p instanceof RegExp ? p.exec(m.text) : new RegExp(str2Regex(p)).exec(m.text), p])
          : typeof _prefix === 'string'
            ? [[new RegExp(str2Regex(_prefix)).exec(m.text), new RegExp(str2Regex(_prefix))]]
            : [[[], new RegExp]]
      ).find(p => p[1])

      if (typeof plugin.before === 'function') {
        const shouldContinue = await plugin.before.call(this, m, {
          match: prefixMatches,
          conn: this,
          participants,
          groupMetadata,
          user: groupUser,
          bot: groupBot,
          isROwner, isOwner, isRAdmin, isAdmin, isBotAdmin, isPrems, chatUpdate,
          __dirname: pluginsDir, __filename: pluginFile
        })
        if (shouldContinue) continue
      }

      if (typeof plugin !== 'function') continue

      let usedPrefix
      if ((usedPrefix = (prefixMatches?.[0] || '')[0])) {
        const noPrefix = m.text.replace(usedPrefix, '')
        const [command, ...args] = noPrefix.trim().split(/\s+/)
        const _args = noPrefix.trim().split(/\s+/).slice(1)
        const text = _args.join(' ')
        const cmd = (command || '').toLowerCase()
        const fail = plugin.fail || global.dfail
        const isAccept = plugin.command instanceof RegExp
          ? plugin.command.test(cmd)
          : Array.isArray(plugin.command)
            ? plugin.command.some(c => c instanceof RegExp ? c.test(cmd) : c === cmd)
            : typeof plugin.command === 'string'
              ? plugin.command === cmd
              : false

        global.comando = cmd

        if ((m.id.startsWith('NJX-') || (m.id.startsWith('BAE5') && m.id.length === 16) || (m.id.startsWith('B24E') && m.id.length === 20))) return

        if (!isAccept) continue
        m.plugin = name

       
        if (chat.isBanned && !isROwner && !['grupo-unbanchat.js'].includes(name)) return
        if (user.banned && !isROwner && name !== 'owner-unbanuser.js') return

       
        if (user.antispam2 && isROwner) return
        if (new Date - user.spam < 3000) return console.log('[ SPAM ]')
        user.spam = +new Date

     
        if (chat.modoadmin && !isOwner && !isROwner && m.isGroup && !isAdmin) return
        if (plugin.rowner && plugin.owner && !(isROwner || isOwner)) { fail('owner', m, this); continue }
        if (plugin.rowner && !isROwner) { fail('rowner', m, this); continue }
        if (plugin.owner && !isOwner) { fail('owner', m, this); continue }
        if (plugin.mods && !isMods) { fail('mods', m, this); continue }
        if (plugin.premium && !isPrems) { fail('premium', m, this); continue }
        if (plugin.group && !m.isGroup) { fail('group', m, this); continue }
        if (plugin.botAdmin && !isBotAdmin) { fail('botAdmin', m, this); continue }
        if (plugin.admin && !isAdmin) { fail('admin', m, this); continue }
        if (plugin.register && !user.registered) { fail('unreg', m, this); continue }
        if (plugin.private && m.isGroup) { fail('private', m, this); continue }

        m.isCommand = true
        const xp = 'exp' in plugin ? parseInt(plugin.exp) : 17
        if (xp > 200) m.reply('chirrido -_-')
        else m.exp += xp

        const extra = {
          match: prefixMatches,
          usedPrefix,
          noPrefix,
          _args,
          args,
          command: cmd,
          text,
          conn: this,
          participants,
          groupMetadata,
          user: groupUser,
          bot: groupBot,
          isROwner, isOwner, isRAdmin, isAdmin, isBotAdmin, isPrems, chatUpdate,
          __dirname: pluginsDir, __filename: pluginFile
        }
        try {
          await plugin.call(this, m, extra)
        } catch (e) {
          m.error = e
          console.error(e)
          if (e) {
            let textError = format(e)
            for (const key of Object.values(global.APIKeys)) {
              textError = textError.replace(new RegExp(key, 'g'), 'Administrador')
            }
            m.reply(textError)
          }
        } finally {
          if (typeof plugin.after === 'function') {
            try { await plugin.after.call(this, m, extra) } catch (e) { console.error(e) }
          }
        }
        break
      }
    }
  } catch (e) {
    console.error(e)
  } finally {
   
    if (opts.queque && m.text) {
      const idx = this.msgqueque.indexOf(m.id || m.key.id)
      if (idx !== -1) this.msgqueque.splice(idx, 1)
    }

   
    let stats = global.db.data.stats
    if (m) {
      let user = global.db.data.users[m.sender]
      if (user.muto) {
        let { id, participant } = m.key
        await conn.sendMessage(m.chat, { delete: { remoteJid: m.chat, fromMe: false, id, participant } })
      }
      if (m.sender && user) user.exp += m.exp
      if (m.plugin) {
        let now = Date.now()
        let stat = stats[m.plugin] ?? (stats[m.plugin] = {
          total: 1, success: m.error ? 0 : 1, last: now, lastSuccess: m.error ? 0 : now
        })
        stat.total += 1
        stat.last = now
        if (!m.error) {
          stat.success += 1
          stat.lastSuccess = now
        }
      }
    }

 
    try {
      if (!opts.noprint) await (await import('./lib/print.js')).default(m, this)
    } catch (e) {
      console.log(m, m.quoted, e)
    }
    if (opts.autoread) await this.readMessages([m.key])

    
    const chat = global.db.data.chats[m.chat]
    if (chat.reaction && m.text.match(/(ción|dad|aje|oso|izar|mente|pero|tion|age|ous|ate|and|but|ify|ai|Pikachu|a|s)/gi)) {
      const emoticons = ["🍟", "😃", "😄", "😁", "😆", "🍓", "😅", "😂", "🤣", "🥲", "☺️", "😊", "😇", "🙂", "🙃", "😉", "😌", "😍", "🥰", "😘", "😗", "😙", "🌺", "🌸", "😚", "😋", "😛", "😝", "😜", "🤪", "🤨", "🌟", "🤓", "😎", "🥸", "🤩", "🥳", "😏", "💫", "😞", "😔", "😟", "😕", "🙁", "☹️", "😣", "😖", "😫", "😩", "🥺", "😢", "😭", "😤", "😠", "😡", "🤬", "🤯", "😳", "🥵", "🥶", "😶‍🌫️", "😱", "😨", "😰", "😥", "😓", "🤗", "🤔", "🫣", "🤭", "🤖", "🍭", "🤫", "🫠", "🤥", "😶", "📇", "😐", "💧", "😑", "🫨", "😬", "🙄", "😯", "😦", "😧", "😮", "😲", "🥱", "😴", "🤤", "😪", "😮‍💨", "😵", "😵‍💫", "🤐", "🥴", "🤢", "🤮", "🤧", "😷", "🤒", "🤕", "🤑", "🤠", "😈", "👿", "👺", "🧿", "🌩", "👻", "😺", "😸", "😹", "😻", "😼", "😽", "🙀", "😿", "😾", "🫶", "👍", "✌️", "🙏", "🫵", "🤏", "🤌", "☝️", "🖕", "🙏", "🫵", "🫂", "🐱", "🤹‍♀️", "🤹‍♂️", "🗿", "✨", "⚡", "🔥", "🌈", "🩷", "❤️", "🧡", "💛", "💚", "🩵", "💙", "💜", "🖤", "🩶", "🤍", "🤎", "💔", "❤️‍🔥", "❤️‍🩹", "❣️", "💕", "💞", "💓", "💗", "💖", "💘", "💝", "🚩", "👊", "⚡️", "💋", "🫰", "💅", "👑", "🐣", "🐤", "🐈"]
      const pickRandom = arr => arr[Math.floor(Math.random() * arr.length)]
      if (!m.fromMe) return this.sendMessage(m.chat, { react: { text: pickRandom(emoticons), key: m.key } })
    }
  }
}


global.dfail = (type, m, conn, comando = '') => {
  const random = arr => arr[Math.floor(Math.random() * arr.length)]
  let edadaleatoria = random(['10', '28', '20', '40', '18', '21', '15', '11', '9', '17', '25'])
  let user2 = m.pushName || 'Anónimo'
  let verifyaleatorio = random(['registrar', 'reg', 'verificar', 'verify', 'register'])
  let edades = Array.from({ length: 3 }, () => random(['10', '28', '20', '40', '18', '21', '15', '11', '9', '17', '25']))

  const mensajes = getMensajeSistema({ comando, verifyaleatorio, user2, edades })
  const msg = {
    rowner: mensajes.smsrowner,
    owner: mensajes.smsowner,
    mods: mensajes.smsmods,
    premium: mensajes.smspremium,
    group: mensajes.smsgroup,
    private: mensajes.smsprivate,
    admin: mensajes.smsadmin,
    botAdmin: mensajes.smsbotAdmin,
    unreg: mensajes.smsunreg,
    restrict: mensajes.smsrestrict
  }[type]

  if (msg) return conn.reply(m.chat, msg, m, fake).then(_ => m.react('✖️'))
}


const file = global.__filename(import.meta.url, true)
watchFile(file, async () => {
  unwatchFile(file)
  console.log(chalk.magenta("Se actualizó 'handler.js'"))
  if (global.conns?.length > 0) {
    const users = [...new Set(global.conns.filter(conn => conn.user && conn.ws.socket && conn.ws.socket.readyState !== ws.CLOSED))]
    for (const userr of users) userr.subreloadHandler(false)
  }
})