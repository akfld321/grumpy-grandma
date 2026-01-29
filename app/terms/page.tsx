import React from 'react';

export default function TermsPage() {
    return (
        <div className="min-h-screen bg-white text-stone-900 font-sans p-6 md:p-12">
            <div className="max-w-3xl mx-auto">
                <h1 className="text-2xl font-bold mb-8 pb-4 border-b border-stone-200">(주) 텐이어즈 서비스 이용약관</h1>

                <div className="space-y-8 text-sm text-stone-600 leading-relaxed">

                    <section>
                        <h2 className="text-lg font-bold text-stone-900 mb-4 pb-2 border-b border-stone-100">제 1 장 총 칙</h2>
                        <div className="space-y-6">
                            <article>
                                <h3 className="font-bold text-stone-800 mb-2">제 1 조 (목적)</h3>
                                <p>이 약관은 (주) 텐이어즈(이하 "회사")가 운영하는 웹사이트 및 애플리케이션(이하 "서비스")을 통해 제공하는 인공지능 기반 운세·사주 분석 및 관련 제반 서비스의 이용과 관련하여 회사와 회원 간의 권리, 의무 및 책임사항, 기타 필요한 사항을 규정함을 목적으로 합니다.</p>
                            </article>

                            <article>
                                <h3 className="font-bold text-stone-800 mb-2">제 2 조 (용어의 정의)</h3>
                                <p className="mb-2">이 약관에서 사용하는 용어의 정의는 다음과 같습니다.</p>
                                <ul className="list-disc pl-5 space-y-1">
                                    <li><strong>"서비스"</strong>라 함은 구현되는 단말기(PC, 휴대형 단말기 등 각종 유무선 장치를 포함)와 상관없이 회원이 이용할 수 있는 (주) 텐이어즈의 모든 AI 운세 분석 서비스를 의미합니다.</li>
                                    <li><strong>"회원"</strong>이라 함은 회사의 서비스에 접속하여 이 약관에 따라 회사와 이용계약을 체결하고 회사가 제공하는 서비스를 이용하는 고객을 말합니다.</li>
                                    <li><strong>"유료 서비스"</strong>라 함은 회사가 유료로 제공하는 각종 온라인 디지털 콘텐츠(AI 상세 사주 리포트, 궁합 분석, 월간 운세 구독권 등) 및 제반 서비스를 의미합니다.</li>
                                    <li><strong>"AI 결과물"</strong>이라 함은 회원의 입력 데이터(생년월일시 등)를 기반으로 회사의 인공지능 알고리즘이 생성하여 제공하는 텍스트, 이미지, 음성 등의 모든 결과물을 말합니다.</li>
                                    <li><strong>"포인트"</strong>라 함은 서비스의 효율적 이용을 위해 회사가 임의로 책정하거나 지급, 조정할 수 있는 재산적 가치가 있거나 없는 서비스 상의 가상 데이터를 말합니다.</li>
                                </ul>
                            </article>

                            <article>
                                <h3 className="font-bold text-stone-800 mb-2">제 3 조 (약관의 게시와 개정)</h3>
                                <ol className="list-decimal pl-5 space-y-2">
                                    <li>회사는 이 약관의 내용을 회원이 쉽게 알 수 있도록 서비스 초기 화면에 게시합니다.</li>
                                    <li>회사는 「전자상거래 등에서의 소비자보호에 관한 법률」, 「약관의 규제에 관한 법률」, 「정보통신망 이용촉진 및 정보보호 등에 관한 법률」 등 관련 법령을 위배하지 않는 범위에서 이 약관을 개정할 수 있습니다.</li>
                                    <li>회사가 약관을 개정할 경우에는 적용일자 및 개정사유를 명시하여 현행약관과 함께 제1항의 방식에 따라 그 개정약관의 적용일자 7일 전부터 적용일자 전일까지 공지합니다. 다만, 회원에게 불리한 약관의 개정의 경우에는 최소한 30일 이상의 유예기간을 두고 공지합니다. 이 경우 회사는 개정 전 내용과 개정 후 내용을 명확하게 비교하여 회원이 알기 쉽도록 표시합니다.</li>
                                </ol>
                            </article>
                        </div>
                    </section>

                    <section>
                        <h2 className="text-lg font-bold text-stone-900 mb-4 pb-2 border-b border-stone-100">제 2 장 서비스 이용계약</h2>
                        <div className="space-y-6">
                            <article>
                                <h3 className="font-bold text-stone-800 mb-2">제 4 조 (이용계약의 체결)</h3>
                                <ol className="list-decimal pl-5 space-y-2">
                                    <li>이용계약은 회원이 되고자 하는 자(이하 "가입신청자")가 약관의 내용에 대하여 동의를 한 다음 회원가입 신청을 하고 회사가 이러한 신청에 대하여 승낙함으로써 체결됩니다.</li>
                                    <li>
                                        회사는 가입신청자의 신청에 대하여 서비스 이용을 승낙함을 원칙으로 합니다. 다만, 회사는 다음 각 호에 해당하는 신청에 대하여는 승낙을 하지 않거나 사후에 이용계약을 해지할 수 있습니다.
                                        <ul className="list-disc pl-5 mt-1 space-y-1">
                                            <li>가입신청자가 이 약관에 의하여 이전에 회원자격을 상실한 적이 있는 경우</li>
                                            <li>실명이 아니거나 타인의 명의를 이용한 경우</li>
                                            <li>허위의 정보를 기재하거나, 회사가 제시하는 내용을 기재하지 않은 경우</li>
                                            <li>만 14세 미만 아동이 법정대리인(부모 등)의 동의를 얻지 아니한 경우</li>
                                        </ul>
                                    </li>
                                    <li>제1항에 따른 신청에 있어 회사는 전문기관을 통한 실명확인 및 본인인증을 요청할 수 있습니다.</li>
                                </ol>
                            </article>

                            <article>
                                <h3 className="font-bold text-stone-800 mb-2">제 5 조 (개인정보의 보호 및 관리)</h3>
                                <ol className="list-decimal pl-5 space-y-2">
                                    <li>회사는 관계 법령이 정하는 바에 따라 회원의 개인정보를 보호하기 위해 노력합니다. 개인정보의 보호 및 사용에 대해서는 관련 법령 및 회사의 개인정보처리방침이 적용됩니다.</li>
                                    <li>회사는 AI 사주 분석의 정확도를 높이기 위해 회원의 생년월일, 태어난 시각, 성별 등의 정보를 수집할 수 있으며, 회원은 이에 대해 정확한 정보를 제공해야 합니다. 회원이 제공한 정보의 부정확성으로 인해 발생하는 결과물의 오류에 대해 회사는 책임을 지지 않습니다.</li>
                                </ol>
                            </article>
                        </div>
                    </section>

                    <section>
                        <h2 className="text-lg font-bold text-stone-900 mb-4 pb-2 border-b border-stone-100">제 3 장 서비스의 이용 및 AI 특약</h2>
                        <div className="space-y-6">
                            <article>
                                <h3 className="font-bold text-stone-800 mb-2">제 6 조 (서비스의 제공 및 변경)</h3>
                                <ol className="list-decimal pl-5 space-y-2">
                                    <li>
                                        회사는 회원에게 아래와 같은 서비스를 제공합니다.
                                        <ul className="list-disc pl-5 mt-1 space-y-1">
                                            <li>AI 기반 사주, 신년운세, 토정비결 분석 서비스</li>
                                            <li>AI 챗봇 기반 운세 상담 서비스</li>
                                            <li>기타 회사가 추가 개발하거나 제휴계약 등을 통해 회원에게 제공하는 일체의 서비스</li>
                                        </ul>
                                    </li>
                                    <li>회사는 기술적 사양의 변경(AI 모델의 업데이트, 알고리즘 개선 등)이나 기타 불가피한 사유가 있는 경우 장차 체결되는 계약에 의해 제공할 서비스의 내용을 변경할 수 있습니다. 이 경우 변경된 서비스의 내용 및 제공일자를 명시하여 현재의 서비스 내용을 게시한 곳에 즉시 공지합니다.</li>
                                </ol>
                            </article>

                            <article>
                                <h3 className="font-bold text-stone-800 mb-2">제 7 조 (AI 서비스 이용에 관한 특약 및 면책)</h3>
                                <ul className="list-disc pl-5 space-y-2">
                                    <li><strong>결과의 참고적 성격:</strong> 회사가 제공하는 AI 사주 분석 결과는 명리학적 데이터와 인공지능 확률 모델에 기반한 것으로서, 그 내용의 과학적 정확성, 완전성, 미래의 실현 가능성을 보장하지 않습니다. 본 서비스의 결과는 회원의 인생에 대한 흥미 위주의 조언이나 참고 자료로만 활용되어야 합니다.</li>
                                    <li><strong>의사결정 면책:</strong> 회원은 서비스가 제공하는 정보를 바탕으로 중요한 법률적, 의학적, 재무적 결정을 내려서는 안 되며, 서비스 이용의 결과로 발생한 회원의 어떠한 손해나 손실(투자 손실, 정신적 고통 등)에 대해서도 회사는 법적 책임을 지지 않습니다. 전문적인 조언이 필요한 경우 반드시 해당 분야의 자격 있는 전문가와 상의해야 합니다.</li>
                                    <li><strong>생성형 AI의 한계:</strong> 인공지능 기술의 특성상 서비스 결과물에 사실과 다른 내용, 문맥에 맞지 않는 표현, 또는 반복적인 문장이 포함될 수 있음을 회원은 인지하고 동의합니다. 이러한 기술적 한계로 인한 사소한 오류는 서비스 하자로 간주되지 않습니다.</li>
                                    <li><strong>윤리적 필터링:</strong> 회사는 AI가 비윤리적, 혐오적, 또는 불법적인 내용을 생성하지 않도록 필터링 기술을 적용하나, 완벽한 차단을 보장하지는 않습니다. 만약 부적절한 답변이 생성될 경우 회원은 이를 회사에 신고할 수 있으며, 회사는 즉시 조치를 취합니다.</li>
                                </ul>
                            </article>
                        </div>
                    </section>

                    <section>
                        <h2 className="text-lg font-bold text-stone-900 mb-4 pb-2 border-b border-stone-100">제 4 장 유료 서비스 및 청약철회</h2>
                        <div className="space-y-6">
                            <article>
                                <h3 className="font-bold text-stone-800 mb-2">제 8 조 (유료 서비스의 이용 및 결제)</h3>
                                <ol className="list-decimal pl-5 space-y-2">
                                    <li>회사가 제공하는 서비스는 기본적으로 유료와 무료로 구분되며, 유료 서비스의 이용 요금 및 결제 방식은 서비스 내 해당 화면에 명시합니다.</li>
                                    <li>회원은 회사가 제공하는 신용카드, 계좌이체, 간편결제 등 다양한 결제 수단을 통해 유료 서비스를 이용할 수 있습니다.</li>
                                </ol>
                            </article>

                            <article>
                                <h3 className="font-bold text-stone-800 mb-2">제 9 조 (청약철회 및 환불 등)</h3>
                                <ol className="list-decimal pl-5 space-y-2">
                                    <li><strong>청약철회의 원칙:</strong> 회원이 구매한 유료 서비스에 대하여 「전자상거래 등에서의 소비자보호에 관한 법률」 제17조에 따라 계약내용에 관한 서면을 받은 날로부터 7일 이내에 청약철회를 할 수 있습니다.</li>
                                    <li>
                                        <strong>청약철회의 제한:</strong> 제1항에도 불구하고, 회원이 구매한 서비스가 다음 각 호에 해당하는 경우 청약철회가 제한될 수 있습니다.
                                        <ul className="list-disc pl-5 mt-1 space-y-1">
                                            <li>디지털 콘텐츠의 제공이 개시된 경우: 회원이 결제 후 '결과 보기' 버튼을 클릭하거나, 리포트가 화면에 출력된 경우. (단, 가분적 콘텐츠의 경우 제공되지 않은 부분은 제외)</li>
                                            <li>회원의 요청에 따라 개별적으로 주문 제작되는 콘텐츠의 경우 (예: 회원의 특정 질문에 대해 AI가 실시간으로 생성한 맞춤형 답변)</li>
                                        </ul>
                                    </li>
                                    <li><strong>제한 사실의 고지:</strong> 회사는 제2항에 따라 청약철회가 제한되는 콘텐츠에 대해서는 결제 화면 등 소비자가 쉽게 알 수 있는 곳에 청약철회가 제한된다는 사실을 명확히 표시하거나, 시험 사용 상품을 제공하는 등의 조치를 취합니다.</li>
                                    <li>
                                        <strong>환불 가능 사유:</strong> 다음 각 호의 경우에는 콘텐츠 열람 여부와 관계없이 청약철회 또는 환불이 가능합니다.
                                        <ul className="list-disc pl-5 mt-1 space-y-1">
                                            <li>시스템 오류로 인해 콘텐츠가 정상적으로 제공되지 않은 경우</li>
                                            <li>콘텐츠의 내용이 표시·광고 내용과 현저히 다르거나 계약 내용과 다르게 이행된 경우 (단, 운세 결과에 대한 주관적 불만족은 제외)</li>
                                        </ul>
                                    </li>
                                    <li><strong>구독 서비스의 해지:</strong> 월 정기 구독 서비스의 경우, 회원은 언제든지 구독 해지를 신청할 수 있습니다. 해지 신청 시 다음 결제 주기에 결제가 이루어지지 않으며, 이미 결제된 기간 동안은 서비스를 계속 이용할 수 있습니다. 회사는 해지 버튼을 찾기 어렵게 하거나 해지 절차를 복잡하게 하는 등의 행위(다크패턴)를 하지 않습니다.</li>
                                </ol>
                            </article>

                            <article>
                                <h3 className="font-bold text-stone-800 mb-2">제 10 조 (과오금의 환급)</h3>
                                <p>회사는 과오금이 발생한 경우 이용대금의 결제와 동일한 방법으로 과오금 전액을 환급하여야 합니다. 다만, 동일한 방법으로 환급이 불가능한 경우에는 이를 사전에 고지하고 이용자가 원하는 방법으로 환급합니다.</p>
                            </article>
                        </div>
                    </section>

                    <section>
                        <h2 className="text-lg font-bold text-stone-900 mb-4 pb-2 border-b border-stone-100">제 5 장 계약 당사자의 의무</h2>
                        <div className="space-y-6">
                            <article>
                                <h3 className="font-bold text-stone-800 mb-2">제 11 조 (회사의 의무)</h3>
                                <ol className="list-decimal pl-5 space-y-2">
                                    <li>회사는 법령과 이 약관이 금지하거나 공서양속에 반하는 행위를 하지 않으며, 계속적이고 안정적으로 서비스를 제공하기 위하여 최선을 다합니다.</li>
                                    <li>회사는 이용자가 안전하게 인터넷 서비스를 이용할 수 있도록 개인정보(신용정보 포함) 보호를 위한 보안 시스템을 갖추어야 하며, 개인정보처리방침을 공시하고 준수합니다.</li>
                                    <li>회사는 이용자로부터 제기되는 의견이나 불만이 정당하다고 인정할 경우에는 즉시 처리합니다. 즉시 처리가 곤란한 경우에는 이용자에게 그 사유와 처리 일정을 통보합니다.</li>
                                </ol>
                            </article>

                            <article>
                                <h3 className="font-bold text-stone-800 mb-2">제 12 조 (회원의 의무)</h3>
                                <p className="mb-2">회원은 다음 행위를 하여서는 안 됩니다.</p>
                                <ul className="list-disc pl-5 space-y-1">
                                    <li>신청 또는 변경 시 허위 내용의 등록 (타인의 생년월일 무단 사용 등)</li>
                                    <li>타인의 정보 도용</li>
                                    <li>회사가 게시한 정보의 변경</li>
                                    <li>회사가 정한 정보 이외의 정보(컴퓨터 프로그램 등) 등의 송신 또는 게시</li>
                                    <li>회사 및 기타 제3자의 저작권 등 지적재산권에 대한 침해</li>
                                    <li>회사 및 기타 제3자의 명예를 손상시키거나 업무를 방해하는 행위</li>
                                    <li>외설 또는 폭력적인 메시지, 화상, 음성, 기타 공서양속에 반하는 정보를 서비스에 공개 또는 게시하는 행위</li>
                                    <li>자동 접속 프로그램(매크로) 등을 이용하여 서비스를 비정상적으로 이용하는 행위</li>
                                </ul>
                            </article>
                        </div>
                    </section>

                    <section>
                        <h2 className="text-lg font-bold text-stone-900 mb-4 pb-2 border-b border-stone-100">제 6 장 기타</h2>
                        <div className="space-y-6">
                            <article>
                                <h3 className="font-bold text-stone-800 mb-2">제 13 조 (저작권의 귀속 및 이용제한)</h3>
                                <ol className="list-decimal pl-5 space-y-2">
                                    <li>회사가 작성한 저작물에 대한 저작권 및 기타 지적재산권은 회사에 귀속합니다. AI가 생성한 결과물에 대한 편집 저작권 또한 회사에 있습니다.</li>
                                    <li>회원은 서비스를 이용함으로써 얻은 정보를 회사의 사전 승낙 없이 복제, 송신, 출판, 배포, 방송 기타 방법에 의하여 영리목적으로 이용하거나 제3자에게 이용하게 하여서는 안 됩니다.</li>
                                </ol>
                            </article>

                            <article>
                                <h3 className="font-bold text-stone-800 mb-2">제 14 조 (재판권 및 준거법)</h3>
                                <ol className="list-decimal pl-5 space-y-2">
                                    <li>회사와 이용자 간에 발생한 전자상거래 분쟁에 관한 소송은 제소 당시의 이용자의 주소에 의하고, 주소가 없는 경우에는 거소를 관할하는 지방법원의 전속관할로 합니다. 다만, 제소 당시 이용자의 주소 또는 거소가 분명하지 않거나 외국 거주자의 경우에는 민사소송법상의 관할법원에 제기합니다.</li>
                                    <li>회사와 이용자 간에 제기된 전자상거래 소송에는 한국법을 적용합니다.</li>
                                </ol>
                            </article>
                        </div>
                    </section>

                    <section className="pt-4 border-t border-stone-200 mt-8">
                        <h3 className="font-bold text-stone-800 mb-2">&lt;부칙&gt;</h3>
                        <p>제1조 (시행일) 이 약관은 2026년 1월 26일부터 시행합니다.</p>
                    </section>

                </div>
            </div>
        </div>
    );
}
