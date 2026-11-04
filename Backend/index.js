import express from 'express';
import cors from 'cors';
import { supabase } from './src/db/supabaseClient.js';
import { getShuffledBank } from './questions.js';

const app = express();

// --- CONFIGURACIÓN DE CORS PARA PRODUCCIÓN ---
const allowedOrigins = [
  'http://localhost:5173', // Desarrollo local
  'http://localhost:3000', // Por si acaso
  process.env.FRONTEND_URL // URL de Vercel (se configura en Render)
];

app.use(cors({
  origin: function (origin, callback) {
    // Permitir peticiones sin origin (Postman, apps móviles, etc.)
    if (!origin) return callback(null, true);
    
    // Si FRONTEND_URL no está configurado, permitimos todo (útil en el primer deploy)
    if (!process.env.FRONTEND_URL) {
      return callback(null, true);
    }
    
    // Si el origin está en la lista, lo permitimos
    if (allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      console.log('Bloqueado por CORS:', origin);
      callback(new Error('No permitido por CORS'));
    }
  },
  credentials: true
}));

app.use(express.json());

const PORT = process.env.PORT || 3001;

// --- MODO TESTEO ---
// Cambia a 1 para producción (puntos normales)
// Cambia a 10 o 15 para testear rápido (llega al clímax en 3-4 preguntas)
const TEST_MULTIPLIER = 2; 

// --- ESTADO EN MEMORIA PARA LAS PREGUNTAS ---
const sessionQueues = {};

// --- FUNCIONES AUXILIARES ---
async function generateUniquePin() {
  for (let i = 0; i < 20; i++) {
    const pin = String(Math.floor(1000 + Math.random() * 9000));
    const { data } = await supabase
      .from('sessions')
      .select('id')
      .eq('pin', pin)
      .maybeSingle();
    if (!data) return pin;
  }
  throw new Error('No se pudo generar un PIN único');
}

// Función para lanzar una ronda
async function lanzarRonda(sessionId, roundNumber) {
  // Verificamos si la sesión sigue activa antes de lanzar
  const { data: session } = await supabase.from('sessions').select('status').eq('id', sessionId).single();
  if (session && session.status !== 'playing') return;

  if (!sessionQueues[sessionId]) {
    sessionQueues[sessionId] = getShuffledBank();
  }

  // Calculamos el índice de la pregunta (si pasan de 40, vuelve a empezar)
  const questionIndex = (roundNumber - 1) % sessionQueues[sessionId].length;
  
  // Si el índice es 0 y ya pasó la primera ronda, significa que se acabaron las preguntas
  // y volvemos a mezclar el banco para que no se repitan en el mismo orden.
  if (questionIndex === 0 && roundNumber > 1) {
    sessionQueues[sessionId] = getShuffledBank();
  }

  const roundData = sessionQueues[sessionId][questionIndex];

  const { data: round, error: roundErr } = await supabase
    .from('rounds')
    .insert({
      session_id: sessionId,
      round_number: roundNumber,
      kind: roundData.kind,
      payload: roundData.payload,
      points: roundData.points,
      started_at: new Date().toISOString(),
      duration_ms: 20000
    })
    .select()
    .single();

  if (roundErr) {
    console.error('Error creando ronda:', roundErr);
    return;
  }

  console.log(`Ronda ${roundNumber} lanzada para sesión ${sessionId}`);

  const cerrarRonda = async () => {
    const { data: currentRound } = await supabase.from('rounds').select('ended_at').eq('id', round.id).single();
    if (currentRound && currentRound.ended_at) return; 

    await supabase.from('rounds').update({ ended_at: new Date().toISOString() }).eq('id', round.id);

    setTimeout(async () => {
      const { data: sess } = await supabase.from('sessions').select('status').eq('id', sessionId).single();
      if (sess && sess.status === 'playing') {
        lanzarRonda(sessionId, roundNumber + 1);
      }
    }, 14000);
  };

  sessionQueues[`${sessionId}_current_close`] = cerrarRonda;
  setTimeout(cerrarRonda, 20000);
}

// --- RUTAS ---

app.post('/api/sessions', async (req, res) => {
  try {
    const pin = await generateUniquePin();
    const { data: session, error } = await supabase.from('sessions').insert({ pin, status: 'lobby' }).select().single();
    if (error) throw error;
    res.json({ id: session.id, pin: session.pin });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'No se pudo crear la sesión' });
  }
});

