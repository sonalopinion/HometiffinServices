"use client";

import { useState } from "react";

// Shows the image from the database; falls back to an emoji if the file is missing.
export default function SafeImage({ src, alt, fallback = "🍽️", className = "" }) {
  const [failed, setFailed] = useState(false);

  if (!src || failed) {
    return (
      <div
        role="img"
        aria-label={alt}
        className="flex h-full w-full items-center justify-center bg-orange-50 text-6xl"
      >
        {fallback}
      </div>
    );
  }

  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={src}
      alt={alt}
      className={`h-full w-full ${className}`}
      onError={() => setFailed(true)}
    />
  );
}
