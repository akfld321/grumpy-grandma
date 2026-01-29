import React from 'react';

export default function PrivacyPage() {
    return (
        <div className="min-h-screen bg-white text-stone-900 font-sans p-6 md:p-12">
            <div className="max-w-3xl mx-auto">
                <h1 className="text-2xl font-bold mb-8 pb-4 border-b border-stone-200">(주) 텐이어즈 개인정보처리방침</h1>

                <div className="space-y-8 text-sm text-stone-600 leading-relaxed">
                    <p>
                        개인정보처리방침은 회사가 이용자의 데이터를 어떻게 다루는지를 투명하게 공개하는 문서로, 특히 사주 서비스는 개인 식별성이 높은 생체 데이터에 준하는 정보(생년월일시)를 다루므로 각별한 주의가 필요하다. 또한 AI 모델 학습 및 추론을 위해 제3자(OpenAI 등)에게 데이터를 전송하는 경우 이를 명확히 고지해야 한다.
                    </p>

                    <section className="bg-stone-50 p-6 rounded-lg border border-stone-100">
                        <h2 className="text-lg font-bold text-stone-900 mb-4 pb-2 border-b border-stone-200">[서문]</h2>
                        <p className="leading-7">
                            (주) 텐이어즈(이하 "회사")는 「개인정보 보호법」 제30조에 따라 정보주체의 개인정보를 보호하고 이와 관련한 고충을 신속하고 원활하게 처리할 수 있도록 하기 위하여 다음과 같이 개인정보 처리방침을 수립·공개합니다.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-lg font-bold text-stone-900 mb-4 pb-2 border-b border-stone-100">1. 개인정보의 처리목적</h2>
                        <p className="mb-4">회사는 다음의 목적을 위하여 개인정보를 처리합니다. 처리하고 있는 개인정보는 다음의 목적 이외의 용도로는 이용되지 않으며, 이용 목적이 변경되는 경우에는 「개인정보 보호법」 제18조에 따라 별도의 동의를 받는 등 필요한 조치를 이행할 예정입니다.</p>
                        <ul className="list-disc pl-5 space-y-2">
                            <li><strong>홈페이지 회원 가입 및 관리:</strong> 회원 가입 의사 확인, 회원제 서비스 제공에 따른 본인 식별·인증, 회원자격 유지·관리, 제한적 본인확인제 시행에 따른 본인확인, 서비스 부정이용 방지, 만 14세 미만 아동의 개인정보 처리 시 법정대리인의 동의 여부 확인</li>
                            <li><strong>서비스 제공 및 계약의 이행:</strong> AI 사주/운세 분석 결과 생성 및 제공, 콘텐츠 구매 및 요금 결제, 맞춤형 서비스 제공</li>
                            <li><strong>고충처리:</strong> 민원인의 신원 확인, 민원사항 확인, 사실조사를 위한 연락·통지, 처리결과 통보</li>
                            <li><strong>마케팅 및 광고 활용 (선택 시):</strong> 신규 서비스 개발, 이벤트 정보 및 참여기회 제공, 인구통계학적 특성에 따른 서비스 제공 및 광고 게재</li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="text-lg font-bold text-stone-900 mb-4 pb-2 border-b border-stone-100">2. 처리하는 개인정보의 항목 및 수집 방법</h2>
                        <p className="mb-4">① 회사는 다음의 개인정보 항목을 처리하고 있습니다.</p>
                        <ul className="list-disc pl-5 space-y-2">
                            <li><strong>회원 가입 시:</strong> [필수] 아이디, 비밀번호, 이름, 휴대전화번호, 이메일</li>
                            <li><strong>사주 서비스 이용 시:</strong> [필수] 생년월일, 태어난 시간, 성별, 양력/음력 구분
                                <br /><span className="text-stone-500 text-xs">법적 근거: 해당 정보는 사주 분석 서비스 제공을 위한 필수 정보로서, 정보주체의 동의하에 수집합니다.</span>
                            </li>
                            <li><strong>유료 결제 시:</strong> 카드사명, 카드번호(일부), 승인번호 등 결제 관련 정보</li>
                            <li><strong>서비스 이용 과정에서 자동 수집:</strong> IP 주소, 쿠키, 서비스 이용 기록, 방문 기록, 불량 이용 기록, 단말기 정보</li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="text-lg font-bold text-stone-900 mb-4 pb-2 border-b border-stone-100">3. 개인정보의 처리 및 보유기간</h2>
                        <p className="mb-4">
                            ① 회사는 법령에 따른 개인정보 보유·이용기간 또는 정보주체로부터 개인정보를 수집 시에 동의받은 개인정보 보유·이용기간 내에서 개인정보를 처리·보유합니다.<br />
                            ② 각각의 개인정보 처리 및 보유 기간은 다음과 같습니다.
                        </p>
                        <ul className="list-disc pl-5 space-y-2">
                            <li><strong>회원 가입 및 관리:</strong> 홈페이지 탈퇴 시까지. (단, 관계 법령 위반에 따른 수사·조사 등이 진행 중인 경우에는 해당 종료 시까지)</li>
                            <li><strong>재화 또는 서비스 제공:</strong> 재화·서비스 공급완료 및 요금결제·정산 완료 시까지.</li>
                            <li><strong>법령에 의한 정보보유 사유:</strong>
                                <ul className="list-disc pl-5 mt-2 space-y-1 text-stone-500">
                                    <li>계약 또는 청약철회 등에 관한 기록: 5년 (전자상거래법)</li>
                                    <li>대금결제 및 재화 등의 공급에 관한 기록: 5년 (전자상거래법)</li>
                                    <li>소비자의 불만 또는 분쟁처리에 관한 기록: 3년 (전자상거래법)</li>
                                    <li>웹사이트 방문 기록: 3개월 (통신비밀보호법)</li>
                                </ul>
                            </li>
                        </ul>

                        <div className="mt-8">
                            <h3 className="font-bold text-stone-800 mb-2">개인정보처리의 위탁</h3>
                            <p className="mb-2">회사는 원활한 개인정보 업무처리를 위하여 다음과 같이 개인정보 처리업무를 위탁하고 있습니다.</p>
                            <ul className="list-disc pl-5 space-y-1">
                                <li><strong>수탁자:</strong> (입력 필요)</li>
                                <li><strong>위탁 업무 내용:</strong> 데이터 저장 및 서버 관리, 시스템 유지보수</li>
                                <li><strong>위탁 기간:</strong> 서비스 이용 계약 종료 시 또는 위탁 계약 종료 시까지</li>
                            </ul>
                        </div>
                    </section>

                    <section>
                        <h2 className="text-lg font-bold text-stone-900 mb-4 pb-2 border-b border-stone-100">4. 정보주체와 법정대리인의 권리·의무 및 행사방법</h2>
                        <ol className="list-decimal pl-5 space-y-2">
                            <li>정보주체는 회사에 대해 언제든지 개인정보 열람·정정·삭제·처리정지 요구 등의 권리를 행사할 수 있습니다.</li>
                            <li>제1항에 따른 권리 행사는 회사에 대해 서면, 전자우편, 모사전송(FAX) 등을 통하여 하실 수 있으며 회사는 이에 대해 지체 없이 조치하겠습니다.</li>
                            <li>정보주체는 개인정보 침해로 인한 구제를 받기 위하여 개인정보분쟁조정위원회, 한국인터넷진흥원 개인정보침해신고센터 등에 분쟁해결이나 상담을 신청할 수 있습니다.</li>
                        </ol>
                    </section>

                    <section>
                        <h2 className="text-lg font-bold text-stone-900 mb-4 pb-2 border-b border-stone-100">5. 개인정보의 파기</h2>
                        <p className="mb-4">① 회사는 개인정보 보유기간의 경과, 처리목적 달성 등 개인정보가 불필요하게 되었을 때에는 지체 없이 해당 개인정보를 파기합니다.</p>
                        <p className="mb-2">② 파기절차 및 방법</p>
                        <ul className="list-disc pl-5 space-y-1">
                            <li><strong>파기절차:</strong> 파기 사유가 발생한 개인정보를 선정하고, 회사의 개인정보 보호책임자의 승인을 받아 파기합니다.</li>
                            <li><strong>파기방법:</strong> 전자적 파일 형태는 복구 및 재생이 불가능한 기술적 방법을 사용하여 삭제하며, 종이 문서는 분쇄하거나 소각하여 파기합니다.</li>
                        </ul>
                    </section>
                </div>
            </div>
        </div>
    );
}
