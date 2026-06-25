export const dynamic = "force-dynamic";

import { Suspense } from "react";
import HomePageClient from "./HomePageClient";

export default function HomePage() {
  return (
    <Suspense
      fallback={
        <main className="mx-auto min-h-screen max-w-6xl px-4 py-8 md:px-6">
          <p className="text-sm text-medelite-slate">Loading…</p>
        </main>
      }
    >
      <HomePageClient />
    </Suspense>
  );
}
