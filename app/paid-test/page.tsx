"use client";

import React from 'react';
import PaidResult from '@/components/paid/PaidResult';
import { MOCK_PAID_RESULT } from '@/mocks/mockPaidResult';

export default function PaidResultTestPage() {
    return (
        <PaidResult data={MOCK_PAID_RESULT} />
    );
}
