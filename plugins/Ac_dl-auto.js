import { exec } from 'child_process';
import fs from 'fs';
import path from 'path';

let handler = async (m, { conn, args, usedPrefix, command }) => {
  const url = args[0];
  const opt = args[1]?.toLowerCase(); // 'audio', 'video', o vacío
  const tempDir = '/tmp'; // Puedes cambiarlo
  const id = Date.now();
  const base = `${tempDir}/media_${id}`;
  const supported = /youtu\.?be|tiktok\.com|instagram\.com|facebook\.com|fb\.watch/;

  if (!url || !supported.test(url)) {
    return conn.reply(m.chat, `❌ Uso: ${usedPrefix}${command} <url> [audio|video]`, m);
  }

  m.react('⏳');

  const output = opt === 'audio' ? `${base}.mp3` : `${base}.%(ext)s`;
  const ytdlpCmd = opt === 'audio'
    ? `yt-dlp -f 'bestaudio' -x --audio-format mp3 -o "${base}.mp3" "${url}"`
    : `yt-dlp -f 'best' -o "${output}" "${url}"`;

  exec(ytdlpCmd, async (err, stdout, stderr) => {
    if (err) {
      // Si es TikTok y audio falla, intenta con video
      if (/Requested format is not available/.test(stderr) && opt === 'audio') {
        let fallbackCmd = `yt-dlp -f best -o "${base}.mp4" "${url}"`;
        return exec(fallbackCmd, async (e2, out2, err2) => {
          if (e2 || !fs.existsSync(`${base}.mp4`)) {
            return conn.reply(m.chat, `❌ No se pudo descargar el video/audio.\n\n${err2}`, m);
          }
          await conn.sendFile(m.chat, `${base}.mp4`, 'video.mp4', '🎬 Video de TikTok (audio no disponible)', m);
          fs.unlinkSync(`${base}.mp4`);
          return m.react('✅');
        });
      }

      return conn.reply(m.chat, `❌ Error al descargar:\n\n${stderr || err.message}`, m);
    }

    // Busca el archivo descargado
    const files = fs.readdirSync(tempDir).filter(f => f.includes(`media_${id}`));
    if (files.length === 0) {
      return conn.reply(m.chat, `❌ No se encontró el archivo descargado.`, m);
    }

    const filepath = `${tempDir}/${files[0]}`;
    const ext = path.extname(filepath).toLowerCase();

    let caption = '📎 Archivo descargado:';

    if (['.jpg', '.jpeg', '.png', '.webp'].includes(ext)) {
      caption = '🖼 Imagen descargada:';
    } else if (['.mp3', '.ogg', '.m4a'].includes(ext)) {
      caption = '🎧 Audio descargado:';
    } else if (['.mp4', '.mkv', '.webm'].includes(ext)) {
      caption = '🎥 Video descargado:';
    }

    await conn.sendFile(m.chat, filepath, path.basename(filepath), caption, m);
    fs.unlinkSync(filepath);
    m.react('✅');
  });
};

handler.command = ['dl-auto', 'dlaut'];
handler.help = ['dl-auto <url> [audio|video]'];
handler.tags = ['downloader'];
handler.limit = false;
handler.register = true;

export default handler;
