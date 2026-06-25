import Image from "next/image";

interface BrandHeaderProps {
  state?: string;
}

export default function BrandHeader({ state }: BrandHeaderProps) {
  return (
    <header className="rounded-xl border border-slate-200 bg-white px-6 py-5 shadow-sm">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <Image
            src="/infinite-logo.png"
            alt="INFINITE — Managed by MEDELITE"
            width={300}
            height={80}
            className="h-16 w-auto max-w-[280px]"
            priority
          />
          <p className="sr-only">INFINITE — Managed by MEDELITE</p>
        </div>
        <div className="sm:text-right">
          <h1 className="text-2xl font-bold tracking-wide text-medelite-navy md:text-3xl">
            FACILITY ASSESSMENT SNAPSHOT
          </h1>
          {state && (
            <p className="mt-1 text-2xl font-semibold text-medelite-purple">
              {state}
            </p>
          )}
        </div>
      </div>
    </header>
  );
}
