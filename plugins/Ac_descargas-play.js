import { exec } from 'child_process';
import fs from 'fs/promises';
import path from 'path';

let handler = async (m, { conn, text }) => {
    if (!text) return conn.reply(m.chat, '🎬 Proporciona un enlace de YouTube.', m);

    // Ruta de salida
    let output = path.join('downloads', 'videos', `video_${Date.now()}.mp4`);

    m.reply('📥 Procesando descarga del video...');

    // Comando yt-dlp para descargar el mejor video+audio combinado en MP4
    let command = `yt-dlp -f "bv*+ba[ext=m4a]/b[ext=mp4]" -o "${output}" "${text}"`;

    exec(command, async (err, stdout, stderr) => {
        if (err) {
            return conn.reply(m.chat, '❌ Error al descargar el video:\n\n' + stderr, m);
        }

        try {
            await conn.sendFile(m.chat, output, 'video.mp4', '🎬 Aquí tienes tu video descargado.', m);
            await fs.unlink(output); // Borra el archivo tras enviarlo
        } catch (e) {
            conn.reply(m.chat, '⚠️ Error al enviar el archivo:\n' + e.message, m);
        }
    });
};

handler.command = ['ytmp4', 'ytvideo'];
export default handler;
