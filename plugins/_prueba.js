import fs from 'fs';
import path from 'path';

const handler = async (m, { conn, args }) => {
  const textoBuscar = args[0] || 'fs.rmdir';
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
          if (linea.includes(textoBuscar)) {
            resultados.push(`${rutaCompleta} [línea ${index + 1}]: ${linea.trim()}`);
          }
        });
      }
    }
  };

  buscarEnArchivos(dir);

  if (resultados.length === 0) {
    return m.reply(`🔍 No se encontró "${textoBuscar}" en los plugins.`);
  }

  const salida = resultados.join('\n').slice(0, 4000); // límite para WhatsApp
  return m.reply(`📁 Resultados de "${textoBuscar}":\n\n${salida}`);
};

handler.command = ['buscar', 'scanplugin', 'buscarfs'];

export default handler;