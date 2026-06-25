interface BrandHeaderProps {
  state?: string;
}

export default function BrandHeader({ state }: BrandHeaderProps) {
  return (
    <header className="rounded-xl bg-medelite-navy px-6 py-5 text-white shadow-lg">
      <p className="text-xs font-semibold uppercase tracking-[0.25em] text-medelite-accent">
        INFINITE — Managed by MEDELITE
      </p>
      <h1 className="mt-2 text-2xl font-bold tracking-wide md:text-3xl">
        FACILITY ASSESSMENT SNAPSHOT
      </h1>
      {state && (
        <p className="mt-1 text-lg font-medium text-slate-200">{state}</p>
      )}
    </header>
  );
}
