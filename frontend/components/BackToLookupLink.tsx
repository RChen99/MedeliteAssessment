"use client";

import Link from "next/link";

export default function BackToLookupLink() {
  return (
    <Link
      href="/"
      className="inline-flex items-center gap-2 rounded-lg border border-medelite-accent/60 bg-medelite-accent/15 px-4 py-2.5 text-base font-semibold text-medelite-teal shadow-sm transition hover:border-medelite-accent hover:bg-medelite-accent/25 hover:text-medelite-navy"
    >
      <span aria-hidden="true" className="text-xl font-bold leading-none">
        ←
      </span>
      Back to facility lookup
    </Link>
  );
}
