"use client";

import { useState } from "react";
import { DEMO_CCN } from "@/lib/constants";

export default function UnsupportedCcnWarning() {
  const [copied, setCopied] = useState(false);

  const copyDemoCcn = async () => {
    try {
      await navigator.clipboard.writeText(DEMO_CCN);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      setCopied(false);
    }
  };

  return (
    <div
      role="alert"
      className="rounded-lg border border-medelite-blue-light/40 bg-medelite-blue-light/10 px-4 py-4 text-sm text-medelite-navy"
    >
      <p>
        This CCN is not supported for testing. Please use {DEMO_CCN}, or click
        the copy button.
      </p>
      <button
        type="button"
        onClick={copyDemoCcn}
        className="mt-3 rounded-lg bg-medelite-pink px-4 py-2 font-semibold text-white transition hover:bg-medelite-purple"
      >
        {copied ? "Copied!" : `Copy ${DEMO_CCN}`}
      </button>
    </div>
  );
}
