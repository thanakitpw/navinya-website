import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    localPatterns: [{ pathname: "/**", search: "" }],
    remotePatterns: [new URL("https://iafnsgqojtyauzhohwje.supabase.co/storage/v1/object/public/works/**")],
  },
};

export default nextConfig;
