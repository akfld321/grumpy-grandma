"use client";

import { useState } from "react";
import HeroSection from "@/components/landing/HeroSection";
import GrandmaChat from "@/components/chat/GrandmaChat";

export default function Home() {
  const [started, setStarted] = useState(false);

  return (
    <main className="min-h-screen bg-paper font-serif">
      {started ? (
        <GrandmaChat onBack={() => setStarted(false)} />
      ) : (
        <HeroSection onStart={() => setStarted(true)} />
      )}
    </main>
  );
}
