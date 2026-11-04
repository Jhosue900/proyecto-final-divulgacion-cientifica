import MonsteraLeaf from './MonsteraLeaf';

export default function JungleBackground() {
  return (
    <>
      {/* Ambient glow */}
      <div className="pointer-events-none absolute inset-0 z-0">
        <div className="animate-pulse-glow absolute left-1/2 top-[-10%] h-[420px] w-[420px] -translate-x-1/2 rounded-full bg-leaf-600/20 blur-[100px]" />
        <div className="animate-pulse-glow absolute bottom-[-5%] right-[-10%] h-[320px] w-[320px] rounded-full bg-tropic-orange/15 blur-[90px]" />
      </div>

      {/* Decorative jungle leaves */}
      <div className="pointer-events-none absolute inset-0 z-0">
        <MonsteraLeaf
          variant="a"
          className="animate-sway absolute -left-10 top-10 h-56 w-56 text-leaf-600/30"
          style={{ ['--rot' as string]: '-20deg' }}
        />
        <MonsteraLeaf
          variant="b"
          className="animate-sway-2 absolute -right-12 top-24 h-64 w-64 text-leaf-500/25"
          style={{ ['--rot' as string]: '25deg' }}
        />
        <MonsteraLeaf
          variant="c"
          className="animate-sway absolute -left-16 bottom-10 h-72 w-72 text-leaf-600/20"
          style={{ ['--rot' as string]: '-35deg' }}
        />
        <MonsteraLeaf
          variant="b"
          className="animate-sway-2 absolute -right-20 bottom-0 h-60 w-60 text-tropic-amber/15"
          style={{ ['--rot' as string]: '40deg' }}
        />
      </div>
    </>
  );
}