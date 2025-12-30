import { Paste } from "../types/paste";

export function isExpired(paste: Paste, now: number): boolean {
  if (paste.expiresAt && now >= paste.expiresAt) return true;
  if (paste.maxViews !== null && paste.views >= paste.maxViews) return true;
  return false;
}

export function remainingViews(paste: Paste): number | null {
  if (paste.maxViews === null) return null;
  return Math.max(paste.maxViews - paste.views, 0);
}
