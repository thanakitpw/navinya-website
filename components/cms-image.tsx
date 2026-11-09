"use client";

import Image, { type ImageProps } from "next/image";
import { createContext, useContext } from "react";

type Ctx = { overrides: Record<string, string>; preview: boolean };

const ImageContext = createContext<Ctx>({ overrides: {}, preview: false });

export function CmsImageProvider({ value, children }: { value: Ctx; children: React.ReactNode }) {
  return <ImageContext.Provider value={value}>{children}</ImageContext.Provider>;
}

/**
 * next/image for design images an editor can replace. The key is the image's original path, so one
 * picture used on several pages changes everywhere. Work photos are managed separately in /admin/works.
 */
/** The current picture for a design image's original path, for places next/image can't go (video poster). */
export function useCmsSrc(src: string) {
  return useContext(ImageContext).overrides[src] ?? src;
}

/** A section background as a replaceable image. The section styles its own overlay on top (see .has-bg). */
export function CmsBackground({ src }: { src: string }) {
  return <CmsImage src={src} alt="" fill sizes="100vw" className="sec-bg" />;
}

export function CmsImage({ src, alt, ...rest }: ImageProps) {
  const { overrides, preview } = useContext(ImageContext);
  if (typeof src !== "string") return <Image src={src} alt={alt} {...rest} />;
  return <Image src={overrides[src] ?? src} alt={alt} {...rest} {...(preview ? { "data-cms-image": src } : {})} />;
}
