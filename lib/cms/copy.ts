// Copy engine: defaults live in code, the database stores only what editors changed.
// A text is addressed by its path inside the page's content object, e.g. intro.p1.1.b.
// No imports on purpose: the browser-side editor uses this file too.

/** FNV-1a: tells whether a default text changed in code after an editor overrode it. */
export function hashText(s: string): string {
  let h = 0x811c9dc5;
  for (let i = 0; i < s.length; i++) {
    h ^= s.charCodeAt(i);
    h = Math.imul(h, 0x01000193);
  }
  return (h >>> 0).toString(36);
}

// Fields that drive links, files and icons. Editing these would break the page.
const STRUCTURAL_KEYS = new Set(["href", "src", "image", "cover", "file", "poster", "slug", "icon", "link"]);

const looksStructural = (v: string) =>
  v.startsWith("/") || v.startsWith("#") || v.startsWith("http") || v.startsWith("mailto:");

/**
 * Invisible separator wrapping each text in the admin preview as MARK key MARK text MARK,
 * so the preview script knows which text belongs to which field. Visitors never receive it.
 */
export const MARK = "⁢";
const MARKED = new RegExp(`${MARK}[^${MARK}]*${MARK}([^${MARK}]*)${MARK}`, "g");

export const markCopy = (key: string, text: string) => `${MARK}${key}${MARK}${text}${MARK}`;
export const stripMarks = (s: string) => s.replace(MARKED, "$1");

export type CopyEntry = { path: string; value: string };

/** Every editable text in a content object, in declaration order (which is page order). */
export function collectCopy(node: unknown, prefix = ""): CopyEntry[] {
  if (typeof node === "string") {
    return node.trim() && !looksStructural(node) ? [{ path: prefix, value: node }] : [];
  }
  if (Array.isArray(node)) {
    return node.flatMap((item, i) => collectCopy(item, prefix ? `${prefix}.${i}` : String(i)));
  }
  if (node && typeof node === "object") {
    return Object.entries(node).flatMap(([k, v]) =>
      STRUCTURAL_KEYS.has(k) ? [] : collectCopy(v, prefix ? `${prefix}.${k}` : k),
    );
  }
  return [];
}

export type Override = { value: string; hash: string | null };

/**
 * Returns a copy of `node` with overrides applied. An override only wins while its hash still
 * matches the default, so a text rewritten in code is never hidden by an older edit.
 * With `markScope` set (admin preview only), every editable text is wrapped with its key.
 */
export function applyCopy<T>(node: T, overrides: Map<string, Override>, markScope: string | null, prefix = ""): T {
  if (typeof node === "string") {
    const editable = Boolean(node.trim()) && !looksStructural(node);
    const hit = editable ? overrides.get(prefix) : undefined;
    const value = hit && (!hit.hash || hit.hash === hashText(node)) ? hit.value : node;
    return (markScope && editable ? markCopy(`${markScope}:${prefix}`, value) : value) as T;
  }
  if (Array.isArray(node)) {
    return node.map((item, i) => applyCopy(item, overrides, markScope, prefix ? `${prefix}.${i}` : String(i))) as T;
  }
  if (node && typeof node === "object") {
    return Object.fromEntries(
      Object.entries(node).map(([k, v]) => [
        k,
        STRUCTURAL_KEYS.has(k) ? v : applyCopy(v, overrides, markScope, prefix ? `${prefix}.${k}` : k),
      ]),
    ) as T;
  }
  return node;
}