app.post('/api/sessions/:pin/join', async (req, res) => {
  const { pin } = req.params;
  const { name } = req.body;

  if (!name || name.trim().length < 2) return res.status(400).json({ error: 'Nombre inválido' });

  try {
    const { data: session, error: sessErr } = await supabase.from('sessions').select('*').eq('pin', pin).maybeSingle();
    if (sessErr) throw sessErr;
    if (!session) return res.status(404).json({ error: 'PIN no encontrado' });
    if (session.status !== 'lobby') return res.status(400).json({ error: 'La partida ya comenzó' });

    const { data: player, error: plyErr } = await supabase
      .from('players')
      .insert({ session_id: session.id, name: name.trim().toUpperCase() })
      .select()
      .single();

    if (plyErr) {
      if (plyErr.code === '23505') return res.status(400).json({ error: 'Ese nombre ya está en uso' });
      throw plyErr;
    }

    res.json({ playerId: player.id, sessionId: session.id, name: player.name });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error al unirse a la sesión' });
  }
});

app.get('/api/sessions/:pin', async (req, res) => {
  const { pin } = req.params;
  try {
    const { data: session, error: sessErr } = await supabase.from('sessions').select('*').eq('pin', pin).maybeSingle();
    if (sessErr) throw sessErr;
    if (!session) return res.status(404).json({ error: 'PIN no encontrado' });

    const { data: players, error: plyErr } = await supabase.from('players').select('id, name, altitude, joined_at').eq('session_id', session.id).order('joined_at', { ascending: true });
    if (plyErr) throw plyErr;

    res.json({ session, players });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error al consultar la sesión' });
  }
});

app.post('/api/sessions/:pin/start', async (req, res) => {
  const { pin } = req.params;
  try {
    const { data: session, error: sessErr } = await supabase.from('sessions').select('*').eq('pin', pin).maybeSingle();
    if (sessErr) throw sessErr;
    if (!session) return res.status(404).json({ error: 'PIN no encontrado' });

    delete sessionQueues[session.id];
    await supabase.from('sessions').update({ status: 'playing' }).eq('id', session.id);
    lanzarRonda(session.id, 1);

    res.json({ success: true, message: 'Juego iniciado' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'No se pudo iniciar el juego' });
  }
});

app.post('/api/rounds/:roundId/answer', async (req, res) => {
  const { roundId } = req.params;
  const { playerId, choice } = req.body;

  try {
    const { data: round, error: roundErr } = await supabase.from('rounds').select('*').eq('id', roundId).single();
    if (roundErr || !round) throw new Error('Ronda no encontrada');
    if (round.ended_at) return res.status(400).json({ error: 'La ronda ya terminó' });

    const started = new Date(round.started_at).getTime();
    const now = new Date().getTime();
    const elapsedSeconds = Math.floor((now - started) / 1000);
    
    // PUNTOS BASE CON MULTIPLICADOR DE TESTEO
    const basePoints = (round.points || 100) * TEST_MULTIPLIER;
    
    // Bono por velocidad: máximo un 50% extra si responde al instante
    const timeBonus = Math.max(0, 1 - (elapsedSeconds / 20)) * (basePoints * 0.5);
    const totalPoints = Math.round(basePoints + timeBonus);

    const isCorrect = round.payload.correct_index === choice;
    const altitudeGain = isCorrect ? totalPoints : 0;

    const { error: ansErr } = await supabase.from('answers').insert({
      round_id: roundId,
      player_id: playerId,
      choice: choice,
      is_correct: isCorrect,
      response_ms: elapsedSeconds * 1000,
      altitude_gain: altitudeGain
    });

    if (ansErr) {
      if (ansErr.code === '23505') return res.status(400).json({ error: 'Ya respondiste a esta ronda' });
      throw ansErr;
    }

    if (isCorrect) {
      const { data: player } = await supabase.from('players').select('altitude').eq('id', playerId).single();
      const newAltitude = Math.min(5800, player.altitude + altitudeGain);
      await supabase.from('players').update({ altitude: newAltitude }).eq('id', playerId);

      // LÓGICA DE CLÍMAX CON RETRASO
      if (newAltitude >= 5800) {
        console.log('¡Alguien llegó a los 5800m! Programando clímax en 3.5 segundos...');
        
        // 1. Cerramos la ronda actual inmediatamente para detener el juego
        await supabase.from('rounds').update({ ended_at: new Date().toISOString() }).eq('id', round.id);
        
        // 2. Esperamos 3.5 segundos (tiempo para que el proyector anime la subida) y luego cambiamos el estado
        setTimeout(async () => {
          await supabase.from('sessions').update({ status: 'climax' }).eq('id', round.session_id);
        }, 3500);

        return res.json({ success: true, isCorrect, altitudeGain, climax: true });
      }
    }

    const { count: totalPlayers } = await supabase.from('players').select('*', { count: 'exact', head: true }).eq('session_id', round.session_id);
    const { count: totalAnswers } = await supabase.from('answers').select('*', { count: 'exact', head: true }).eq('round_id', round.id);

    if (totalAnswers >= totalPlayers) {
      const closeFn = sessionQueues[`${round.session_id}_current_close`];
      if (closeFn) closeFn();
    }

    res.json({ success: true, isCorrect, altitudeGain });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error al procesar respuesta' });
  }
});

app.listen(PORT, () => {
  console.log(`Backend escuchando en http://localhost:${PORT}`);
});