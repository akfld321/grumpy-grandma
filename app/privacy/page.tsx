export default function PrivacyPage() {
    return (
        <div className="min-h-screen bg-white text-stone-900 font-sans p-6 md:p-12">
            <div className="max-w-3xl mx-auto">
                <h1 className="text-2xl font-bold mb-8 pb-4 border-b border-stone-200">개인정보처리방침</h1>

                <div className="space-y-6 text-sm text-stone-600 leading-relaxed">
                    <section>
                        <h2 className="text-base font-bold text-stone-900 mb-2">1. 개인정보의 처리 목적</h2>
                        <p>'(주)그럼피그랜마'는 다음의 목적을 위하여 개인정보를 처리합니다. 처리하고 있는 개인정보는 다음의 목적 이외의 용도로는 이용되지 않습니다.</p>
                        <ul className="list-disc pl-5 mt-2 space-y-1">
                            <li>서비스 제공: 사주 분석 결과 생성 및 제공</li>
                            <li>결제 처리: 유료 서비스 이용에 따른 요금 정산</li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="text-base font-bold text-stone-900 mb-2">2. 수집하는 개인정보 항목</h2>
                        <p>회사는 서비스 제공을 위해 아래와 같은 정보를 수집합니다.</p>
                        <ul className="list-disc pl-5 mt-2 space-y-1">
                            <li>필수항목: 생년월일, 태어난 시간, 성별</li>
                            <li>자동수집: 접속 로그, 접속 IP 정보</li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="text-base font-bold text-stone-900 mb-2">3. 개인정보의 보유 및 이용기간</h2>
                        <p>회사는 법령에 따른 개인정보 보유·이용기간 또는 정보주체로부터 개인정보를 수집 시에 동의받은 개인정보 보유·이용기간 내에서 개인정보를 처리·보유합니다.</p>
                        <ul className="list-disc pl-5 mt-2 space-y-1">
                            <li>소비자의 불만 또는 분쟁처리에 관한 기록: 3년</li>
                            <li>대금결제 및 재화 등의 공급에 관한 기록: 5년</li>
                        </ul>
                    </section>

                    <div className="bg-stone-50 p-4 border border-stone-200 rounded mt-8">
                        <p className="text-xs text-stone-500">
                            * 본 방침은 PG사 심사를 위한 예시 텍스트입니다. 실제 운영 시 법적 자문을 거친 내용으로 교체하시기 바랍니다.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
