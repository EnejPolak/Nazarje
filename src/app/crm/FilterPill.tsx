import { Check } from 'lucide-react';
import { categoryColorHex } from '../data/events';

interface FilterPillProps {
  label: string;
  value: string;
  selected: boolean;
  onClick: () => void;
  disabled?: boolean;
}

/** Izbirni gumbi (pills) za kategorijo/filter v CRM obrazcu. */
export function FilterPill({ label, value, selected, onClick, disabled }: FilterPillProps) {
  const color = categoryColorHex(value);

  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      aria-pressed={selected}
      className={`group inline-flex items-center gap-2 rounded-full border px-3.5 py-1.5 text-sm font-medium transition-all disabled:opacity-40 disabled:cursor-not-allowed ${
        selected
          ? 'text-white shadow-sm'
          : 'bg-white text-[#18201B] border-[#18201B]/15 hover:border-[#18201B]/40'
      }`}
      style={
        selected
          ? { backgroundColor: color, borderColor: color }
          : undefined
      }
    >
      <span
        className={`size-2.5 rounded-full transition-transform ${selected ? 'bg-white/90' : ''}`}
        style={selected ? undefined : { backgroundColor: color }}
        aria-hidden
      />
      {label}
      {selected && <Check className="size-3.5" aria-hidden />}
    </button>
  );
}
