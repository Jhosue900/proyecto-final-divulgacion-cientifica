import { useState, type FormEvent } from 'react';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

export function useJoinForm(onSuccess: (data: { playerId: string; sessionId: string; name: string }) => void) {
  const [pin, setPin] = useState('');
  const [name, setName] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (loading) return;

    if (pin.trim().length < 4) {
      setError('EL PIN DEBE TENER AL MENOS 4 CARACTERES');
      return;
    }
    if (name.trim().length < 2) {
      setError('INGRESA TU NOMBRE DE EXPLORADOR');
      return;
    }

    setError('');
    setLoading(true);

    try {
      const res = await fetch(`${API_URL}/api/sessions/${pin.trim()}/join`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: name.trim() }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error ? data.error.toUpperCase() : 'ERROR AL UNIRSE');
        setLoading(false);
        return;
      }

      // Guardar para reconexión futura
      localStorage.setItem('playerId', data.playerId);
      localStorage.setItem('sessionId', data.sessionId);
      localStorage.setItem('playerName', data.name);

      onSuccess(data);
    } catch (err) {
      console.error(err);
      setError('NO SE PUDO CONECTAR AL SERVIDOR');
      setLoading(false);
    }
  };

  return { pin, setPin, name, setName, error, loading, handleSubmit };
}