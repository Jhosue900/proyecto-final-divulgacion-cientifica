import { useEffect, useState, useRef } from 'react';
import { useParams } from 'react-router-dom';
import { supabase } from '../../lib/supabaseClient';
import mountainBg from '../../assets/mountain-bg.jpg';
import naturgemaldeReal from '../../assets/naturgemalde-real.jpg'; // <-- NUEVA IMAGEN

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

interface Player {
  id: string;
  name: string;
  altitude: number;
}

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

// --- COMPONENTE DE ANIMACIÓN ---
function AnimatedPlayer({ 
  player, 
  index, 
  totalPlayers, 
  startAltitude 
}: { 
  player: Player, 
  index: number, 
  totalPlayers: number,
  startAltitude: number 
}) {
  const [visualAltitude, setVisualAltitude] = useState(startAltitude);
  const maxAltitude = 5800;

  useEffect(() => {
    const startDelay = setTimeout(() => {
      const start = startAltitude;
      const target = player.altitude;

      if (start >= target) {
        setVisualAltitude(target);
        return;
      }

      const duration = 1500;
      const startTime = performance.now();

      const animate = (currentTime: number) => {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        const easeOut = 1 - Math.pow(1 - progress, 3);
        
        const current = Math.floor(start + (target - start) * easeOut);
        setVisualAltitude(current);

        if (progress < 1) {
          requestAnimationFrame(animate);
        } else {
          setVisualAltitude(target);
        }
      };

      requestAnimationFrame(animate);
    }, 1000);

    return () => clearTimeout(startDelay);
  }, [player.altitude, startAltitude]);

  const laneCount = Math.min(totalPlayers, 9); 
  const laneIndex = index % laneCount;
  const leftPercent = 15 + (laneIndex * (70 / Math.max(1, laneCount - 1)));
  
  const heightPercent = Math.min(10 + (visualAltitude / maxAltitude) * 80, 90); 

  return (
    <div 
      className="absolute flex flex-col items-center transition-all duration-75"
      style={{ bottom: `${heightPercent}%`, left: `${leftPercent}%`, transform: 'translateX(-50%)' }}
    >
      <div className="bg-tropic-yellow text-black border-4 border-black rounded-full px-4 py-1 font-display text-sm md:text-lg shadow-brutal whitespace-nowrap z-20">
        {index + 1}. {player.name} ({visualAltitude}m)
      </div>
      <div className="h-8 w-1 bg-black mt-1 relative z-10">
        <div className="absolute -bottom-1 -left-1 w-3 h-3 bg-black rotate-45"></div>
      </div>
    </div>
  );
}
// ----------------------------------------

