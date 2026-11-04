import { Mountain } from 'lucide-react';

export default function HeroHeader() {
  return (
    <header className="mb-8 w-full max-w-lg text-center">
      <div className="mb-3 inline-flex items-center justify-center rounded-full border-[3px] border-black bg-tropic-yellow px-4 py-1.5 shadow-brutal-sm">
        <Mountain className="mr-1.5 h-5 w-5 text-black" strokeWidth={3} />
        <span className="font-display text-sm tracking-wider text-black">
          EXPEDICIÓN VOLCÁN
        </span>
      </div>
      <h1 className="font-display text-5xl leading-[0.95] text-white drop-shadow-[4px_4px_0px_#000] sm:text-6xl md:text-7xl">
        CHIMBORAZO
      </h1>
      <p className="mt-4 inline-block rounded-xl border-[3px] border-black bg-leaf-500 px-5 py-2 font-display text-base tracking-wide text-black shadow-brutal-sm sm:text-lg">
        CAMPAMENTO BASE · SELVA TROPICAL
      </p>
    </header>
  );
}