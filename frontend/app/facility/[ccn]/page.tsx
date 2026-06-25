export const dynamic = "force-dynamic";

import { Suspense } from "react";
import FacilityPageClient from "./FacilityPageClient";

interface FacilityPageProps {
  params: { ccn: string };
}

export default function FacilityPage({ params }: FacilityPageProps) {
  return (
    <Suspense
      fallback={
        <main className="mx-auto min-h-screen max-w-6xl px-4 py-8 md:px-6">
          <p className="text-sm text-medelite-slate">Loading…</p>
        </main>
      }
    >
      <FacilityPageClient ccn={params.ccn.trim()} />
    </Suspense>
  );
}
