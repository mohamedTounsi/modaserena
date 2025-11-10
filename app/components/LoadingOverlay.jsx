"use client";

import { useEffect, useState } from "react";

const LoadingOverlay = () => {
  const [loading, setLoading] = useState(true);
  const [fadeOut, setFadeOut] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setFadeOut(true);
      setTimeout(() => setLoading(false), 800);
    }, 400);

    return () => clearTimeout(timer);
  }, []);

  if (!loading) return null;

  return (
    <div
      className={`fixed inset-0 z-5000 flex items-center justify-center bg-white transition-opacity duration-1000 ${
        fadeOut ? "opacity-0 pointer-events-none" : "opacity-100"
      }`}
    >
      <img
        src="/modaserenalogo1.png"
        alt="Logo"
        className="md:w-100 md:h-100 w-70 h-70 "
      />
    </div>
  );
};

export default LoadingOverlay;
