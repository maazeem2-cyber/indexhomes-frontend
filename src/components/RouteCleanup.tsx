"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { cleanupModalArtifacts } from "@/components/Modal";

/**
 * Clears leaked modal portals / body scroll locks after client-side navigations.
 * Without this, dashboard modals can leave a stuck blur overlay on marketing pages.
 */
export function RouteCleanup() {
  const pathname = usePathname();

  useEffect(() => {
    cleanupModalArtifacts();
  }, [pathname]);

  return null;
}
