import { exec } from 'child_process';
import fs from 'fs/promises';
import path from 'path';
import { promisify } from 'util';
import ytdl from '@distube/ytdl-core';

const execAsync = promisify(exec);

let handler = async (m, { conn, text }) => {
  if (!text || !text.includes('youtube.com') && !text.includes('youtu.be')) {
    return conn.reply(m.chat, '🧩 Proporciona un enlace válido de YouTube.', m);
  }

  try {
    // ✅ Obtener información del video
    const info = await ytdl.getInfo(text);
    const durationSeconds = parseInt(info.videoDetails.lengthSeconds);

    if (durationSeconds > 600) {
      return conn.reply(m.chat, '🚫 El video supera los 10 minutos. Usa otro más corto.', m);
    }

    const filename = `audio_${Date.now()}.mp3`;
    const output = path.resolve('./downloads/botsaaa/', filename);

    m.reply('🎧 Procesando descarga local...');

    // 🛠️ Descargar el audio
    await execAsync(`yt-dlp -x --audio-format mp3 -o "${output}" "${text}"`);

    // 📦 Validar el tamaño del archivo
    const stats = await fs.stat(output);
    const sizeMB = stats.size / (1024 * 1024);

    if (sizeMB > 50) {
      await fs.unlink(output);
      return conn.reply(m.chat, `❌ El archivo generado pesa más de 50 MB (${sizeMB.toFixed(2)} MB).`, m);
    }

    // 📤 Enviar el archivo
    await conn.sendFile(m.chat, output, filename, `✅ Aquí tienes tu audio (${sizeMB.toFixed(2)} MB).`, m);

    // 🧹 Eliminar el archivo temporal
    await fs.unlink(output);

  } catch (err) {
    console.error(err);
    conn.reply(m.chat, '⚠️ Error al procesar la descarga:\n' + err.message, m);
  }
};

handler.command = ['ytmp3', 'ytaudio'];
handler.help = ['ytlocal <enlace>'];
handler.tags = ['download'];
export default handler;
