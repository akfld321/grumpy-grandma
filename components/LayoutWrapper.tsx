"use client";

import React from "react";
import { usePathname } from "next/navigation";
import { SpeedInsights } from "@vercel/speed-insights/next";

export default function LayoutWrapper({
    children,
}: {
    children: React.ReactNode;
}) {
    const pathname = usePathname();
    const isAdmin = pathname?.startsWith("/admin");

    if (isAdmin) {
        return (
            <div className="w-full min-h-screen">
                {children}
                <SpeedInsights />
            </div>
        );
    }

    return (
        <div className="max-w-[600px] mx-auto min-h-screen bg-paper shadow-2xl relative flex flex-col">
            {children}
            <SpeedInsights />
        </div>
    );
}
