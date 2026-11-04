import { AlertTriangle } from 'lucide-react';

interface ErrorAlertProps {
  message: string;
}

export default function ErrorAlert({ message }: ErrorAlertProps) {
  return (
    <div className="flex animate-[pulse-glow_1.5s_ease-in-out_infinite] items-center gap-2 rounded-2xl border-4 border-black bg-red-700 px-4 py-3 shadow-brutal-sm">
      <AlertTriangle className="h-5 w-5 flex-shrink-0 text-white" strokeWidth={3} />
      <span className="font-display text-sm tracking-wide text-white">
        {message}
      </span>
    </div>
  );
}