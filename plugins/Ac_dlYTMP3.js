import { exec } from 'child_process';
import fs from 'fs/promises';
import path from 'path';

let handler = async (m, { conn, text }) => {
  if (!text) return conn.reply(m.chat, '🧩 Proporciona un enlace de YouTube.', m);

  let output = `./downloads/audio_${Date.now()}.mp3`;

  m.reply('🎧 Procesando descarga local...');

  exec(`yt-dlp -x --audio-format mp3 -o "${output}" "${text}"`, async (err, stdout, stderr) => {
    if (err) {
      return conn.reply(m.chat, '❌ Error al descargar el audio:\n\n' + stderr, m);
    }

    try {
      await conn.sendFile(m.chat, output, 'audio.mp3', null, m);
      await fs.unlink(output); // Elimina el archivo luego de enviarlo
    } catch (e) {
      conn.reply(m.chat, '⚠️ Error al enviar el archivo:\n' + e.message, m);
    }
  });
};

handler.command = ['ytlocal', 'ytaudio'];
export default handler;
