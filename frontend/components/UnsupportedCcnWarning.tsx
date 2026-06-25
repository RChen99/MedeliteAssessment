"use client";

import { useState } from "react";
import { DEMO_CCN } from "@/lib/constants";

interface UnsupportedCcnWarningProps {
  enteredCcn: string;
  onUseDemo: () => void;
}

export default function UnsupportedCcnWarning({
  enteredCcn,
  onUseDemo,
}: UnsupportedCcnWarningProps) {
  const [copied, setCopied] = useState(false);

  const copyDemoCcn = async () => {
    try {
      await navigator.clipboard.writeText(DEMO_CCN);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      onUseDemo();
    }
  };

  return (
    <div
      role="alert"
      className="rounded-lg border border-amber-200 bg-amber-50 px-4 py-4 text-sm text-amber-900"
    >
      <p className="font-semibold">CCN not supported for testing</p>
      <p className="mt-1">
        <span className="font-mono">{enteredCcn}</span> is not available in this
        demo. Please use{" "}
        <span className="font-mono font-semibold">{DEMO_CCN}</span> (Kendall
        Lakes Rehabilitation Center).
      </p>
      <div className="mt-3 flex flex-wrap gap-2">
        <button
          type="button"
          onClick={copyDemoCcn}
          className="rounded-lg border border-amber-300 bg-white px-4 py-2 font-medium text-amber-900 transition hover:bg-amber-100"
        >
          {copied ? "Copied!" : `Copy ${DEMO_CCN}`}
        </button>
        <button
          type="button"
          onClick={onUseDemo}
          className="rounded-lg bg-medelite-teal px-4 py-2 font-semibold text-white transition hover:bg-medelite-navy"
        >
          Use demo CCN
        </button>
      </div>
    </div>
  );
}
