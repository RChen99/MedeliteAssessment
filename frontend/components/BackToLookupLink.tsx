"use client";

import Link from "next/link";
import { HiChevronLeft } from "react-icons/hi2";

export default function BackToLookupLink() {
  return (
    <Link
      href="/"
      className="inline-flex items-center gap-2 rounded-lg bg-medelite-teal px-4 py-2.5 text-base font-semibold text-white transition hover:bg-medelite-navy"
    >
      <HiChevronLeft className="h-5 w-5 shrink-0" aria-hidden="true" />
      Back
    </Link>
  );
}
