"use client";

import Link from "next/link";

function BackArrowIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 20 20"
      fill="currentColor"
      aria-hidden="true"
      className="h-5 w-5 shrink-0"
    >
      <path
        fillRule="evenodd"
        d="M11.78 5.22a.75.75 0 010 1.06L8.06 10l3.72 3.72a.75.75 0 11-1.06 1.06l-4.25-4.25a.75.75 0 010-1.06l4.25-4.25a.75.75 0 011.06 0z"
        clipRule="evenodd"
      />
    </svg>
  );
}

export default function BackToLookupLink() {
  return (
    <Link
      href="/"
      className="inline-flex items-center gap-2 rounded-lg bg-medelite-teal px-4 py-2.5 text-base font-semibold text-white transition hover:bg-medelite-navy"
    >
      <BackArrowIcon />
      Back
    </Link>
  );
}
