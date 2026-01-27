export default function TermsPage() {
    return (
        <div className="min-h-screen bg-white text-stone-900 font-sans p-6 md:p-12">
            <div className="max-w-3xl mx-auto">
                <h1 className="text-2xl font-bold mb-8 pb-4 border-b border-stone-200">서비스 이용약관</h1>

                <div className="space-y-6 text-sm text-stone-600 leading-relaxed">
                    <section>
                        <h2 className="text-base font-bold text-stone-900 mb-2">제1조 (목적)</h2>
                        <p>본 약관은 (주)그럼피그랜마(이하 "회사")가 제공하는 유료 사주 분석 서비스(이하 "서비스")의 이용과 관련하여 회사와 회원의 권리, 의무 및 책임사항을 규정함을 목적으로 합니다.</p>
                    </section>

                    <section>
                        <h2 className="text-base font-bold text-stone-900 mb-2">제2조 (용어의 정의)</h2>
                        <ul className="list-disc pl-5 space-y-1">
                            <li>"서비스"란 회사가 AI 기술을 활용하여 제공하는 운세 및 사주 분석 콘텐츠를 의미합니다.</li>
                            <li>"이용자"란 본 약관에 따라 회사가 제공하는 서비스를 이용하는 회원을 말합니다.</li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="text-base font-bold text-stone-900 mb-2">제3조 (환불 정책)</h2>
                        <p>디지털 콘텐츠의 특성상, 결제 후 콘텐츠(사주 열람권)가 제공되거나 데이터 생성이 시작된 경우 전자상거래법에 의거하여 청약철회가 제한될 수 있습니다. 단, 회사의 귀책사유로 서비스 이용이 불가능한 경우 전액 환불합니다.</p>
                    </section>

                    <div className="bg-stone-50 p-4 border border-stone-200 rounded mt-8">
                        <p className="text-xs text-stone-500">
                            * 본 약관은 PG사 심사를 위한 예시 텍스트입니다. 실제 운영 시 법적 자문을 거친 약관으로 교체하시기 바랍니다.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
