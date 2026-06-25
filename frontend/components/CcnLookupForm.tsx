"use client";

interface CcnLookupFormProps {
  ccn: string;
  loading: boolean;
  onCcnChange: (value: string) => void;
  onSubmit: () => void;
}

export default function CcnLookupForm({
  ccn,
  loading,
  onCcnChange,
  onSubmit,
}: CcnLookupFormProps) {
  return (
    <form
      className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm"
      onSubmit={(event) => {
        event.preventDefault();
        onSubmit();
      }}
    >
      <h2 className="text-lg font-semibold text-medelite-navy">
        Facility Lookup
      </h2>
      <p className="mt-1 text-sm text-medelite-slate">
        Enter a CMS Certification Number (CCN) to fetch public facility data.
        For this demo, use <span className="font-mono font-medium">686123</span>.
      </p>
      <div className="mt-4 flex flex-col gap-3 sm:flex-row">
        <input
          type="text"
          inputMode="numeric"
          pattern="[0-9]*"
          maxLength={6}
          value={ccn}
          onChange={(event) => onCcnChange(event.target.value.replace(/\D/g, ""))}
          placeholder="e.g. 686123"
          className="flex-1 rounded-lg border border-slate-300 px-4 py-2.5 text-medelite-navy outline-none ring-medelite-teal focus:ring-2"
          aria-label="CMS Certification Number"
        />
        <button
          type="submit"
          disabled={loading || ccn.length === 0}
          className="rounded-lg bg-medelite-teal px-6 py-2.5 font-semibold text-white transition hover:bg-medelite-navy disabled:cursor-not-allowed disabled:opacity-50"
        >
          {loading ? "Fetching…" : "Fetch Facility"}
        </button>
      </div>
    </form>
  );
}
