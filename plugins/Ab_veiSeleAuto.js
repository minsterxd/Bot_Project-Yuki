let handler = async (m, { command }) => {
    const userId = m.sender;
    const estado = global.seleccionDeAuto?.[userId];
    if (!estado) return;

    const seleccion = command.toLowerCase();
    if (!estado.opciones.includes(seleccion)) {
        return m.reply(`🚫 No puedes elegir ese auto. Opciones válidas: ${estado.opciones.map(o => `#${o}`).join(', ')}`);
    }

    clearTimeout(estado.timeout);
    delete global.seleccionDeAuto[userId];
    estado.resolve(seleccion);
};

handler.command = ['mclaren720s', 'ferrari488pista', 'lamboavesvj'];
export default handler;
