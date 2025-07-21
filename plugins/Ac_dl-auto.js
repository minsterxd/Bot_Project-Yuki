import { exec } from 'child_process';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

let handler = async (m, { conn, args, usedPrefix, command }) => {
  const url = args[0];
  const opt = args[1]?.toLowerCase(); // 'audio' o 'video'
  const tempDir = './downloads/botsaaa/'; // O cualquier ruta válida en tu sistema

  if (!url) return conn.reply(m.chat, `Uso: ${usedPrefix}${command} <url> [audio|video]\nEj: ${usedPrefix}${command} https://youtube.com/watch?v=abc audio`, m);

  // Detecta plataforma
  const isYouTube = /youtu\.?be/.test(url);
  const isTikTok = /tiktok\.com/.test(url);
  const isInsta = /instagram\.com/.test(url);
  const isFacebook = /facebook\.com/.test(url) || /fb\.watch/.test(url);

  if (!(isYouTube || isTikTok || isInsta || isFacebook)) {
    return conn.reply(m.chat, `❌ Plataforma no soportada. Por ahora solo YouTube, TikTok, Instagram y Facebook.`, m);
  }

  const id = Date.now();
  const filename = `${tempDir}/media_${id}`;
  const output = opt === 'audio' ? `${filename}.mp3` : `${filename}.mp4`;
  const ytdlpCmd = opt === 'audio'
    ? `yt-dlp -f bestaudio -x --audio-format mp3 -o "${filename}.%(ext)s" "${url}"`
    : `yt-dlp -f mp4 -o "${filename}.%(ext)s" "${url}"`;

  m.react('⏳');

  exec(ytdlpCmd, async (err, stdout, stderr) => {
    if (err) {
      console.error('yt-dlp error:', err);
      return conn.reply(m.chat, `❌ Error al descargar: ${stderr || err.message}`, m);
    }

    if (!fs.existsSync(output)) {
      return conn.reply(m.chat, `❌ No se generó el archivo correctamente.`, m);
    }

    const caption = opt === 'audio' ? '🎧 Audio descargado:' : '📽️ Video descargado:';

    await conn.sendFile(m.chat, output, path.basename(output), caption, m);
    fs.unlinkSync(output); // Limpia el archivo temporal
    m.react('✅');
  });
};

handler.command = ['dl-auto', 'dlaut'];
handler.help = ['dl-auto <url> [audio|video]'];
handler.tags = ['downloader'];
handler.limit = false;
handler.register = true;

export default handler;
