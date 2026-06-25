"use client";

import Link from "next/link";

export default function BackToLookupLink() {
  return (
    <Link
      href="/"
      className="inline-flex items-center gap-2 text-sm font-medium text-medelite-teal transition hover:text-medelite-navy"
    >
      <span aria-hidden="true">←</span>
      Back to facility lookup
    </Link>
  );
}
