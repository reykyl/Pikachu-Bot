let handler = async (m, { conn, args, usedPrefix, command }) => {
return conn.reply(m.chat,`*"APIs desarrolladas por Deylin"*

[1]
https://anime-xi-wheat.vercel.app/api/pinterest?q=
> pinterest: buscador de imágenes en Pinterest.

[2]
https://anime-xi-wheat.vercel.app/api/ia-img?prompt=
> generador de imágenes con IA.

[3]
https://g-mini-ia.vercel.app/api/gemini
> IA gemini responde preguntas, analiza imágenes, genera imágenes.

[4]
https://mode-ia.onrender.com/mode-ia?prompt=
> mode-ia inteligencia artificial para responder preguntas solo en texto.

[5]
https://Ytumode-api.vercel.app/api/search?q=
> busca contenido de YouTube.

[6]
https://mode-api-sigma.vercel.app/api/mp3?url=
> descarga audio de YouTube.
> *clausurado*

[7]
https://mode-api-sigma.vercel.app/api/index?url=
> descarga audio de YouTube.
> *clausurado*

Usa estas APIs con precaución evita el spam de solicitud en un determinado tiempo.
`, m, rcanal);


Handler.comad = ['api', 'apis', servicios]
