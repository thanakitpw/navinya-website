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
 * picture used on several pages changes everywhere. Article covers and work photos stay on next/image.
 */
export function CmsImage({ src, alt, ...rest }: ImageProps) {
  const { overrides, preview } = useContext(ImageContext);
  if (typeof src !== "string") return <Image src={src} alt={alt} {...rest} />;
  return <Image src={overrides[src] ?? src} alt={alt} {...rest} {...(preview ? { "data-cms-image": src } : {})} />;
}
