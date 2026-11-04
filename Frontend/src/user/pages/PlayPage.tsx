import { useEffect, useState, useRef } from 'react';
import { useParams } from 'react-router-dom';
import { supabase } from '../../lib/supabaseClient';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

interface RoundPayload {
  prompt: string;
  plant?: string;
  options: string[];
  correct_index: number;
}

interface Round {
  id: string;
  kind: 'matching' | 'trivia';
  payload: RoundPayload;
  ended_at: string | null;
}

export default function PlayPage() {
  const { sessionId } = useParams();
  const name = localStorage.getItem('playerName');
  const playerId = localStorage.getItem('playerId');
  
  const [status, setStatus] = useState('lobby');
  const [currentRound, setCurrentRound] = useState<Round | null>(null);
  const [hasAnswered, setHasAnswered] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [roundEnded, setRoundEnded] = useState(false);

  // Estados para el Soroche
  const [altitude, setAltitude] = useState(0);
  const [isSoroche, setIsSoroche] = useState(false);
  const [eyeBlink, setEyeBlink] = useState(false);
  const [buttonPositions, setButtonPositions] = useState<number[]>([0, 0, 0, 0]);

  // 1. Escuchar altitud del jugador
  useEffect(() => {
    if (!playerId) return;
    const channel = supabase
      .channel(`player-data-${playerId}`)
      .on('postgres_changes', { event: 'UPDATE', schema: 'public', table: 'players', filter: `id=eq.${playerId}` }, (payload) => {
        setAltitude(payload.new.altitude);
      })
      .subscribe();
    return () => { supabase.removeChannel(channel); };
  }, [playerId]);

  // 2. Efectos de Soroche
  useEffect(() => {
    if (altitude >= 4000) {
      setIsSoroche(true);
      // Vibrar levemente cada 5 segundos
      const vibrateInterval = setInterval(() => {
        if (navigator.vibrate) navigator.vibrate([200, 100, 200]);
      }, 5000);

      // Efecto de pestañeo (pantalla negra)
      const blinkInterval = setInterval(() => {
        setEyeBlink(true);
        setTimeout(() => setEyeBlink(false), 400); // 400ms de negro
      }, 8000);

      // Mover botones aleatoriamente
      const moveButtonsInterval = setInterval(() => {
        setButtonPositions([...Array(4)].map(() => Math.floor(Math.random() * 20) - 10)); // -10px a 10px
      }, 3000);

      return () => {
        clearInterval(vibrateInterval);
        clearInterval(blinkInterval);
        clearInterval(moveButtonsInterval);
      };
    } else {
      setIsSoroche(false);
      setEyeBlink(false);
      setButtonPositions([0, 0, 0, 0]);
    }
  }, [altitude]);

  // 3. Realtime de la sesión y rondas
  useEffect(() => {
    if (!sessionId) return;
    const sessionChannel = supabase
      .channel(`player-session-${sessionId}`)
      .on('postgres_changes', { event: 'UPDATE', schema: 'public', table: 'sessions', filter: `id=eq.${sessionId}` }, (payload) => {
        setStatus(payload.new.status);
      })
      .subscribe();

    const roundChannel = supabase
      .channel(`player-round-${sessionId}`)
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'rounds', filter: `session_id=eq.${sessionId}` }, (payload) => {
        setCurrentRound(payload.new as Round);
        setHasAnswered(false);
        setRoundEnded(false);
      })
      .on('postgres_changes', { event: 'UPDATE', schema: 'public', table: 'rounds', filter: `session_id=eq.${sessionId}` }, (payload) => {
        if (payload.new.ended_at) setRoundEnded(true);
      })
      .subscribe();

    return () => {
      supabase.removeChannel(sessionChannel);
      supabase.removeChannel(roundChannel);
    };
  }, [sessionId]);

  const submitAnswer = async (choiceIndex: number) => {
    if (hasAnswered || roundEnded || !currentRound || !playerId || status === 'climax') return; 
    setHasAnswered(true);
    setIsSubmitting(true);

    try {
      const res = await fetch(`${API_URL}/api/rounds/${currentRound.id}/answer`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ playerId, choice: choiceIndex }),
      });
      if (!res.ok) throw new Error('Error al enviar respuesta');
    } catch (err) {
      console.error(err);
      setHasAnswered(false);
    } finally {
      setIsSubmitting(false);
    }
  };

  // --- VISTAS ---

  // 1. Clímax (Grieta Infranqueable)
  if (status === 'climax') {
    return (
      <div className="flex min-h-[100dvh] flex-col items-center justify-center bg-black text-red-500 p-6 text-center z-50 fixed inset-0">
        <div className="animate-pulse">
          <h1 className="font-display text-4xl mb-4">ERROR DE SISTEMA</h1>
          <p className="font-mono text-lg border-2 border-red-500 p-4 rounded-lg bg-red-950/30">
            &gt; Grieta infranqueable detectada.<br/>
            &gt; Altitud máxima alcanzada: 5800m.<br/>
            &gt; Conexión con la expedición perdida.
          </p>
        </div>
      </div>
    );
  }

  // 2. Pantalla de espera
  if (status === 'lobby' || !currentRound) {
    return (
      <div className="flex min-h-[100dvh] items-center justify-center bg-forest-900 text-white p-6 text-center">
        <div>
          <h1 className="font-display text-4xl">¡HOLA, {name}!</h1>
          <p className="mt-6 text-lg text-tropic-yellow animate-pulse">
            {status === 'playing' ? 'Esperando siguiente ronda...' : 'Esperando inicio de partida...'}
          </p>
        </div>
      </div>
    );
  }

  // 3. Tiempo agotado
  if (roundEnded && !hasAnswered) {
    return (
      <div className="flex min-h-[100dvh] flex-col items-center justify-center bg-forest-900 text-white p-6 text-center">
        <div className="mb-6 text-6xl">⏳</div>
        <h1 className="font-display text-3xl text-red-500">¡TIEMPO AGOTADO!</h1>
        <p className="mt-4 text-sm text-white/70">No lograste responder a tiempo.</p>
      </div>
    );
  }

  // 4. Respuesta enviada
  if (hasAnswered) {
    return (
      <div className="flex min-h-[100dvh] flex-col items-center justify-center bg-forest-900 text-white p-6 text-center">
        <div className="animate-bounce mb-6"><span className="text-6xl">⛰️</span></div>
        <h1 className="font-display text-3xl text-leaf-400">¡RESPUESTA ENVIADA!</h1>
        <p className="mt-4 text-sm text-white/70">
          {roundEnded ? 'Mira la pantalla principal...' : 'Esperando a que termine el tiempo...'}
        </p>
      </div>
    );
  }

  // 4. Botones con efectos de Soroche
  return (
    <div className={`flex min-h-[100dvh] flex-col bg-forest-900 text-white p-4 transition-colors duration-1000 ${isSoroche ? 'bg-blue-900/40' : ''}`}>
      
      {/* Capa de pestañeo (Sueño/Congelamiento) */}
      {eyeBlink && <div className="fixed inset-0 bg-black z-50 pointer-events-none transition-opacity duration-100"></div>}

      {/* Capa visual de hielo (Soroche) */}
      {isSoroche && (
        <div className="fixed inset-0 pointer-events-none z-0 opacity-30" 
             style={{ background: 'radial-gradient(circle, transparent 20%, rgba(173, 216, 230, 0.4) 80%)' }}>
        </div>
      )}

      <header className="mb-4 text-center z-10 relative">
        <h1 className="font-display text-xl text-tropic-yellow">{name}</h1>
        {isSoroche ? (
          <p className="text-xs text-red-400 font-bold animate-pulse">¡SOROCHE! Altitud: {altitude}m</p>
        ) : (
          <p className="text-xs text-leaf-400">Elige tu respuesta</p>
        )}
      </header>

      <main className={`grid flex-1 grid-cols-1 gap-4 sm:grid-cols-2 z-10 relative ${isSoroche ? 'animate-[shake_0.5s_ease-in-out_infinite]' : ''}`}>
        {currentRound.payload.options.map((_, index) => {
          const colors = [
            'bg-red-500 hover:bg-red-400',
            'bg-blue-500 hover:bg-blue-400',
            'bg-yellow-500 hover:bg-yellow-400',
            'bg-green-500 hover:bg-green-400'
          ];
          const shapes = ['▲', '◆', '●', '■'];

          // Transformación por soroche (mueve los botones)
          const tx = isSoroche ? buttonPositions[index] : 0;
          const ty = isSoroche ? buttonPositions[(index + 1) % 4] : 0;

          return (
            <button
              key={index}
              disabled={isSubmitting}
              onClick={() => submitAnswer(index)}
              className={`${colors[index % colors.length]} flex flex-col items-center justify-center rounded-3xl border-4 border-black shadow-brutal transition-all active:translate-y-1 active:shadow-brutal-sm disabled:opacity-50`}
              style={{ transform: `translate(${tx}px, ${ty}px)` }}
            >
              <span className="text-5xl mb-2 text-black/50">{shapes[index % shapes.length]}</span>
              <span className="font-display text-2xl text-black">OPCIÓN {index + 1}</span>
            </button>
          );
        })}
      </main>
    </div>
  );
}