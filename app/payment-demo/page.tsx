"use client";

import React from 'react';
import PaidResult from '@/components/paid/PaidResult';
import { MOCK_PAID_RESULT } from '@/mocks/mockPaidResult';

export default function PaymentDemoPage() {
    // Force "Not Paid" state and start at Chapter 4 (Paywall/SalesPage)
    const demoData = {
        ...MOCK_PAID_RESULT,
        isPaidResult: false
    };

    return (
        <PaidResult
            data={demoData}
            initialChapter={4} // This ID triggers the SalesPage interception
        />
    );
}
