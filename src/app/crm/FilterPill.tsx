import { Check } from 'lucide-react';
import { categoryColorHex } from '../data/events';

interface FilterPillProps {
  label: string;
  value: string;
  selected: boolean;
  onClick: () => void;
  disabled?: boolean;
  /** Mehkejši izgled v CRM obrazcu (obroba namesto polnega ozadja). */
  variant?: 'default' | 'soft';
}

/** Izbirni gumbi (pills) za kategorijo/filter v CRM obrazcu. */
export function FilterPill({
  label,
  value,
  selected,
  onClick,
  disabled,
  variant = 'default',
}: FilterPillProps) {
  const color = categoryColorHex(value);
  const isSoft = variant === 'soft';

  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      aria-pressed={selected}
      className={`group inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-[0.8125rem] font-medium transition-all disabled:opacity-40 disabled:cursor-not-allowed ${
        selected
          ? isSoft
            ? 'bg-white'
            : 'text-white shadow-sm'
          : 'bg-[#fafaf8] text-[#18201B]/80 border-[#18201B]/10 hover:border-[#18201B]/22 hover:bg-white'
      }`}
      style={
        selected
          ? isSoft
            ? { borderColor: color, color: '#18201B', boxShadow: `inset 0 0 0 1px ${color}22` }
            : { backgroundColor: color, borderColor: color }
          : undefined
      }
    >
      <span
        className={`size-2 rounded-full shrink-0 ${selected && !isSoft ? 'bg-white/90' : ''}`}
        style={selected && isSoft ? { backgroundColor: color } : selected ? undefined : { backgroundColor: color }}
        aria-hidden
      />
      {label}
      {selected && <Check className="size-3 opacity-70" aria-hidden />}
    </button>
  );
}
