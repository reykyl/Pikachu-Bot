import webpmux from 'node-webpmux'

export async function addExif(webpBuffer, packname = 'Sticker Pack', author = 'Kirito-Bot') {
  const img = new webpmux.Image()
  await img.load(webpBuffer)

  const exif = {
    "sticker-pack-id": "com.kirito.bot",
    "sticker-pack-name": packname,
    "sticker-pack-publisher": author,
    "android-app-store-link": "https://play.google.com/store/apps/details?id=com.whatsapp",
    "ios-app-store-link": "https://apps.apple.com/app/whatsapp-messenger/id310633997"
  }

  const exifAttr = Buffer.concat([
    Buffer.from([0x49, 0x49, 0x2A, 0x00]),
    Buffer.alloc(4),
    Buffer.from(JSON.stringify(exif), 'utf-8')
  ])

  img.exif = exifAttr
  return await img.save(null)
}