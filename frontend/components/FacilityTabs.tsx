"use client";

import { ReactNode, useState } from "react";
import { HiFolder, HiFolderOpen } from "react-icons/hi2";

const TABS = [
  { id: "entries", label: "Entries" },
  { id: "performance", label: "Performance" },
  { id: "report", label: "Report" },
] as const;

type TabId = (typeof TABS)[number]["id"];

interface FacilityTabsProps {
  entries: ReactNode;
  performance: ReactNode;
  report: ReactNode;
}

export default function FacilityTabs({
  entries,
  performance,
  report,
}: FacilityTabsProps) {
  const [activeTab, setActiveTab] = useState<TabId>("entries");

  const panels: Record<TabId, ReactNode> = {
    entries,
    performance,
    report,
  };

  return (
    <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
      <div className="flex flex-col md:flex-row md:min-h-[32rem]">
        <div
          role="tablist"
          aria-label="Facility assessment sections"
          className="flex shrink-0 flex-row border-b border-slate-200 bg-slate-50 md:w-56 md:flex-col md:border-b-0 md:border-r"
        >
          {TABS.map((tab) => {
            const selected = activeTab === tab.id;
            const FolderIcon = selected ? HiFolderOpen : HiFolder;

            return (
              <button
                key={tab.id}
                type="button"
                role="tab"
                id={`facility-tab-${tab.id}`}
                aria-selected={selected}
                aria-controls={`facility-panel-${tab.id}`}
                tabIndex={selected ? 0 : -1}
                onClick={() => setActiveTab(tab.id)}
                className={`flex flex-1 items-center gap-3 border-b-2 px-4 py-3.5 text-left text-sm font-semibold transition md:flex-none md:border-b-0 md:border-l-4 md:px-5 md:py-4 ${
                  selected
                    ? "border-medelite-teal bg-white text-medelite-navy md:border-l-medelite-teal"
                    : "border-transparent text-medelite-slate hover:bg-white/80 hover:text-medelite-navy md:border-l-transparent"
                }`}
              >
                <FolderIcon
                  className={`h-5 w-5 shrink-0 ${
                    selected ? "text-medelite-teal" : "text-slate-400"
                  }`}
                  aria-hidden="true"
                />
                {tab.label}
              </button>
            );
          })}
        </div>

        <div className="min-w-0 flex-1 bg-white p-4 md:p-6">
          {TABS.map((tab) => {
            const selected = activeTab === tab.id;
            return (
              <div
                key={tab.id}
                role="tabpanel"
                id={`facility-panel-${tab.id}`}
                aria-labelledby={`facility-tab-${tab.id}`}
                hidden={!selected}
                className="space-y-6"
              >
                {selected ? panels[tab.id] : null}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