export default function AdminSession() {
  const { pin } = useParams<{ pin: string }>();
  const [players, setPlayers] = useState<Player[]>([]);
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [status, setStatus] = useState('lobby');
  const [starting, setStarting] = useState(false);
  const [activeRound, setActiveRound] = useState<Round | null>(null);
  const [timeLeft, setTimeLeft] = useState(20);
  const [phase, setPhase] = useState<'question' | 'reveal' | 'ranking'>('question');

  const [snapshotAltitudes, setSnapshotAltitudes] = useState<Record<string, number>>({});
  
  // Estado para la transición al mapa real
  const [showRealMap, setShowRealMap] = useState(false);

  // 1. Carga inicial
  useEffect(() => {
    if (!pin) return;
    fetch(`${API_URL}/api/sessions/${pin}`)
      .then((r) => r.json())
      .then((data) => {
        if (data.session) {
          setSessionId(data.session.id);
          setStatus(data.session.status);
        }
        if (data.players) {
          setPlayers(data.players);
          const initialSnapshot: Record<string, number> = {};
          data.players.forEach((p: Player) => { initialSnapshot[p.id] = p.altitude; });
          setSnapshotAltitudes(initialSnapshot);
        }
      })
      .catch(console.error);
  }, [pin]);

  // 2. Realtime: Sesión
  useEffect(() => {
    if (!sessionId) return;
    const channel = supabase
      .channel(`admin-session-${sessionId}`)
      .on('postgres_changes', { event: 'UPDATE', schema: 'public', table: 'sessions', filter: `id=eq.${sessionId}` }, (payload) => {
        setStatus(payload.new.status);
      })
      .subscribe();
    return () => { supabase.removeChannel(channel); };
  }, [sessionId]);

  // 3. Realtime: Jugadores
  useEffect(() => {
    if (!sessionId) return;
    const channel = supabase
      .channel(`admin-players-${sessionId}`)
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'players', filter: `session_id=eq.${sessionId}` }, (payload) => {
        const newPlayer = payload.new as Player;
        setPlayers((prev) => [...prev, newPlayer]);
        setSnapshotAltitudes((prev) => ({ ...prev, [newPlayer.id]: 0 }));
      })
      .on('postgres_changes', { event: 'UPDATE', schema: 'public', table: 'players', filter: `session_id=eq.${sessionId}` }, (payload) => {
        setPlayers((prev) => prev.map(p => p.id === payload.new.id ? payload.new as Player : p));
      })
      .subscribe();
    return () => { supabase.removeChannel(channel); };
  }, [sessionId]);

  // 4. Realtime: Rondas
  useEffect(() => {
    if (!sessionId) return;
    const channel = supabase
      .channel(`admin-rounds-${sessionId}`)
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'rounds', filter: `session_id=eq.${sessionId}` }, (payload) => {
        setActiveRound(payload.new as Round);
        setPhase('question');
      })
      .on('postgres_changes', { event: 'UPDATE', schema: 'public', table: 'rounds', filter: `session_id=eq.${sessionId}` }, (payload) => {
        if (payload.new.ended_at) {
          setActiveRound(payload.new as Round);
          setPhase('reveal');
          setTimeout(() => setPhase('ranking'), 4000);
        }
      })
      .subscribe();
    return () => { supabase.removeChannel(channel); };
  }, [sessionId]);

  // 4.5. Guardar snapshot cuando empieza una NUEVA ronda
  useEffect(() => {
    if (phase === 'question' && players.length > 0) {
      const newSnapshot: Record<string, number> = {};
      players.forEach((p) => { newSnapshot[p.id] = p.altitude; });
      setSnapshotAltitudes(newSnapshot);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeRound?.id, phase]);

  // 5. Temporizador
  useEffect(() => {
    if (!activeRound || activeRound.ended_at || phase !== 'question') return;
    setTimeLeft(20);
    const timer = setInterval(() => setTimeLeft((prev) => (prev > 0 ? prev - 1 : 0)), 1000);
    return () => clearInterval(timer);
  }, [activeRound, phase]);

  // 6. Temporizador para la transición al mapa real
  useEffect(() => {
    if (status === 'climax') {
      const timer = setTimeout(() => {
        setShowRealMap(true);
      }, 6500); // 6.5 segundos
      return () => clearTimeout(timer);
    } else {
      setShowRealMap(false);
    }
  }, [status]);

  const startGame = async () => {
    if (!pin || starting) return;
    setStarting(true);
    try {
      await fetch(`${API_URL}/api/sessions/${pin}/start`, { method: 'POST' });
      setStarting(false);
    } catch (err) {
      alert('No se pudo iniciar la partida');
      setStarting(false);
    }
  };

  // ==========================================
  // VISTA CLÍMAX (NATURGEMÄLDE + TRANSICIÓN)
  // ==========================================
  if (status === 'climax') {
    // Si ya pasaron los 6.5 segundos, mostramos la imagen real
    if (showRealMap) {
      return (
        <div className="relative min-h-[100dvh] w-full bg-black flex items-center justify-center overflow-hidden animate-fade-in duration-1000">
          {/* Imagen real del Naturgemälde */}
          <img 
            src={naturgemaldeReal}
            alt="Naturgemälde original de Alexander von Humboldt"
            className="w-full h-full object-contain animate-zoom-slow"
          />
          
          {/* Overlay con texto final */}
          <div className="absolute bottom-8 left-1/2 -translate-x-1/2 bg-black/80 border-4 border-tropic-yellow px-8 py-3 rounded-full shadow-brutal text-center animate-fade-in-up" style={{ animationDelay: '1s' }}>
            <p className="font-display text-xl md:text-3xl text-white">
              EL LEGADO DE HUMBOLDT
            </p>
          </div>
        </div>
      );
    }

    // Si aún no pasan los 6.5s, mostramos la animación de los nodos
    const mainNodes = [
      { id: 'selva', name: 'Selva Tropical', alt: '0 - 1500m', temp: '25°C - 18°C', top: '85%', left: '15%', color: 'bg-green-600', text: 'text-white', delay: '0.2s' },
      { id: 'bosque', name: 'Bosque Montano', alt: '1500 - 2500m', temp: '18°C - 12°C', top: '68%', left: '35%', color: 'bg-emerald-600', text: 'text-white', delay: '1.0s' },
      { id: 'paramo', name: 'Páramo', alt: '3000 - 4500m', temp: '12°C - 3°C', top: '45%', left: '65%', color: 'bg-yellow-500', text: 'text-black', delay: '1.8s' },
      { id: 'nieve', name: 'Nieve / Líquenes', alt: '4500 - 5800m', temp: '3°C - -10°C', top: '22%', left: '45%', color: 'bg-blue-300', text: 'text-black', delay: '2.6s' }
    ];

    const detailNodes = [
      { id: 'd1', text: 'Orquídeas', top: '90%', left: '30%', delay: '0.4s' },
      { id: 'd2', text: 'Helechos Arbóreos', top: '78%', left: '5%', delay: '0.6s' },
      { id: 'd3', text: 'Bromelias', top: '75%', left: '50%', delay: '0.8s' },
      { id: 'd4', text: 'Musgos', top: '60%', left: '20%', delay: '1.2s' },
      { id: 'd5', text: 'Achupallas (Puya)', top: '55%', left: '45%', delay: '1.4s' },
      { id: 'd6', text: 'Frailejones', top: '40%', left: '80%', delay: '1.6s' },
      { id: 'd7', text: 'Chuquiragua', top: '35%', left: '55%', delay: '2.0s' },
      { id: 'd8', text: 'Líquenes de roca', top: '15%', left: '60%', delay: '2.2s' },
      { id: 'd9', text: 'Temperatura: -10°C', top: '12%', left: '30%', delay: '2.8s', isData: true },
      { id: 'd10', text: 'Límite Humboldt (1802)', top: '25%', left: '35%', delay: '3.0s', isData: true },
    ];

    return (
      <div 
        className={`relative min-h-[100dvh] w-full overflow-hidden flex flex-col items-center justify-center transition-all duration-[2000ms] ease-in-out ${showRealMap ? 'bg-black opacity-0' : 'opacity-100'}`}
        style={{ backgroundImage: `url(${mountainBg})`, backgroundSize: 'cover', backgroundPosition: 'center' }}
      >
        <div className="absolute inset-0 bg-black/30 z-0"></div>

        <div className="relative z-20 text-center pt-6 px-4 animate-fade-in-down w-full max-w-4xl">
          <h2 className="font-display text-4xl md:text-6xl text-tropic-yellow drop-shadow-[0_4px_0_#000] mb-1 tracking-wider">
            NATURGEMÄLDE
          </h2>
          <p className="text-white font-display text-sm md:text-lg tracking-widest uppercase">La Red de la Vida</p>
        </div>

        <div className="relative flex-1 w-full max-w-6xl mx-auto z-10 mt-2">
          
          <svg className="absolute inset-0 w-full h-full pointer-events-none" style={{ zIndex: -1 }}>
            <defs>
              <linearGradient id="lineGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#4ade80" stopOpacity="0.2" />
                <stop offset="50%" stopColor="#4ade80" stopOpacity="0.8" />
                <stop offset="100%" stopColor="#4ade80" stopOpacity="0.2" />
              </linearGradient>
            </defs>
            <line x1="15%" y1="85%" x2="35%" y2="68%" stroke="#4ade80" strokeWidth="3" strokeDasharray="6 6" className="animate-pulse" />
            <line x1="35%" y1="68%" x2="65%" y2="45%" stroke="#4ade80" strokeWidth="3" strokeDasharray="6 6" className="animate-pulse" />
            <line x1="65%" y1="45%" x2="45%" y2="22%" stroke="#4ade80" strokeWidth="3" strokeDasharray="6 6" className="animate-pulse" />
            
            <line x1="15%" y1="85%" x2="30%" y2="90%" stroke="#94a3b8" strokeWidth="1" strokeDasharray="3 3" opacity="0.6" />
            <line x1="15%" y1="85%" x2="5%" y2="78%" stroke="#94a3b8" strokeWidth="1" strokeDasharray="3 3" opacity="0.6" />
            <line x1="35%" y1="68%" x2="50%" y2="75%" stroke="#94a3b8" strokeWidth="1" strokeDasharray="3 3" opacity="0.6" />
            <line x1="35%" y1="68%" x2="20%" y2="60%" stroke="#94a3b8" strokeWidth="1" strokeDasharray="3 3" opacity="0.6" />
            <line x1="65%" y1="45%" x2="45%" y2="55%" stroke="#94a3b8" strokeWidth="1" strokeDasharray="3 3" opacity="0.6" />
            <line x1="65%" y1="45%" x2="80%" y2="40%" stroke="#94a3b8" strokeWidth="1" strokeDasharray="3 3" opacity="0.6" />
            <line x1="65%" y1="45%" x2="55%" y2="35%" stroke="#94a3b8" strokeWidth="1" strokeDasharray="3 3" opacity="0.6" />
            <line x1="45%" y1="22%" x2="60%" y2="15%" stroke="#94a3b8" strokeWidth="1" strokeDasharray="3 3" opacity="0.6" />
            <line x1="45%" y1="22%" x2="30%" y2="12%" stroke="#94a3b8" strokeWidth="1" strokeDasharray="3 3" opacity="0.6" />
          </svg>

          {mainNodes.map((node) => (
            <div 
              key={node.id}
              className="absolute flex flex-col items-center animate-fade-in z-20"
              style={{ top: node.top, left: node.left, transform: 'translate(-50%, -50%)', animationDelay: node.delay }}
            >
              <div className={`px-3 py-2 rounded-xl border-4 border-black shadow-brutal whitespace-nowrap ${node.color} ${node.text} font-display flex flex-col items-center transition-transform hover:scale-105 cursor-default w-40 md:w-48`}>
                <span className="font-bold uppercase tracking-wider text-xs md:text-sm">{node.name}</span>
                <span className="text-[10px] font-mono opacity-80">{node.alt}</span>
                <div className="w-full h-px bg-black/20 my-1"></div>
                <span className="text-[10px] font-bold">{node.temp}</span>
              </div>
              <div className="absolute left-1/2 -bottom-3 w-2 h-2 bg-black rotate-45 z-10 transform -translate-x-1/2"></div>
            </div>
          ))}

          {detailNodes.map((node) => (
            <div 
              key={node.id}
              className="absolute animate-fade-in z-10"
              style={{ top: node.top, left: node.left, transform: 'translate(-50%, -50%)', animationDelay: node.delay }}
            >
              <div className={`px-2 py-1 rounded-md border-2 border-black shadow-sm whitespace-nowrap font-mono text-xs transition-transform hover:scale-110 cursor-default ${
                node.isData 
                  ? 'bg-tropic-orange text-black font-bold' 
                  : 'bg-black/80 text-leaf-400 border-leaf-900'
              }`}>
                {node.text}
              </div>
            </div>
          ))}
        </div>

        <div className="relative z-20 pb-4 text-center mt-auto animate-fade-in-up" style={{ animationDelay: '3.5s', animationFillMode: 'forwards', opacity: 0 }}>
          <div className="bg-black/90 border-4 border-tropic-yellow px-6 py-2 rounded-full inline-block shadow-brutal">
            <p className="font-display text-lg md:text-xl text-white">
              LA EXPEDICIÓN TERMINÓ, PERO EL CONOCIMIENTO NOS ELEVÓ
            </p>
          </div>
        </div>
      </div>
    );
  }

  // ==========================================
  // VISTAS DEL JUEGO
  // ==========================================
  if (activeRound) {
    const { prompt, plant, options, correct_index } = activeRound.payload;
    
    if (phase === 'question') {
      return (
        <div className="flex min-h-[100dvh] flex-col bg-forest-900 text-white p-8">
          <header className="mb-8 flex items-center justify-between">
            <p className="font-display text-xl tracking-widest text-leaf-400">
              {activeRound.kind === 'matching' ? 'IDENTIFICA LA PLANTA' : 'TRIVIA RÁPIDA'}
            </p>
            <div className={`flex h-20 w-20 items-center justify-center rounded-full border-4 border-black font-display text-4xl shadow-brutal ${timeLeft <= 5 ? 'bg-red-600 animate-pulse' : 'bg-tropic-yellow text-black'}`}>
              {timeLeft}
            </div>
          </header>
          <main className="flex flex-col items-center justify-center flex-1">
            <h1 className="mb-8 text-center font-display text-4xl text-tropic-yellow drop-shadow-[4px_4px_0px_#000] md:text-6xl">
              {prompt}
            </h1>
            {plant && (
              <div className="mb-10 inline-block rounded-3xl border-4 border-black bg-cream px-12 py-6 text-black shadow-brutal">
                <span className="font-display text-5xl uppercase md:text-7xl">{plant}</span>
              </div>
            )}
            <div className="grid grid-cols-2 gap-4 w-full max-w-4xl">
              {options.map((opt, idx) => {
                const optionColors = ['bg-red-500', 'bg-blue-500', 'bg-yellow-500', 'bg-green-500'];
                const shapes = ['▲', '◆', '●', '■'];
                return (
                  <div key={idx} className={`${optionColors[idx]} flex items-center gap-4 rounded-2xl border-4 border-black p-5 shadow-brutal`}>
                    <span className="text-3xl text-black/50">{shapes[idx]}</span>
                    <span className="font-display text-xl text-black">{opt}</span>
                  </div>
                );
              })}
            </div>
          </main>
        </div>
      );
    }

    if (phase === 'reveal') {
      return (
        <div className="flex min-h-[100dvh] flex-col items-center justify-center bg-forest-900 text-white p-8 text-center">
          <h2 className="mb-8 font-display text-4xl text-leaf-400">¡TIEMPO TERMINADO!</h2>
          <p className="mb-4 text-xl">La respuesta correcta era:</p>
          <div className="rounded-3xl border-4 border-black bg-green-500 px-12 py-8 text-black shadow-brutal scale-110">
            <span className="font-display text-4xl md:text-6xl">{options[correct_index]}</span>
          </div>
        </div>
      );
    }

    if (phase === 'ranking') {
      const ranking = [...players].sort((a, b) => b.altitude - a.altitude);

      return (
        <div 
          className="relative min-h-[100dvh] w-full bg-forest-900 overflow-hidden flex flex-col"
          style={{ 
            backgroundImage: `url(${mountainBg})`,
            backgroundSize: 'cover', 
            backgroundPosition: 'center', 
            backgroundRepeat: 'no-repeat'
          }}
        >
          <div className="absolute inset-0 bg-black/10 z-0 pointer-events-none"></div>


          <div className="relative flex-1 w-full max-w-6xl mx-auto z-10">
             {ranking.map((p, index) => {
               const startAlt = snapshotAltitudes[p.id] ?? 0;
               return (
                 <AnimatedPlayer 
                   key={p.id} 
                   player={p} 
                   index={index} 
                   totalPlayers={ranking.length} 
                   startAltitude={startAlt}
                 />
               );
             })}
          </div>
        </div>
      );
    }
  }

  // ==========================================
  // VISTA DE SALA DE ESPERA
  // ==========================================
  return (
    <div className="flex min-h-[100dvh] flex-col bg-forest-900 px-8 py-10 text-white">
      <header className="mb-10 text-center">
        <p className="mb-2 font-display text-lg tracking-widest text-leaf-400">
          INGRESA A CHIMBORAZO LIVE CON EL PIN
        </p>
        <h1 className="font-display text-7xl tracking-[0.2em] text-tropic-yellow drop-shadow-[4px_4px_0px_#000] md:text-8xl">
          {pin}
        </h1>
        <p className="mt-3 text-sm text-leaf-400/70">
          {players.length} explorador{players.length === 1 ? '' : 'es'} en la sala
        </p>
      </header>

      <div className="mx-auto grid w-full max-w-4xl grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">
        {players.map((p) => (
          <div key={p.id} className="rounded-xl border-4 border-black bg-leaf-500 px-4 py-3 text-center font-display text-lg text-black shadow-brutal-sm">
            {p.name}
          </div>
        ))}
      </div>

      <div className="mt-auto flex justify-center pt-10">
        <button
          onClick={startGame}
          disabled={players.length === 0 || starting}
          className="rounded-2xl border-4 border-black bg-tropic-orange px-10 py-5 font-display text-2xl text-white shadow-brutal transition-all hover:bg-tropic-amber hover:shadow-brutal-sm hover:translate-x-[3px] hover:translate-y-[3px] disabled:cursor-not-allowed disabled:opacity-50"
        >
          {starting ? 'INICIANDO...' : 'INICIAR JUEGO'}
        </button>
      </div>
    </div>
  );
}