export const CardSkeleton = () => (
  <div className="animate-pulse rounded-sm overflow-hidden bg-white/50 dark:bg-ink-soft/50">
    <div className="aspect-[16/10] bg-ink/10 dark:bg-paper/10" />
    <div className="p-4 space-y-2">
      <div className="h-3 w-1/3 bg-ink/10 dark:bg-paper/10 rounded" />
      <div className="h-4 w-full bg-ink/10 dark:bg-paper/10 rounded" />
      <div className="h-4 w-2/3 bg-ink/10 dark:bg-paper/10 rounded" />
    </div>
  </div>
);

export const Spinner = () => (
  <div className="flex justify-center items-center py-16">
    <div className="w-8 h-8 border-2 border-crimson border-t-transparent rounded-full animate-spin" />
  </div>
);
