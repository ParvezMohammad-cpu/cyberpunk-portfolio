"use client";

import { useCallback, useEffect, useId, useRef, useState } from "react";

const MAX_OBJECTS = 30;
const MAX_SIZE_BYTES = 10 * 1024 * 1024; // 10MB
const MAX_TABS = 5;
const ALLOWED_TYPES = ["image/png", "image/jpeg", "image/webp", "image/gif"];

interface VaultItem {
  id: string;
  label: string;
  sizeBytes: number;
  url: string;
  isObjectUrl: boolean;
  createdAt: number;
}

interface VaultTab {
  id: string;
  name: string;
  items: VaultItem[];
}

function placeholderDataUrl(label: string): string {
  const hue = Math.floor(Math.random() * 360);
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="96" height="64"><rect width="100%" height="100%" fill="hsl(${hue},70%,20%)"/><text x="50%" y="50%" fill="hsl(${hue},80%,75%)" font-size="10" font-family="monospace" text-anchor="middle" dominant-baseline="middle">${label}</text></svg>`;
  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
}

function formatBytes(bytes: number): string {
  return `${(bytes / (1024 * 1024)).toFixed(2)}MB`;
}

/**
 * Step 4.7 — Screenshot Scratchpad: a playable digital memory vault. Limits
 * (MAX OBJECTS 30, MAX SIZE 10MB, MAX TABS 5) are enforced per tab/vault;
 * adding an item that would exceed a limit evicts the oldest item(s) first,
 * deterministically, and every eviction is written to the visible log.
 * Generated screenshots use a simulated size (labeled as such); uploaded
 * images use their real byte size and are type/size-checked locally, with
 * object URLs released on eviction, tab close, and unmount.
 */
export function ScreenshotVault() {
  // Instance-scoped counters (not module-scope) so multiple mounted vaults
  // never collide on generated ids. Start at 1 since the initial tab below
  // is seeded directly (without reading the ref during render).
  const tabCounterRef = useRef(1);
  const itemCounterRef = useRef(0);

  const createTab = useCallback((name: string): VaultTab => {
    tabCounterRef.current += 1;
    return { id: `tab-${tabCounterRef.current}`, name, items: [] };
  }, []);

  const [tabs, setTabs] = useState<VaultTab[]>(() => [
    { id: "tab-1", name: "TAB 1", items: [] },
  ]);
  const [activeTabId, setActiveTabId] = useState<string>(() => tabs[0].id);
  const [log, setLog] = useState<string[]>([]);
  const fileInputId = useId();
  const tabsRef = useRef(tabs);

  useEffect(() => {
    tabsRef.current = tabs;
  }, [tabs]);

  useEffect(() => {
    return () => {
      // Release any outstanding object URLs on unmount.
      tabsRef.current.forEach((tab) =>
        tab.items.forEach((item) => {
          if (item.isObjectUrl) URL.revokeObjectURL(item.url);
        })
      );
    };
  }, []);

  const appendLog = useCallback((message: string) => {
    setLog((current) => [message, ...current].slice(0, 40));
  }, []);

  const addItemToTab = useCallback(
    (tabId: string, item: Omit<VaultItem, "id" | "createdAt">) => {
      setTabs((current) =>
        current.map((tab) => {
          if (tab.id !== tabId) return tab;

          const evicted: VaultItem[] = [];
          let items = [...tab.items];
          let totalSize = items.reduce((sum, existing) => sum + existing.sizeBytes, 0);

          while (
            (items.length + 1 > MAX_OBJECTS ||
              totalSize + item.sizeBytes > MAX_SIZE_BYTES) &&
            items.length > 0
          ) {
            const oldest = items[0];
            evicted.push(oldest);
            items = items.slice(1);
            totalSize -= oldest.sizeBytes;
          }

          if (evicted.length > 0) {
            evicted.forEach((oldest) => {
              if (oldest.isObjectUrl) URL.revokeObjectURL(oldest.url);
              appendLog(
                `Evicted "${oldest.label}" from ${tab.name} (oldest-first, limit reached)`
              );
            });
          }

          itemCounterRef.current += 1;
          const newItem: VaultItem = {
            ...item,
            id: `item-${itemCounterRef.current}`,
            createdAt: Date.now(),
          };
          appendLog(`Added "${newItem.label}" to ${tab.name}`);

          return { ...tab, items: [...items, newItem] };
        })
      );
    },
    [appendLog]
  );

  const addGeneratedScreenshot = () => {
    itemCounterRef.current += 1;
    const label = `IMG_${String(itemCounterRef.current).padStart(3, "0")}`;
    const simulatedSize = Math.round(500_000 + Math.random() * 3_000_000);
    addItemToTab(activeTabId, {
      label,
      sizeBytes: simulatedSize,
      url: placeholderDataUrl(label),
      isObjectUrl: false,
    });
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    event.target.value = "";
    if (!file) return;

    if (!ALLOWED_TYPES.includes(file.type)) {
      appendLog(`Rejected "${file.name}" — unsupported type ${file.type || "unknown"}`);
      return;
    }
    if (file.size > MAX_SIZE_BYTES) {
      appendLog(`Rejected "${file.name}" — exceeds the ${formatBytes(MAX_SIZE_BYTES)} vault limit`);
      return;
    }

    addItemToTab(activeTabId, {
      label: file.name,
      sizeBytes: file.size,
      url: URL.createObjectURL(file),
      isObjectUrl: true,
    });
  };

  const addTab = () => {
    if (tabs.length >= MAX_TABS) {
      appendLog(`Cannot add tab — MAX TABS (${MAX_TABS}) reached`);
      return;
    }
    const tab = createTab(`TAB ${tabs.length + 1}`);
    setTabs((current) => [...current, tab]);
    setActiveTabId(tab.id);
  };

  const closeTab = (tabId: string) => {
    setTabs((current) => {
      const tab = current.find((t) => t.id === tabId);
      tab?.items.forEach((item) => {
        if (item.isObjectUrl) URL.revokeObjectURL(item.url);
      });
      const remaining = current.filter((t) => t.id !== tabId);
      return remaining.length > 0 ? remaining : [createTab("TAB 1")];
    });
  };

  const reset = () => {
    tabs.forEach((tab) =>
      tab.items.forEach((item) => {
        if (item.isObjectUrl) URL.revokeObjectURL(item.url);
      })
    );
    const tab = createTab("TAB 1");
    setTabs([tab]);
    setActiveTabId(tab.id);
    setLog([]);
  };

  const activeTab = tabs.find((tab) => tab.id === activeTabId) ?? tabs[0];
  const activeTotalSize = activeTab?.items.reduce((sum, item) => sum + item.sizeBytes, 0) ?? 0;

  return (
    <div className="border-border-dim bg-black-glass/40 border p-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h5 className="font-mono text-fg-dim text-[0.65rem] tracking-[0.2em] uppercase">
          MAX OBJECTS {MAX_OBJECTS} · MAX SIZE {formatBytes(MAX_SIZE_BYTES)} · MAX TABS {MAX_TABS}
        </h5>
        <button
          type="button"
          onClick={reset}
          className="border-border-dim text-fg-dim hover:text-fg focus-visible:outline-neon-cyan border px-3 py-1.5 font-mono text-[0.6rem] tracking-[0.2em] uppercase focus-visible:outline focus-visible:outline-2"
        >
          Reset Vault
        </button>
      </div>

      <div className="mt-3 flex flex-wrap gap-2" role="tablist" aria-label="Vault tabs">
        {tabs.map((tab) => (
          <div key={tab.id} className="flex items-center">
            <button
              type="button"
              role="tab"
              aria-selected={tab.id === activeTabId}
              onClick={() => setActiveTabId(tab.id)}
              className={`border px-3 py-1.5 font-mono text-[0.6rem] tracking-[0.15em] uppercase transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-neon-cyan ${
                tab.id === activeTabId
                  ? "border-neon-cyan text-glow-cyan"
                  : "border-border-dim text-fg-dim"
              }`}
            >
              {tab.name} ({tab.items.length})
            </button>
            {tabs.length > 1 && (
              <button
                type="button"
                aria-label={`Close ${tab.name}`}
                onClick={() => closeTab(tab.id)}
                className="text-fg-dim hover:text-fg focus-visible:outline-neon-cyan -ml-1 px-1.5 font-mono text-xs focus-visible:outline focus-visible:outline-2"
              >
                ×
              </button>
            )}
          </div>
        ))}
        <button
          type="button"
          onClick={addTab}
          disabled={tabs.length >= MAX_TABS}
          className="border-border-dim text-fg-dim hover:text-fg focus-visible:outline-neon-cyan border px-3 py-1.5 font-mono text-[0.6rem] tracking-[0.15em] uppercase focus-visible:outline focus-visible:outline-2 disabled:cursor-not-allowed disabled:opacity-40"
        >
          + Tab
        </button>
      </div>

      {activeTab && (
        <>
          <p className="text-fg-dim mt-3 font-mono text-xs">
            {activeTab.items.length}/{MAX_OBJECTS} objects · {formatBytes(activeTotalSize)}/
            {formatBytes(MAX_SIZE_BYTES)}
          </p>

          <div className="mt-2 flex flex-wrap gap-3">
            <button
              type="button"
              onClick={addGeneratedScreenshot}
              className="border-neon-cyan/60 text-glow-cyan hover:border-neon-cyan focus-visible:outline-neon-cyan border px-4 py-2 font-mono text-xs tracking-[0.2em] uppercase focus-visible:outline focus-visible:outline-2"
            >
              Add Screenshot
            </button>
            <label
              htmlFor={fileInputId}
              className="border-border-dim text-fg-dim hover:text-fg focus-within:outline-neon-cyan cursor-pointer border px-4 py-2 font-mono text-xs tracking-[0.2em] uppercase focus-within:outline focus-within:outline-2"
            >
              Upload Image
              <input
                id={fileInputId}
                type="file"
                accept={ALLOWED_TYPES.join(",")}
                onChange={handleFileUpload}
                className="sr-only"
              />
            </label>
          </div>

          <ul
            className="mt-4 grid grid-cols-3 gap-2 sm:grid-cols-5"
            aria-label={`${activeTab.name} contents`}
          >
            {activeTab.items.map((item) => (
              <li key={item.id} className="border-border-dim border p-1 text-center">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={item.url} alt={item.label} className="h-10 w-full object-cover" />
                <p className="text-fg-dim mt-1 truncate font-mono text-[0.55rem]">
                  {item.label}
                </p>
              </li>
            ))}
          </ul>
          {activeTab.items.length === 0 && (
            <p role="status" className="text-fg-dim mt-3 font-mono text-xs">
              Vault is empty — add a screenshot to begin.
            </p>
          )}
        </>
      )}

      <div className="mt-4">
        <h6 className="text-fg-dim font-mono text-[0.6rem] tracking-[0.2em] uppercase">
          Eviction Log
        </h6>
        <ul className="border-border-dim mt-1 max-h-32 overflow-y-auto border-l-2 pl-3 font-mono text-[0.65rem] leading-relaxed">
          {log.length === 0 && <li className="text-fg-dim">No activity yet.</li>}
          {log.map((entry, index) => (
            <li key={`${entry}-${index}`} className="text-fg-dim">
              {entry}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
