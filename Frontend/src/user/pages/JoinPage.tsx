import JungleBackground from '../components/JungleBackground';
import HeroHeader from '../components/HeroHeader';
import JoinForm from '../components/JoinForm';

export default function JoinPage() {
  return (
    <div className="relative flex min-h-[100dvh] flex-col overflow-hidden bg-forest-900 font-body text-white">
      <JungleBackground />

      <main className="relative z-10 flex flex-1 flex-col items-center justify-center px-5 py-8 sm:px-8">
        <HeroHeader />
        <JoinForm />

        <p className="mt-8 max-w-xs text-center text-xs font-semibold uppercase tracking-wider text-leaf-400/60">
          Pide el PIN a tu guía de expedición para unirte a la partida
        </p>
      </main>
    </div>
  );
}