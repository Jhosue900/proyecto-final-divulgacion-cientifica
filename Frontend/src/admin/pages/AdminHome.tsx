import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

export default function AdminHome() {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const createSession = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/api/sessions`, { method: 'POST' });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      navigate(`/admin/session/${data.pin}`);
    } catch (err) {
      console.error(err);
      alert('No se pudo crear la partida');
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-[100dvh] flex-col items-center justify-center bg-forest-900 px-6 text-white">
      <h1 className="mb-8 font-display text-5xl">PANEL DEL GUÍA</h1>
      <button
        onClick={createSession}
        disabled={loading}
        className="rounded-2xl border-4 border-black bg-tropic-orange px-10 py-5 font-display text-2xl text-white shadow-brutal transition-all hover:bg-tropic-amber hover:shadow-brutal-sm hover:translate-x-[3px] hover:translate-y-[3px] disabled:opacity-60"
      >
        {loading ? 'CREANDO…' : 'CREAR PARTIDA'}
      </button>
    </div>
  );
}