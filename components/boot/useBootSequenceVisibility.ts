"use client";

import { useEffect, useState } from "react";

const STORAGE_KEY = "cyberpunk-portfolio:boot-shown";

/**
 * Decides whether the boot/intro sequence should play.
 *
 * - Plays once per browser session (tracked via `sessionStorage`).
 * - Can always be replayed for testing/demo purposes via the `?boot=1`
 *   query param, regardless of session state.
 *
 * Returns `null` while the decision is still being resolved (first paint,
 * to avoid a flash of the wrong state during SSR/hydration), then `true`
 * or `false`.
 */
export function useBootSequenceVisibility() {
  const [shouldShowBoot, setShouldShowBoot] = useState<boolean | null>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const params = new URLSearchParams(window.location.search);
    const forceReplay = params.get("boot") === "1";
    const alreadyShown = window.sessionStorage.getItem(STORAGE_KEY) === "1";

    // Deliberately synchronous: this is the one-time client/server
    // reconciliation step (sessionStorage + query params are unavailable
    // during SSR), matching the documented pattern for syncing render
    // state with a browser-only external source right after mount.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setShouldShowBoot(forceReplay || !alreadyShown);
  }, []);

  const markBootComplete = () => {
    if (typeof window === "undefined") return;
    window.sessionStorage.setItem(STORAGE_KEY, "1");
    setShouldShowBoot(false);
  };

  return { shouldShowBoot, markBootComplete };
}
