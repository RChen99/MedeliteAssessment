"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import BrandHeader from "@/components/BrandHeader";
import CcnLookupForm from "@/components/CcnLookupForm";
import UnsupportedCcnWarning from "@/components/UnsupportedCcnWarning";
import { DEMO_CCN } from "@/lib/constants";

export default function HomePageClient() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [ccn, setCcn] = useState("");
  const [unsupportedCcn, setUnsupportedCcn] = useState<string | null>(null);

  useEffect(() => {
    const urlCcn = searchParams.get("ccn")?.trim() ?? "";
    if (!urlCcn) return;

    if (urlCcn === DEMO_CCN) {
      router.replace(`/facility/${DEMO_CCN}`);
      return;
    }

    setCcn(urlCcn);
    setUnsupportedCcn(urlCcn);
  }, [searchParams, router]);

  const goToFacility = (ccnValue: string) => {
    router.push(`/facility/${ccnValue}?fetch=1`);
  };

  const handleSubmit = () => {
    const trimmedCcn = ccn.trim();
    if (!trimmedCcn) return;

    if (trimmedCcn !== DEMO_CCN) {
      setUnsupportedCcn(trimmedCcn);
      return;
    }

    setUnsupportedCcn(null);
    goToFacility(trimmedCcn);
  };

  return (
    <main className="mx-auto min-h-screen max-w-6xl px-4 py-8 md:px-6">
      <BrandHeader />

      <div className="mt-6 space-y-6">
        <CcnLookupForm
          ccn={ccn}
          loading={false}
          onCcnChange={(value) => {
            setCcn(value);
            if (unsupportedCcn && value === DEMO_CCN) {
              setUnsupportedCcn(null);
            }
          }}
          onSubmit={handleSubmit}
        />

        {unsupportedCcn && <UnsupportedCcnWarning />}
      </div>
    </main>
  );
}
