import type { CSSProperties } from 'react';

export type MonsteraVariant = 'a' | 'b' | 'c';

interface MonsteraLeafProps {
  className?: string;
  style?: CSSProperties;
  variant: MonsteraVariant;
}

export default function MonsteraLeaf({ className, style, variant }: MonsteraLeafProps) {
  return (
    <svg
      viewBox="0 0 200 200"
      className={className}
      style={style}
      aria-hidden="true"
    >
      {variant === 'a' && (
        <g fill="currentColor">
          <path d="M100 10 C 60 20, 25 55, 20 100 C 18 130, 35 165, 70 185 C 72 170, 68 155, 62 142 C 80 150, 95 160, 105 180 C 108 155, 100 130, 88 110 C 100 115, 112 122, 120 135 C 122 110, 112 85, 95 70 C 110 72, 125 78, 135 90 C 135 65, 120 40, 100 30 Z" />
          <path d="M100 10 C 140 20, 175 55, 180 100 C 182 130, 165 165, 130 185 C 128 170, 132 155, 138 142 C 120 150, 105 160, 95 180 C 92 155, 100 130, 112 110 C 100 115, 88 122, 80 135 C 78 110, 88 85, 105 70 C 90 72, 75 78, 65 90 C 65 65, 80 40, 100 30 Z" />
        </g>
      )}
      {variant === 'b' && (
        <g fill="currentColor">
          <path d="M100 15 C 50 25, 20 70, 30 130 C 40 175, 80 195, 100 190 L 100 15 Z" />
          <path d="M100 15 C 150 25, 180 70, 170 130 C 160 175, 120 195, 100 190 L 100 15 Z" />
          <ellipse cx="70" cy="60" rx="14" ry="22" fill="#0a1f12" />
          <ellipse cx="130" cy="60" rx="14" ry="22" fill="#0a1f12" />
          <ellipse cx="60" cy="110" rx="12" ry="18" fill="#0a1f12" />
          <ellipse cx="140" cy="110" rx="12" ry="18" fill="#0a1f12" />
          <ellipse cx="75" cy="155" rx="10" ry="14" fill="#0a1f12" />
          <ellipse cx="125" cy="155" rx="10" ry="14" fill="#0a1f12" />
        </g>
      )}
      {variant === 'c' && (
        <g fill="currentColor">
          <circle cx="100" cy="100" r="70" />
          <path d="M100 30 Q 120 60, 100 90 Q 80 60, 100 30 Z" fill="#0a1f12" />
          <path d="M100 170 Q 80 140, 100 110 Q 120 140, 100 170 Z" fill="#0a1f12" />
          <path d="M30 100 Q 60 80, 90 100 Q 60 120, 30 100 Z" fill="#0a1f12" />
          <path d="M170 100 Q 140 80, 110 100 Q 140 120, 170 100 Z" fill="#0a1f12" />
        </g>
      )}
    </svg>
  );
}