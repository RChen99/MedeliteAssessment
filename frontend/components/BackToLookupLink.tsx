"use client";

import Link from "next/link";

export default function BackToLookupLink() {
  return (
    <Link
      href="/"
      className="inline-flex items-center gap-2 rounded-lg border border-medelite-teal/30 bg-white px-4 py-2.5 text-base font-semibold text-medelite-navy shadow-sm transition hover:border-medelite-teal hover:bg-medelite-teal/5"
    >
      <span aria-hidden="true" className="text-xl font-bold leading-none">
        ←
      </span>
      Back to facility lookup
    </Link>
  );
}
