export function EventsLoading({ label = 'Nalagam dogodke…' }: { label?: string }) {
  return (
    <div
      className="flex flex-col items-center justify-center py-16 text-[#18201B]/60"
      role="status"
      aria-live="polite"
      aria-busy="true"
    >
      <div
        className="w-8 h-8 border-2 border-[#2F5D46]/30 border-t-[#2F5D46] rounded-full animate-spin mb-3"
        aria-hidden
      />
      <p className="text-sm">{label}</p>
    </div>
  );
}

export function EventsError({
  message,
  onRetry,
}: {
  message: string;
  onRetry?: () => void;
}) {
  return (
    <div
      className="rounded-xl border border-[#9B3A32]/20 bg-[#9B3A32]/5 px-6 py-8 text-center max-w-lg mx-auto"
      role="alert"
    >
      <p className="text-[#18201B] text-sm mb-3">{message}</p>
      {onRetry && (
        <button
          type="button"
          onClick={onRetry}
          className="text-sm text-[#2F5D46] font-medium hover:underline"
        >
          Poskusi znova
        </button>
      )}
    </div>
  );
}
