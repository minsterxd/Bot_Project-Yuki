import { exec } from 'child_process';
import fs from 'fs';
import path from 'path';
import axios from 'axios';

let handler = async (m, { conn, args, usedPrefix, command }) => {
  const url = args[0];
  const opt = args[1]?.toLowerCase();
  const tempDir = './downloads/botsaaa/';
  const id = Date.now();
  const base = `${tempDir}/media_${id}`;
  const supported = /youtu\.?be|tiktok\.com|instagram\.com|facebook\.com|fb\.watch/;

  if (!url || !supported.test(url)) {
    return conn.reply(m.chat, `❌ Uso: ${usedPrefix}${command} <url> [audio|video]`, m);
  }

  m.react('⏳');

  try {
    // Paso 1: obtener la URL directa del archivo
    const cmdDetect = `yt-dlp --skip-download --print "%(url)s" "${url}"`;
    exec(cmdDetect, async (err, stdout, stderr) => {
      if (err || !stdout) {
        return conn.reply(m.chat, `❌ No se pudo detectar contenido multimedia.\n${stderr || err.message}`, m);
      }

      const directUrl = stdout.trim();
      const ext = path.extname(directUrl).split('?')[0].toLowerCase();

      // Paso 2: manejar imágenes directamente
      const imageExts = ['.jpg', '.jpeg', '.png', '.webp'];
      const audioExts = ['.mp3', '.m4a', '.ogg'];
      const videoExts = ['.mp4', '.webm', '.mov'];

      const filepath = `${base}${ext}`;
      const writer = fs.createWriteStream(filepath);

      const res = await axios({
        method: 'get',
        url: directUrl,
        responseType: 'stream'
      });

      res.data.pipe(writer);
      writer.on('finish', async () => {
        let caption = '📎 Archivo descargado:';

        if (imageExts.includes(ext)) caption = '🖼 Imagen descargada:';
        else if (audioExts.includes(ext)) caption = '🎧 Audio descargado:';
        else if (videoExts.includes(ext)) caption = '🎥 Video descargado:';

        await conn.sendFile(m.chat, filepath, path.basename(filepath), caption, m);
        fs.unlinkSync(filepath);
        return m.react('✅');
      });

      writer.on('error', e => {
        return conn.reply(m.chat, `❌ Error al guardar el archivo.\n${e.message}`, m);
      });
    });

  } catch (e) {
    return conn.reply(m.chat, `❌ Error inesperado:\n${e.message}`, m);
  }
};

handler.command = ['dl-auto', 'dlaut'];
handler.help = ['dl-auto <url> [audio|video]'];
handler.tags = ['downloader'];
handler.limit = false;
handler.register = true;

export default handler;
