"use client";

type WindowWithDataLayer = Window & {
    dataLayer: Record<string, any>[];
};

declare const window: WindowWithDataLayer;

export const sendGTMEvent = (eventName: string, params: Record<string, any> = {}) => {
    if (typeof window === "undefined") return;

    if (!window.dataLayer) {
        window.dataLayer = [];
    }

    const eventData = {
        event: eventName,
        ...params,
        timestamp: new Date().toISOString()
    };

    window.dataLayer.push(eventData);

    // Dev Logger
    if (process.env.NODE_ENV === "development") {
        console.log(`[GTM Event] ${eventName}`, params);
    }
};

export const ANALYTICS_EVENTS = {
    BEGIN_CHAT: "begin_chat",
    COMPLETE_ANALYSIS: "complete_analysis", // Finished all chapters
    VIEW_SALES_PAGE: "view_sales_page",     // Saw the blurred result
    BEGIN_CHECKOUT: "begin_checkout",       // Clicked payment button
    PURCHASE: "purchase",                   // Payment success
    SHARE_RESULT: "share_result"            // Clicked share
};
