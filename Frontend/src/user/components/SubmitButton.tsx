import { ChevronRight } from 'lucide-react';

interface SubmitButtonProps {
  loading: boolean;
}

export default function SubmitButton({ loading }: SubmitButtonProps) {
  return (
    <button
      type="submit"
      disabled={loading}
      className="group mt-2 flex h-16 w-full items-center justify-center gap-2 rounded-2xl border-4 border-black bg-tropic-orange px-6 font-display text-2xl tracking-wide text-white shadow-brutal transition-all hover:bg-tropic-amber hover:shadow-brutal-sm hover:translate-x-[3px] hover:translate-y-[3px] active:shadow-brutal-sm active:translate-x-[3px] active:translate-y-[3px] disabled:cursor-not-allowed disabled:opacity-60"
    >
      {loading ? 'INICIANDO…' : 'INICIAR ASCENSO'}
      {!loading && (
        <ChevronRight
          className="h-7 w-7 text-white transition-transform group-hover:translate-x-1"
          strokeWidth={3}
        />
      )}
    </button>
  );
}