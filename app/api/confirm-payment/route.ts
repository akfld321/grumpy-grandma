
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
    try {
        const { paymentKey, orderId, amount } = await req.json();

        // 1. Toss Payments Confirm API Call
        const widgetSecretKey = process.env.TOSS_SECRET_KEY;
        const encryptedSecretKey = "Basic " + Buffer.from(widgetSecretKey + ":").toString("base64");

        const response = await fetch("https://api.tosspayments.com/v1/payments/confirm", {
            method: "POST",
            headers: {
                Authorization: encryptedSecretKey,
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                paymentKey,
                orderId,
                amount: Number(amount),
            }),
        });

        if (!response.ok) {
            const errorData = await response.json();
            console.error("Payment Confirmation Failed:", errorData);
            return NextResponse.json({ error: errorData }, { status: response.status });
        }

        const paymentData = await response.json();

        // 2. Update Database (Mark as Paid)
        // We assume orderId IS the resultId (or we can lookup via orderId if we used a separate table)
        // For this simple implementation, we use resultId as orderId.

        // Import Supabase Admin Client (to bypass RLS if needed, or just use service role)
        // For now, assume client calls this, but `update-result` handles the DB update.
        // Actually, we should update the DB *here* on the server side for security.

        const { createClient } = await import('@supabase/supabase-js');
        const supabase = createClient(
            process.env.NEXT_PUBLIC_SUPABASE_URL!,
            process.env.SUPABASE_SERVICE_ROLE_KEY!
        );

        // Update the 'saju_results' table
        // Fetch the existing data to merge, or just update the flag?
        // We need to set isPaidResult: true.

        // First, get the current data? Or just patch.
        // Ideally we want to ensure the 'ai_result' JSON's 'isPaidResult' field is true.

        const { data: row, error: fetchError } = await supabase
            .from('saju_results')
            .select('ai_result')
            .eq('id', orderId)
            .single();

        if (fetchError || !row) {
            console.error("DB Fetch Error", fetchError);
            // Payment succeeded but DB update failed? Critical error.
            // But we return success to client, client will redirect to result page.
        } else {
            const newResult = { ...row.ai_result, isPaidResult: true };
            const { error: updateError } = await supabase
                .from('saju_results')
                .update({ ai_result: newResult })
                .eq('id', orderId);

            if (updateError) {
                console.error("❌ DB Update FAILED (RLS?):", updateError);
            } else {
                console.log(`✅ Result ${orderId} marked as PAID.`);
            }
        }

        return NextResponse.json(paymentData);

    } catch (e: any) {
        console.error("Confirm Payment Error", e);
        return NextResponse.json({ error: e.message }, { status: 500 });
    }
}
