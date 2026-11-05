import Link from "next/link";
import { Fragment } from "react";

// A paragraph as data, so each piece of text can be edited on its own while bold and links stay in place.
export type RichPart = string | { b: string } | { href: string; text: string };

export function Rich({ parts }: { parts: RichPart[] }) {
  return parts.map((part, k) => (
    <Fragment key={k}>
      {typeof part === "string" ? (
        part
      ) : "b" in part ? (
        <b>{part.b}</b>
      ) : (
        <Link href={part.href} className="hl">
          {part.text}
        </Link>
      )}
    </Fragment>
  ));
}
