type WindowWithDataLayer = Window & {
    dataLayer: Record<string, any>[];
};

declare const window: WindowWithDataLayer;

export const sendGTMEvent = (event: string, data?: Record<string, any>) => {
    if (typeof window === 'undefined') return;

    const eventData = {
        event,
        ...data,
        timestamp: new Date().toISOString(),
    };

    if (window.dataLayer) {
        window.dataLayer.push(eventData);
    } else {
        window.dataLayer = [eventData];
    }

    // Optional: Log for debugging in development
    if (process.env.NODE_ENV === 'development') {
        console.log('GTM Event:', eventData);
    }
};
