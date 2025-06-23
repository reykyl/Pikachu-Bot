import fs from 'fs';
import path from 'path';

const handler = async (m, { conn, args }) => {
  const patrones = args.length > 0 ? args : [
   // 'fs.rmdir(', 
    //'fs.rmdirSync(', 
    '.buffer(', 
    'new Buffer(', 
    'util.print('
  ];

  const nombres = {
    'fs.rmdir(': '📁 fs.rmdir (DEPRECATED)',
    'fs.rmdirSync(': '📁 fs.rmdirSync (DEPRECATED)',
    '.buffer(': '🟠 response.buffer() (usa arrayBuffer())',
    'new Buffer(': '🔴 new Buffer (usa Buffer.from)',
    'util.print(': '🟡 util.print (DEPRECATED)'
  };

  const dir = './plugins';
  let resultados = [];

  const buscarEnArchivos = (dir) => {
    const archivos = fs.readdirSync(dir);
    for (const archivo of archivos) {
      const rutaCompleta = path.join(dir, archivo);
      const stats = fs.statSync(rutaCompleta);

      if (stats.isDirectory()) {
        buscarEnArchivos(rutaCompleta);
      } else if (rutaCompleta.endsWith('.js')) {
        const contenido = fs.readFileSync(rutaCompleta, 'utf-8');
        const lineas = contenido.split('\n');
        lineas.forEach((linea, index) => {
          for (const patron of patrones) {
            if (linea.includes(patron)) {
              const nombre = nombres[patron] || `🧩 ${patron}`;
              resultados.push(`${nombre}\n📂 ${rutaCompleta} [línea ${index + 1}]: ${linea.trim()}\n`);
              break;
            }
          }
        });
      }
    }
  };

  buscarEnArchivos(dir);

  if (resultados.length === 0) {
    return m.reply(`✅ No se encontraron funciones obsoletas o peligrosas.`);
  }

  const salida = resultados.join('\n').slice(0, 4000); // WhatsApp límite
  return m.reply(`⚠️ *Deprecaciones encontradas:*\n\n${salida}`);
};

handler.command = ['buscardeprecados', 'scandepre', 'depredetect'];

export default handler;