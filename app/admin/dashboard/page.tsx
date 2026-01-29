"use client";

import React, { useState, useEffect } from 'react';

export default function AdminDashboard() {
    // --- STATE: AUTH ---
    const [adminKey, setAdminKey] = useState('');
    const [isLoggedIn, setIsLoggedIn] = useState(false);

    // --- STATE: DATA ---
    const [stats, setStats] = useState<any>({
        visitors: 0, paidUsers: 0, revenue: 0, aiCost: 0,
        conversionRate: 0, tokenUsage: 0, refundedUsers: 0
    });
    const [users, setUsers] = useState<any[]>([]);

    // --- STATE: UI CONTROL ---
    const [loading, setLoading] = useState(false);

    // --- STATE: FILTERS & CONFIG ---
    const [datePreset, setDatePreset] = useState('all'); // today, yesterday, week, month, all, custom
    const [customStart, setCustomStart] = useState('');
    const [customEnd, setCustomEnd] = useState('');
    const [searchQuery, setSearchQuery] = useState('');
    const [unitPrice, setUnitPrice] = useState(29800); // Configurable Unit Price
    const [userTypeFilter, setUserTypeFilter] = useState('all'); // all, paid, free

    // --- STATE: PRIVACY ---
    const [showPII, setShowPII] = useState(false);

    // --- EFFECT: Initial Check ---
    useEffect(() => {
        const savedKey = sessionStorage.getItem('admin_key');
        if (savedKey) {
            setAdminKey(savedKey);
            setIsLoggedIn(true);
        }
    }, []);

    // --- EFFECT: Fetch Data on Filter Change ---
    useEffect(() => {
        if (isLoggedIn) {
            fetchStats();
            fetchUsers();
        }
    }, [isLoggedIn, datePreset, customStart, customEnd, unitPrice]);

    useEffect(() => {
        const timer = setTimeout(() => {
            if (isLoggedIn) fetchUsers();
        }, 500);
        return () => clearTimeout(timer);
    }, [searchQuery, userTypeFilter]);

    // --- ACTION: LOGIN ---
    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            const res = await fetch('/api/admin/stats', { headers: { 'x-admin-key': adminKey } });
            if (res.status === 401) throw new Error("비밀키가 틀렸습니다.");
            if (!res.ok) throw new Error("서버 오류");

            sessionStorage.setItem('admin_key', adminKey);
            setIsLoggedIn(true);
        } catch (e: any) {
            alert(e.message);
        } finally {
            setLoading(false);
        }
    };

    // --- ACTION: FETCH STATS ---
    const fetchStats = async () => {
        try {
            const query = buildDateQuery();
            const res = await fetch(`/api/admin/stats${query}`, { headers: { 'x-admin-key': adminKey } });
            const data = await res.json();
            if (!data.error) setStats(data);
        } catch (e) { console.error(e); }
    };

    // --- ACTION: FETCH USERS ---
    const fetchUsers = async () => {
        try {
            const params = new URLSearchParams();
            if (searchQuery) params.append('search', searchQuery);
            if (userTypeFilter !== 'all') params.append('type', userTypeFilter);
            params.append('limit', '200');

            const res = await fetch(`/api/admin/users?${params.toString()}`, { headers: { 'x-admin-key': adminKey } });
            const data = await res.json();
            if (Array.isArray(data)) setUsers(data);
        } catch (e) { console.error(e); }
    };

    // --- ACTION: TOGGLE REFUND ---
    const toggleRefund = async (id: string, currentStatus: boolean) => {
        if (!confirm(currentStatus ? "환불 취소 처리하시겠습니까?" : "이 결제 건을 '환불됨'으로 처리하시겠습니까? (매출에서 제외됨)")) return;

        setUsers(users.map(u => u.id === id ? { ...u, isRefunded: !currentStatus } : u));

        try {
            await fetch('/api/admin/users', {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json', 'x-admin-key': adminKey },
                body: JSON.stringify({ id, isRefunded: !currentStatus })
            });
            fetchStats();
        } catch (e) {
            alert('업데이트 실패');
            fetchUsers();
        }
    };

    // --- ACTION: EXPORT CSV ---
    const exportCSV = () => {
        const headers = ["ID", "등록일시", "이름", "생년월일", "전화번호", "구분", "결제금액", "환불여부"];
        const rows = users.map(u => [
            u.id,
            u.created_at,
            u.name,
            u.birth,
            u.phone,
            u.isPaid ? '유료' : '무료',
            u.amount,
            u.isRefunded ? '환불됨' : '-'
        ]);

        const csvContent = "data:text/csv;charset=utf-8,\uFEFF"
            + headers.join(",") + "\n"
            + rows.map(e => e.join(",")).join("\n");

        const link = document.createElement("a");
        link.setAttribute("href", encodeURI(csvContent));
        link.setAttribute("download", `saju_users_${new Date().toISOString().slice(0, 10)}.csv`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    // --- HELPER: Date Query ---
    const buildDateQuery = () => {
        const now = new Date();
        const fmt = (d: Date) => d.toISOString().split('T')[0];
        let start = '', end = fmt(now);

        if (datePreset === 'today') start = fmt(now);
        else if (datePreset === 'yesterday') {
            const d = new Date(); d.setDate(d.getDate() - 1); start = fmt(d); end = fmt(d);
        }
        else if (datePreset === 'week') {
            const d = new Date(); d.setDate(d.getDate() - 7); start = fmt(d);
        }
        else if (datePreset === 'month') {
            const d = new Date(); d.setDate(d.getDate() - 30); start = fmt(d);
        }
        else if (datePreset === 'custom') {
            start = customStart; end = customEnd;
        }

        return start ? `?startDate=${start}&endDate=${end}` : '';
    };

    // --- HELPER: Masking ---
    const maskName = (name: string) => showPII ? name : (name.length > 2 ? name[0] + '*' + name.slice(2) : name[0] + '*');
    const maskPhone = (phone: string) => showPII ? phone : phone.replace(/(\d{3})-\d{4}-(\d{4})/, '$1-****-$2');

    // --- RENDER: LOGIN ---
    if (!isLoggedIn) return (
        <div className="min-h-screen bg-stone-950 flex items-center justify-center p-4">
            <form onSubmit={handleLogin} className="bg-stone-900 border border-stone-800 p-8 rounded-2xl w-full max-w-sm shadow-2xl">
                <h1 className="text-2xl font-black text-amber-500 mb-6 text-center tracking-widest">관리자 접속</h1>
                <input type="password" value={adminKey} onChange={e => setAdminKey(e.target.value)} placeholder="관리자 키 입력 (Secret Key)"
                    className="w-full bg-black border border-stone-700 rounded-lg p-3 text-white mb-4 focus:border-amber-500 outline-none" />
                <button disabled={loading} className="w-full bg-amber-600 hover:bg-amber-500 text-white font-bold py-3 rounded-lg transition">
                    {loading ? '확인 중...' : '접속하기'}
                </button>
            </form>
        </div>
    );

    // Calc Revenue
    const computedRevenue = (stats.paidUsers - stats.refundedUsers) * unitPrice;
    const computedProfit = computedRevenue - stats.aiCost;

    return (
        <div className="min-h-screen bg-[#0E0E0E] text-stone-200 font-sans">
            {/* TOP BAR */}
            <div className="border-b border-stone-800 bg-black/50 sticky top-0 z-50 backdrop-blur-md">
                <div className="w-full px-6 py-4 flex flex-col md:flex-row justify-between items-center gap-4">
                    <div className="flex items-center gap-3">
                        <span className="text-2xl">👵</span>
                        <h1 className="text-xl font-bold text-white">욕쟁이 할머니 통합 관리</h1>
                        <span className="px-2 py-0.5 bg-amber-900/40 text-amber-500 text-xs rounded border border-amber-900/50">PRO</span>
                    </div>

                    <div className="flex items-center gap-2 bg-stone-900 p-1 rounded-lg border border-stone-800">
                        {[
                            { id: 'yesterday', label: '어제' },
                            { id: 'today', label: '오늘' },
                            { id: 'week', label: '7일' },
                            { id: 'month', label: '30일' },
                            { id: 'all', label: '전체' },
                            { id: 'custom', label: '📅 직접 선택' }
                        ].map(p => (
                            <button key={p.id} onClick={() => setDatePreset(p.id)}
                                className={`px-3 py-1.5 text-xs font-bold rounded-md transition ${datePreset === p.id ? 'bg-white text-black shadow-md' : 'text-stone-400 hover:text-white'}`}>
                                {p.label}
                            </button>
                        ))}
                    </div>

                    {/* Custom Date Picker (Visible only when 'custom' is selected) */}
                    {datePreset === 'custom' && (
                        <div className="flex items-center gap-2 animate-fadeIn bg-stone-900/80 p-1 rounded-lg border border-stone-700">
                            <input type="date" value={customStart} onChange={e => setCustomStart(e.target.value)}
                                className="bg-transparent text-white text-xs p-1 outline-none font-mono [color-scheme:dark]" />
                            <span className="text-stone-500 text-xs">~</span>
                            <input type="date" value={customEnd} onChange={e => setCustomEnd(e.target.value)}
                                className="bg-transparent text-white text-xs p-1 outline-none font-mono [color-scheme:dark]" />
                        </div>
                    )}

                    <button onClick={() => { sessionStorage.removeItem('admin_key'); setIsLoggedIn(false); }}
                        className="text-xs text-red-400 hover:text-red-300 font-bold px-3 py-1.5 border border-red-900/30 rounded bg-red-900/10">
                        로그아웃
                    </button>
                </div>
            </div>

            <main className="w-full px-6 py-8">

                {/* 1. CONFIG & METRICS */}
                <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 mb-8">
                    {/* Controller Card */}
                    <div className="bg-stone-900/50 border border-stone-800 p-5 rounded-xl flex flex-col justify-between">
                        <div>
                            <label className="text-xs font-bold text-stone-500 uppercase">개객단가 설정 (시뮬레이터)</label>
                            <input type="number" value={unitPrice} onChange={e => setUnitPrice(Number(e.target.value))}
                                className="w-full bg-transparent text-2xl font-black text-amber-500 outline-none border-b border-stone-700 focus:border-amber-500 mt-1 pb-1" />
                        </div>
                        <div className="mt-4 pt-4 border-t border-stone-800 flex justify-between items-center">
                            <span className="text-xs text-stone-500">총 방문자 수</span>
                            <span className="text-lg font-bold text-white">{stats.visitors.toLocaleString()}명</span>
                        </div>
                    </div>

                    <MetricCard title="예상 매출" value={computedRevenue} sub={`결제 ${stats.paidUsers - stats.refundedUsers}건 (환불 ${stats.refundedUsers}건)`} color="text-emerald-400" />
                    <MetricCard title="순수익 (추정)" value={computedProfit} sub={`마진율 ${computedRevenue > 0 ? Math.round((computedProfit / computedRevenue) * 100) : 0}%`} color="text-indigo-400" />
                    <MetricCard title="AI 사용 비용" value={stats.aiCost} sub={`토큰 사용량: ${(stats.tokenUsage / 1000000).toFixed(2)}M`} color="text-pink-400" />
                </div>

                {/* 2. DATA TABLE CONTROLS */}
                <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-4">
                    <div className="flex gap-2">
                        <div className="relative">
                            <input type="text" placeholder="이름 또는 전화번호 검색..." value={searchQuery} onChange={e => setSearchQuery(e.target.value)}
                                className="bg-stone-900 border border-stone-800 pl-9 pr-4 py-2 rounded-lg text-sm text-white w-64 focus:border-stone-600 outline-none" />
                            <span className="absolute left-3 top-2.5 text-stone-500">🔍</span>
                        </div>
                        <select value={userTypeFilter} onChange={e => setUserTypeFilter(e.target.value)}
                            className="bg-stone-900 border border-stone-800 px-3 py-2 rounded-lg text-sm text-stone-300 outline-none">
                            <option value="all">전체 보기</option>
                            <option value="paid">유료만 보기</option>
                            <option value="free">무료만 보기</option>
                        </select>
                    </div>

                    <div className="flex gap-2">
                        <button onClick={() => setShowPII(!showPII)} className={`px-4 py-2 rounded-lg text-sm font-bold border ${showPII ? 'bg-red-900/20 border-red-500 text-red-500' : 'bg-stone-900 border-stone-800 text-stone-400'}`}>
                            {showPII ? '👁️ 정보 보기' : '👁️ 정보 숨김'}
                        </button>
                        <button onClick={exportCSV} className="px-4 py-2 bg-green-900/20 border border-green-800 hover:bg-green-900/40 text-green-400 rounded-lg text-sm font-bold">
                            📥 엑셀 다운로드
                        </button>
                    </div>
                </div>

                {/* 3. DATA TABLE */}
                <div className="bg-stone-900 border border-stone-800 rounded-xl overflow-hidden shadow-2xl">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead className="bg-[#111] text-stone-500 text-xs uppercase tracking-wider">
                                <tr>
                                    <th className="p-4 border-b border-stone-800">시간</th>
                                    <th className="p-4 border-b border-stone-800">고객 정보</th>
                                    <th className="p-4 border-b border-stone-800">연락처</th>
                                    <th className="p-4 border-b border-stone-800 text-right">결제 금액</th>
                                    <th className="p-4 border-b border-stone-800 text-center">상태</th>
                                    <th className="p-4 border-b border-stone-800 text-right">관리</th>
                                </tr>
                            </thead>
                            <tbody className="text-sm divide-y divide-stone-800">
                                {users.map(u => (
                                    <tr key={u.id} className="hover:bg-white/5 transition">
                                        <td className="p-4 text-stone-400 whitespace-nowrap">
                                            {new Date(u.created_at).toLocaleString('ko-KR', { month: 'numeric', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                                        </td>
                                        <td className="p-4">
                                            <div className="font-bold text-white">{maskName(u.name)}</div>
                                            <div className="text-xs text-stone-500">{u.birth}</div>
                                        </td>
                                        <td className="p-4 text-stone-300 font-mono">
                                            {maskPhone(u.phone)}
                                        </td>
                                        <td className="p-4 text-right font-mono text-stone-300">
                                            {new Intl.NumberFormat('ko-KR').format(u.amount)}원
                                        </td>
                                        <td className="p-4 text-center">
                                            {u.isRefunded ? (
                                                <span className="px-2 py-1 rounded text-xs font-bold bg-red-500/10 text-red-500 border border-red-500/20">환불됨</span>
                                            ) : u.isPaid ? (
                                                <span className="px-2 py-1 rounded text-xs font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">결제완료</span>
                                            ) : (
                                                <span className="px-2 py-1 rounded text-xs font-bold bg-stone-700 text-stone-400">무료</span>
                                            )}
                                        </td>
                                        <td className="p-4 text-right">
                                            <div className="flex justify-end gap-2">
                                                <a href={`/share/${u.id}`} target="_blank" className="px-2 py-1 rounded border border-stone-700 hover:bg-stone-800 text-xs text-stone-400">보기</a>
                                                {u.isPaid && (
                                                    <button onClick={() => toggleRefund(u.id, u.isRefunded)}
                                                        className={`px-2 py-1 rounded border text-xs font-bold ${u.isRefunded ? 'border-stone-700 text-stone-500' : 'border-red-900/50 text-red-400 hover:bg-red-900/20'}`}>
                                                        {u.isRefunded ? '복구' : '환불'}
                                                    </button>
                                                )}
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                        {users.length === 0 && <div className="p-10 text-center text-stone-600">데이터가 없습니다.</div>}
                    </div>
                </div>
            </main>
        </div>
    );
}

function MetricCard({ title, value, sub, color = "text-white" }: any) {
    return (
        <div className="bg-stone-900/50 border border-stone-800 p-5 rounded-xl flex flex-col justify-between hover:bg-stone-900 transition">
            <h3 className="text-xs font-bold text-stone-500 uppercase">{title}</h3>
            <div>
                <div className={`text-2xl font-black mt-1 ${color}`}>
                    {new Intl.NumberFormat('ko-KR', { style: 'currency', currency: 'KRW' }).format(value)}
                </div>
                <div className="text-xs text-stone-500 mt-1">{sub}</div>
            </div>
        </div>
    );
}
