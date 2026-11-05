"use client";

import { useEffect } from "react";
import { MARK, stripMarks } from "@/lib/cms/copy";

/**
 * Runs inside the admin preview iframe only. Turns marked text into clickable spans, tells the
 * editor what was clicked, and applies edits to the page as they are typed, without a reload.
 */
export function PreviewBridge() {
  useEffect(() => {
    const images = () => Array.from(document.querySelectorAll<HTMLImageElement>("img[data-cms-image]"));

    // Most images here sit under a gradient or a card-wide link, so the click never lands on the
    // <img> itself. elementsFromPoint looks through those layers to find it.
    const imageAt = (x: number, y: number) => {
      const stack = document.elementsFromPoint(x, y);
      const depth = stack.findIndex((el) => el instanceof HTMLImageElement && Boolean(el.dataset.cmsImage));
      if (depth < 0) return null;
      const blocked = stack.slice(0, depth).some((el) => el.matches("button, input, select, textarea, [data-cms-key]"));
      return blocked ? null : (stack[depth] as HTMLImageElement);
    };

    const style = document.createElement("style");
    style.textContent = `
      [data-cms-key], [data-cms-image] { outline: 1px dashed rgba(27,60,140,.55); outline-offset: 2px; cursor: pointer; border-radius: 2px; }
      [data-cms-key]:hover { background: rgba(41,169,240,.18); outline-color: #1B3C8C; }
      [data-cms-active] { background: rgba(41,169,240,.28); outline: 2px solid #1B3C8C; }
      [data-cms-image][data-cms-hover] { outline: 2px solid #1B3C8C; }
      a[href], button { cursor: default; }
    `;
    document.head.appendChild(style);

    const wrap = () => {
      // Skip script tags: the page's inline React data contains the same marks.
      const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT, {
        acceptNode: (n) =>
          n.parentElement?.closest("script, style") ? NodeFilter.FILTER_REJECT : NodeFilter.FILTER_ACCEPT,
      });
      const hits: Text[] = [];
      let n: Node | null;
      while ((n = walker.nextNode())) {
        if (n.nodeValue?.includes(MARK)) hits.push(n as Text);
      }

      const pattern = new RegExp(`${MARK}([^${MARK}]+)${MARK}([^${MARK}]*)${MARK}`, "g");
      for (const node of hits) {
        const source = node.nodeValue!;
        const frag = document.createDocumentFragment();
        let last = 0;
        for (const m of source.matchAll(pattern)) {
          if (m.index > last) frag.appendChild(document.createTextNode(source.slice(last, m.index)));
          const span = document.createElement("span");
          span.dataset.cmsKey = m[1];
          span.textContent = m[2];
          frag.appendChild(span);
          last = m.index + m[0].length;
        }
        if (last < source.length) frag.appendChild(document.createTextNode(source.slice(last).split(MARK).join("")));
        node.replaceWith(frag);
      }

      // Marks that ended up in alt, title, aria-label and placeholder can't be wrapped, only removed.
      for (const el of Array.from(document.body.querySelectorAll("*"))) {
        if (el.closest("script, style")) continue;
        for (const attr of Array.from(el.attributes)) {
          if (attr.value.includes(MARK)) el.setAttribute(attr.name, stripMarks(attr.value));
        }
      }
    };

    let lastAnnounced = "";
    const announce = () => {
      const payload = {
        type: "cms:ready",
        keys: [...new Set(Array.from(document.querySelectorAll<HTMLElement>("[data-cms-key]")).map((el) => el.dataset.cmsKey))],
        images: [...new Set(images().map((el) => el.dataset.cmsImage))],
      };
      const fingerprint = JSON.stringify(payload);
      if (fingerprint === lastAnnounced) return;
      lastAnnounced = fingerprint;
      window.parent.postMessage(payload, window.location.origin);
    };

    // Client components can render marked text after the first pass, so keep watching.
    let queued = false;
    let announceTimer = 0;
    const observer = new MutationObserver(() => {
      if (!queued) {
        queued = true;
        queueMicrotask(() => {
          queued = false;
          wrap();
        });
      }
      window.clearTimeout(announceTimer);
      announceTimer = window.setTimeout(announce, 150);
    });

    // Wait until React has hydrated, otherwise it finds a DOM it did not render and starts over.
    const start = () => {
      // The floating contact button covers text on the right; start it collapsed. It can be reopened.
      document.querySelector<HTMLButtonElement>(".fab.open .fab-toggle")?.click();
      wrap();
      observer.observe(document.body, { childList: true, subtree: true, characterData: true });
      announce();
    };
    const idle = window.requestIdleCallback ? window.requestIdleCallback(start, { timeout: 300 }) : window.setTimeout(start, 100);

    const onClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement | null;
      // Links, buttons and the form stay inert so the preview can't navigate away or submit.
      if (target?.closest("a[href], button, label, input, select, textarea")) e.preventDefault();

      const text = target?.closest<HTMLElement>("[data-cms-key]");
      if (text) {
        e.preventDefault();
        e.stopPropagation();
        window.parent.postMessage({ type: "cms:select", key: text.dataset.cmsKey }, window.location.origin);
        return;
      }
      const image = target?.closest<HTMLElement>("[data-cms-image]") ?? imageAt(e.clientX, e.clientY);
      if (image) {
        e.preventDefault();
        e.stopPropagation();
        window.parent.postMessage({ type: "cms:select-image", key: image.dataset.cmsImage }, window.location.origin);
      }
    };
    document.addEventListener("click", onClick, true);

    let hoverFrame = 0;
    const onMove = (e: MouseEvent) => {
      if (hoverFrame) return;
      const { clientX: x, clientY: y } = e;
      hoverFrame = requestAnimationFrame(() => {
        hoverFrame = 0;
        const hit = imageAt(x, y);
        for (const el of images()) {
          if (el === hit) el.dataset.cmsHover = "1";
          else delete el.dataset.cmsHover;
        }
        document.body.style.cursor = hit ? "pointer" : "";
      });
    };
    document.addEventListener("mousemove", onMove);

    const onMessage = (e: MessageEvent) => {
      if (e.origin !== window.location.origin) return;
      const d = e.data as { type?: string; key?: string; value?: string };
      if (d?.key == null) return;

      if (d.type === "cms:update") {
        for (const el of document.querySelectorAll<HTMLElement>(`[data-cms-key="${CSS.escape(d.key)}"]`)) {
          el.textContent = d.value ?? "";
        }
      }
      if (d.type === "cms:update-image") {
        for (const el of images()) {
          if (el.dataset.cmsImage !== d.key) continue;
          // next/image also sets srcset; left in place, the browser keeps showing the old picture.
          el.srcset = "";
          el.src = d.value || d.key;
        }
      }
      if (d.type === "cms:focus" || d.type === "cms:focus-image") {
        for (const el of document.querySelectorAll<HTMLElement>("[data-cms-active]")) delete el.dataset.cmsActive;
        const el =
          d.type === "cms:focus"
            ? document.querySelector<HTMLElement>(`[data-cms-key="${CSS.escape(d.key)}"]`)
            : images().find((i) => i.dataset.cmsImage === d.key);
        if (el) {
          el.dataset.cmsActive = "1";
          el.scrollIntoView({ behavior: "smooth", block: "center" });
        }
      }
    };
    window.addEventListener("message", onMessage);

    return () => {
      if (window.cancelIdleCallback) window.cancelIdleCallback(idle);
      window.clearTimeout(idle);
      observer.disconnect();
      window.clearTimeout(announceTimer);
      cancelAnimationFrame(hoverFrame);
      document.removeEventListener("mousemove", onMove);
      document.removeEventListener("click", onClick, true);
      window.removeEventListener("message", onMessage);
      style.remove();
    };
  }, []);

  return null;
}
