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
      className="rounded-lg border border-amber-200 bg-amber-50 px-4 py-4 text-sm text-amber-900"
    >
      <p>
        This CCN is not supported for testing. Please use {DEMO_CCN}, or hit
        the copy button.
      </p>
      <button
        type="button"
        onClick={copyDemoCcn}
        className="mt-3 rounded-lg border border-amber-300 bg-white px-4 py-2 font-medium text-amber-900 transition hover:bg-amber-100"
      >
        {copied ? "Copied!" : `Copy ${DEMO_CCN}`}
      </button>
    </div>
  );
}
