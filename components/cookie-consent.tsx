"use client";

import { useState, useSyncExternalStore } from "react";
import type { globalCopy } from "@/lib/content/global";
import { readConsent, saveConsent } from "@/lib/tracking";
import { Icon } from "./icons";

const DISMISSED_KEY = "navinya-cookie-dismissed";

const subscribe = () => () => {};

// Storage can throw in private windows or when site data is blocked; the notice still has to work.
function needsAnswer() {
  try {
    return !readConsent() && !sessionStorage.getItem(DISMISSED_KEY);
  } catch {
    return true;
  }
}

function remember(write: () => void) {
  try {
    write();
  } catch {}
}

export function CookieConsent({ copy }: { copy: typeof globalCopy.cookie }) {
  // Storage only exists in the browser, so the server renders nothing and the notice appears after hydration.
  const pending = useSyncExternalStore(subscribe, needsAnswer, () => false);
  const [closed, setClosed] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [analytics, setAnalytics] = useState(false);
  const [marketing, setMarketing] = useState(false);

  if (!pending || closed) return null;

  const save = (allowAnalytics: boolean, allowMarketing: boolean) => {
    saveConsent({ analytics: allowAnalytics, marketing: allowMarketing });
    setClosed(true);
  };

  // Closing is not consent: nothing is recorded, so the notice returns on the next visit.
  const dismiss = () => {
    remember(() => sessionStorage.setItem(DISMISSED_KEY, "1"));
    setClosed(true);
  };

  return (
    <section className="cc" aria-label="การตั้งค่าคุกกี้">
      <button type="button" className="cc-close" aria-label="ปิด" onClick={dismiss}>
        <Icon name="x" />
      </button>
      <p className="cc-text">
        {copy.message}{" "}
        <button
          type="button"
          className="cc-link"
          aria-expanded={settingsOpen}
          aria-controls="cc-settings"
          onClick={() => setSettingsOpen((v) => !v)}
        >
          {copy.settings}
        </button>
      </p>
      {settingsOpen && (
        <div className="cc-settings" id="cc-settings">
          <div className="cc-row">
            <div>
              <b>{copy.necessaryTitle}</b>
              <p>{copy.necessaryText}</p>
            </div>
            <span className="cc-always">{copy.alwaysOn}</span>
          </div>
          <label className="cc-row">
            <div>
              <b>{copy.analyticsTitle}</b>
              <p>{copy.analyticsText}</p>
            </div>
            <input
              type="checkbox"
              className="cc-switch"
              checked={analytics}
              onChange={(e) => setAnalytics(e.target.checked)}
            />
          </label>
          <label className="cc-row">
            <div>
              <b>{copy.marketingTitle}</b>
              <p>{copy.marketingText}</p>
            </div>
            <input
              type="checkbox"
              className="cc-switch"
              checked={marketing}
              onChange={(e) => setMarketing(e.target.checked)}
            />
          </label>
        </div>
      )}
      <div className="cc-actions">
        {settingsOpen && (
          <button type="button" className="cc-save" onClick={() => save(analytics, marketing)}>
            {copy.save}
          </button>
        )}
        <button type="button" className="cc-accept" onClick={() => save(true, true)}>
          {copy.accept}
        </button>
      </div>
    </section>
  );
}
