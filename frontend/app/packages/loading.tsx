export default function Loading() {
  return (
    <div className="flex h-screen w-full items-center justify-center bg-[var(--color-surface-primary)]">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[var(--color-text-tertiary)] mx-auto mb-4"></div>
        <p className="text-[var(--color-text-secondary)] text-lg">Loading packages...</p>
      </div>
    </div>
  );
}


