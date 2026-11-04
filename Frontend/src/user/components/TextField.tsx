import type { ChangeEvent, HTMLInputTypeAttribute } from 'react';

interface TextFieldProps {
  id: string;
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  type?: HTMLInputTypeAttribute;
  inputMode?: 'numeric' | 'text';
  /** Clases extra para el input (por ejemplo el tracking de letras). */
  inputClassName?: string;
}

export default function TextField({
  id,
  label,
  value,
  onChange,
  placeholder,
  type = 'text',
  inputMode,
  inputClassName = 'tracking-wide',
}: TextFieldProps) {
  return (
    <div>
      <label
        htmlFor={id}
        className="mb-1.5 block font-display text-sm tracking-wide text-tropic-yellow"
      >
        {label}
      </label>
      <input
        id={id}
        type={type}
        inputMode={inputMode}
        autoComplete="off"
        value={value}
        onChange={(e: ChangeEvent<HTMLInputElement>) => onChange(e.target.value)}
        placeholder={placeholder}
        className={`h-14 w-full rounded-2xl border-4 border-black bg-cream px-5 text-xl font-bold uppercase text-black placeholder:text-black/30 shadow-brutal outline-none transition-all focus:shadow-brutal-sm focus:translate-x-[3px] focus:translate-y-[3px] ${inputClassName}`}
      />
    </div>
  );
}