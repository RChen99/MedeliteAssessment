"use client";

import Link from "next/link";

export default function BackToLookupLink() {
  return (
    <Link
      href="/"
      className="inline-flex items-center gap-2 rounded-lg bg-medelite-teal px-4 py-2.5 text-base font-semibold text-white transition hover:bg-medelite-navy"
    >
      <span aria-hidden="true" className="text-xl font-bold leading-none">
        ←
      </span>
      Back to facility lookup
    </Link>
  );
}
