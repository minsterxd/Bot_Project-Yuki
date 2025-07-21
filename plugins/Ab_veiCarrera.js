import { promises as fs } from 'fs';

let handler = async (m, { conn }) => {
  const cancelTimeout = 30000;
  const tickDelay = 1000;
  const totalTicks = 10;
  const emoji = '🏁';

  const a = m.sender;
  const b = m.mentionedJid?.[0];
  if (!b) return conn.reply(m.chat, `${emoji} Mencioná a tu rival: #carrera @usuario`, m);

  const uA = global.db.data.users[a];
  const uB = global.db.data.users[b];
  if (!uA || !uB) return conn.reply(m.chat, `${emoji} Ambos usuarios deben estar registrados.`, m);

  const have10 = u => ((u.mclaren720s||0)>=10||(u.ferrari488pista||0)>=10||(u.lamboavesvj||0)>=10);
  if (!have10(uA) || !have10(uB)) return conn.reply(m.chat, `${emoji} Ambos deben tener un auto con al menos 10 usos.`, m);

  // ✔ Pedir selección de auto
  const autosUsr = u => {
    const arr = [];
    if ((u.mclaren720s || 0) >= 10) arr.push("McLaren720s");
    if ((u.ferrari488pista || 0) >= 10) arr.push("Ferrari488Pista");
    if ((u.lamboavesvj || 0) >= 10) arr.push("LamboAventadorSVJ");
    return arr;
  };
  const selA = await askForAuto(a, autosUsr(uA));
  if (!selA) return conn.reply(m.chat, `${emoji} @${a.split('@')[0]} no seleccionó auto a tiempo, carrera cancelada.`, m);
  const selB = await askForAuto(b, autosUsr(uB));
  if (!selB) return conn.reply(m.chat, `${emoji} @${b.split('@')[0]} no seleccionó auto a tiempo, carrera cancelada.`, m);

  // ✔ Comenzar carrera
  uA[selA] -= 10;
  uB[selB] -= 10;

  let pA = 0, pB = 0;
  let mId = null;

  const bar = v => `[${'='.repeat(v)}${'-'.repeat(totalTicks - v)}] ${v * 10}%`;

  const initMsg = await conn.sendMessage(m.chat, {
    text:
`${emoji} Carrera entre @${a.split('@')[0]} y @${b.split('@')[0]} usando *${selA}* vs *${selB}*.
  
Corredor A: ${bar(pA)}
Corredor B: ${bar(pB)}`,
  }, { mentions: [a, b] });

  mId = initMsg.key;

  // ✔ Ciclo de carrera en interval
  const interval = setInterval(async () => {
    if (Math.random() < 0.75 && pA < totalTicks) pA++;
    if (Math.random() < 0.75 && pB < totalTicks) pB++;

    await conn.sendMessage(m.chat, {
      edit: mId,
      text:
`${emoji} Carrera en progreso...

Corredor A: ${bar(pA)}
Corredor B: ${bar(pB)}`,
    });

    if (pA >= totalTicks || pB >= totalTicks) {
      clearInterval(interval);
      const winner = pA >= totalTicks ? a : b;
      const loser = winner === a ? b : a;
      global.db.data.users[winner].coin += 100;
      global.db.data.users[loser].coin -= 50;

      await conn.sendMessage(m.chat, {
        text: `🏆 ¡@${winner.split('@')[0]} gana la carrera! Recibe 50 monedas del rival y 50 del bot.`,
      }, { mentions: [winner] });
    }
  }, tickDelay);

  // Función interna para pedir auto
  async function askForAuto(userJID, options) {
    await conn.sendMessage(userJID, { text: `Elige auto para la carrera: ${options.join(', ')}` });
    try {
      const res = await conn.awaitMessage(userJID, cancelTimeout, msg =>
        options.includes(msg.text.trim())
      );
      return res.text.trim();
    } catch {
      return null;
    }
  }
};

handler.command = ['carrera'];
handler.group = true;
handler.register = true;
export default handler;
