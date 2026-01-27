"use client";

import React, { useEffect, useState } from 'react';

export default function AdminDashboard() {
    // --- AUTHENTICATION STATE ---
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [loginId, setLoginId] = useState('');
    const [loginPw, setLoginPw] = useState('');

    const handleLogin = (e: React.FormEvent) => {
        e.preventDefault();
        const USERS: Record<string, string> = {
            'akfld321': 'rhks1xo2@',
            'guswo88': 'dbdlgus1!!'
        };

        if (USERS[loginId] === loginPw) {
            setIsLoggedIn(true);
            localStorage.setItem('admin_session', 'true');
        } else {
            alert('아이디 또는 비밀번호가 틀렸습니다.');
        }
    };

    // Auto-login check
    useEffect(() => {
        if (localStorage.getItem('admin_session') === 'true') {
            setIsLoggedIn(true);
        }
    }, []);


    // --- DASHBOARD STATE ---
    const [activeTab, setActiveTab] = useState('dashboard'); // 'dashboard', 'users'
    const [userTypeTab, setUserTypeTab] = useState('paid'); // 'paid', 'free' in Users view

    const [stats, setStats] = useState({
        visitors: 0,
        paidUsers: 0,
        revenue: 0,
        aiCost: 0,
        conversionRate: 0,
        tokenUsage: 0
    });

    const [recentLogs, setRecentLogs] = useState<any[]>([]);
    const [userList, setUserList] = useState<any[]>([]);

    const [loading, setLoading] = useState(false);

    // Date Filters
    const [datePreset, setDatePreset] = useState('today'); // today, yesterday, week, month, custom
    const [customStart, setCustomStart] = useState('');
    const [customEnd, setCustomEnd] = useState('');

    const fetchStats = async () => {
        if (!isLoggedIn) return;
        setLoading(true);
        try {
            // 1. Fetch Stats (filtered by date)
            const now = new Date();
            const formatDate = (d: Date) => d.toISOString().split('T')[0];

            let startDate = "";
            let endDate = formatDate(now);

            // Calculate Dates based on preset
            if (datePreset === 'today') {
                startDate = formatDate(now);
            } else if (datePreset === 'yesterday') {
                const y = new Date();
                y.setDate(now.getDate() - 1);
                startDate = formatDate(y);
                endDate = formatDate(y);
            } else if (datePreset === 'week') {
                const past = new Date();
                past.setDate(now.getDate() - 7);
                startDate = formatDate(past);
            } else if (datePreset === 'month') {
                const past = new Date();
                past.setDate(now.getDate() - 30);
                startDate = formatDate(past);
            } else if (datePreset === 'custom') {
                if (!customStart || !customEnd) {
                    setLoading(false);
                    return;
                }
                startDate = customStart;
                endDate = customEnd;
            }

            const query = startDate ? `?startDate=${startDate}&endDate=${endDate}` : '';
            const resStats = await fetch(`/api/admin/stats${query}`);
            const dataStats = await resStats.json();
            if (!dataStats.error) setStats(dataStats);

            // 2. Fetch Recent Logs (Top 5 Paid)
            const resLogs = await fetch(`/api/admin/users?limit=5&type=paid`);
            const dataLogs = await resLogs.json();
            if (!dataLogs.error) setRecentLogs(dataLogs);

        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const fetchUserList = async () => {
        if (!isLoggedIn) return;
        setLoading(true);
        try {
            const res = await fetch(`/api/admin/users?limit=100&type=${userTypeTab}`);
            const data = await res.json();
            if (!data.error) setUserList(data);
        } catch (e) {
            console.error(e);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (isLoggedIn && activeTab === 'dashboard') fetchStats();
        if (isLoggedIn && activeTab === 'users') fetchUserList();
    }, [datePreset, customStart, customEnd, isLoggedIn, activeTab, userTypeTab]);

    const formatCurrency = (val: number) => {
        return new Intl.NumberFormat('ko-KR', { style: 'currency', currency: 'KRW' }).format(val);
    };

    const formatDate = (isoString: string) => {
        if (!isoString) return '-';
        const d = new Date(isoString);
        return `${d.getMonth() + 1}/${d.getDate()} ${d.getHours()}:${d.getMinutes().toString().padStart(2, '0')}`;
    };

    // --- RENDER: LOGIN FORM ---
    if (!isLoggedIn) {
        return (
            <div className="min-h-screen bg-black flex items-center justify-center p-4">
                <div className="bg-stone-900 border border-stone-800 p-8 rounded-2xl w-full max-w-sm shadow-2xl">
                    <h1 className="text-2xl font-bold text-white mb-6 text-center">관리자 로그인</h1>
                    <form onSubmit={handleLogin} className="space-y-4">
                        <div>
                            <input
                                type="text"
                                placeholder="아이디"
                                value={loginId}
                                onChange={e => setLoginId(e.target.value)}
                                className="w-full bg-black border border-stone-700 rounded-lg p-3 text-white outline-none focus:border-amber-500"
                            />
                        </div>
                        <div>
                            <input
                                type="password"
                                placeholder="비밀번호"
                                value={loginPw}
                                onChange={e => setLoginPw(e.target.value)}
                                className="w-full bg-black border border-stone-700 rounded-lg p-3 text-white outline-none focus:border-amber-500"
                            />
                        </div>
                        <button type="submit" className="w-full bg-amber-600 hover:bg-amber-500 text-white font-bold py-3 rounded-lg transition">
                            접속하기
                        </button>
                    </form>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#0a0a0a] text-white font-sans p-4 md:p-8 lg:p-12">
            {/* Header */}
            <header className="flex flex-col xl:flex-row justify-between items-start xl:items-center mb-10 gap-6">
                <div>
                    <h1 className="text-3xl font-black bg-gradient-to-r from-amber-200 to-amber-500 bg-clip-text text-transparent">
                        ADMIN DASHBOARD
                    </h1>
                    <p className="text-stone-500 text-sm mt-1">욕쟁이 할머니 사주 · {loginId}님 접속 중</p>
                </div>

                {/* Main Navigation Tabs */}
                <div className="bg-stone-900 p-1 rounded-xl flex gap-1 border border-stone-800">
                    <button
                        onClick={() => setActiveTab('dashboard')}
                        className={`px-4 py-2 rounded-lg text-sm font-bold transition-all ${activeTab === 'dashboard' ? 'bg-amber-500 text-black' : 'text-stone-400 hover:text-white'
                            }`}
                    >
                        📊 대시보드
                    </button>
                    <button
                        onClick={() => setActiveTab('users')}
                        className={`px-4 py-2 rounded-lg text-sm font-bold transition-all ${activeTab === 'users' ? 'bg-amber-500 text-black' : 'text-stone-400 hover:text-white'
                            }`}
                    >
                        👥 사용자 목록
                    </button>
                </div>


                <button
                    onClick={() => { localStorage.removeItem('admin_session'); setIsLoggedIn(false); }}
                    className="ml-auto px-3 py-1.5 bg-red-900/30 text-red-400 rounded-lg text-xs font-bold hover:bg-red-900/50 whitespace-nowrap"
                >
                    로그아웃
                </button>
            </header>

            {/* CONTENT: DASHBOARD */}
            {activeTab === 'dashboard' && (
                <>
                    {/* Date Filters */}
                    <div className="flex flex-col md:flex-row gap-4 items-center bg-stone-900/50 p-2 rounded-xl border border-stone-800 w-full mb-8">
                        <div className="flex gap-1 overflow-x-auto w-full md:w-auto pb-2 md:pb-0">
                            {[
                                { id: 'today', label: '오늘' },
                                { id: 'yesterday', label: '어제' },
                                { id: 'week', label: '7일' },
                                { id: 'month', label: '30일' },
                                { id: 'all', label: '전체' },
                                { id: 'custom', label: '직접선택' },
                            ].map((btn) => (
                                <button
                                    key={btn.id}
                                    onClick={() => setDatePreset(btn.id)}
                                    className={`px-3 py-1.5 rounded-lg text-sm font-bold whitespace-nowrap transition-all ${datePreset === btn.id
                                        ? 'bg-amber-600/20 text-amber-500 border border-amber-500'
                                        : 'text-stone-400 hover:text-white hover:bg-stone-800'
                                        }`}
                                >
                                    {btn.label}
                                </button>
                            ))}
                        </div>
                        {datePreset === 'custom' && (
                            <div className="flex gap-2 items-center text-stone-950">
                                <input type="date" value={customStart} onChange={(e) => setCustomStart(e.target.value)} className="bg-stone-200 rounded px-2 py-1 text-xs font-bold" />
                                <span className="text-stone-500">~</span>
                                <input type="date" value={customEnd} onChange={(e) => setCustomEnd(e.target.value)} className="bg-stone-200 rounded px-2 py-1 text-xs font-bold" />
                            </div>
                        )}
                    </div>

                    {/* Stats Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 mb-10">
                        <StatCard title="총 예상 매출" value={formatCurrency(stats.revenue)} sub={`결제 ${stats.paidUsers}건`} icon="💰" hero loading={loading} />
                        <StatCard title="순수익 (추정)" value={formatCurrency(stats.revenue - stats.aiCost)} sub={`마진율 ${stats.revenue > 0 ? Math.round(((stats.revenue - stats.aiCost) / stats.revenue) * 100) : 0}%`} icon="💎" loading={loading} color="text-emerald-400" />
                        <StatCard title="AI API 비용 (x10)" value={formatCurrency(stats.aiCost)} sub={`${stats.tokenUsage.toLocaleString()} 토큰`} icon="🤖" loading={loading} color="text-red-400" />
                        <StatCard title="방문자 / 전환율" value={`${stats.visitors}명`} sub={`전환율 ${stats.conversionRate}%`} icon="👥" loading={loading} />
                    </div>

                    {/* Recent Logs & System Status */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        <div className="bg-stone-900 border border-stone-800 rounded-2xl p-6 shadow-xl">
                            <h3 className="text-xl font-bold mb-4 text-stone-300 flex justify-between items-center">
                                📊 최근 결제 (5건)
                                <button onClick={() => setActiveTab('users')} className="text-xs text-amber-500 hover:underline">더보기</button>
                            </h3>
                            <div className="space-y-2">
                                {recentLogs.length > 0 ? recentLogs.map((log: any) => (
                                    <div key={log.id} className="flex justify-between items-center bg-black/30 p-3 rounded-lg border border-stone-800/50">
                                        <div>
                                            <p className="font-bold text-sm text-white">{log.name} <span className="text-stone-500 text-xs">({log.birth})</span></p>
                                            <p className="text-xs text-stone-500">{formatDate(log.created_at)}</p>
                                        </div>
                                        <div className="text-right">
                                            <span className="text-emerald-400 font-bold block">+ {formatCurrency(log.amount)}</span>
                                            <span className="text-[10px] text-stone-600 bg-stone-900 px-1 rounded border border-stone-800">{log.id.slice(0, 6)}...</span>
                                        </div>
                                    </div>
                                )) : (
                                    <div className="text-center text-stone-600 py-10">데이터가 없습니다.</div>
                                )}
                            </div>
                        </div>

                        <div className="bg-stone-900 border border-stone-800 rounded-2xl p-6 shadow-xl">
                            <h3 className="text-xl font-bold mb-4 text-stone-300">⚡ 시스템 상태</h3>
                            <div className="space-y-4">
                                <div className="flex justify-between items-center bg-black/30 p-4 rounded-xl">
                                    <span className="text-stone-400">데이터베이스 (Supabase)</span>
                                    <span className="text-green-500 font-bold">● 정상</span>
                                </div>
                                <div className="flex justify-between items-center bg-black/30 p-4 rounded-xl">
                                    <span className="text-stone-400">결제 모듈 (Toss)</span>
                                    <span className="text-green-500 font-bold">● 정상</span>
                                </div>
                                <div className="flex justify-between items-center bg-black/30 p-4 rounded-xl">
                                    <span className="text-stone-400">AI 모델 (Gemini 2.0 Flash)</span>
                                    <span className="text-amber-500 font-bold">● 비용 최적화 중</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </>
            )}

            {/* CONTENT: USERS LIST */}
            {activeTab === 'users' && (
                <div className="bg-stone-900 border border-stone-800 rounded-2xl p-6 shadow-xl overflow-hidden">
                    <div className="flex gap-4 mb-6 border-b border-stone-800 pb-4">
                        <button onClick={() => setUserTypeTab('paid')} className={`text-lg font-bold pb-2 ${userTypeTab === 'paid' ? 'text-white border-b-2 border-amber-500' : 'text-stone-500'}`}>
                            💰 유료 결제 ({userList.length}명)
                        </button>
                        <button onClick={() => setUserTypeTab('free')} className={`text-lg font-bold pb-2 ${userTypeTab === 'free' ? 'text-white border-b-2 border-stone-500' : 'text-stone-500'}`}>
                            🆓 무료 체험
                        </button>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="text-stone-500 text-xs uppercase tracking-wider border-b border-stone-800">
                                    <th className="p-3">시간</th>
                                    <th className="p-3">이름/생년월일</th>
                                    <th className="p-3">연락처</th>
                                    <th className="p-3 text-right">금액</th>
                                    <th className="p-3 text-center">링크</th>
                                    <th className="p-3 text-right">상태</th>
                                </tr>
                            </thead>
                            <tbody className="text-sm">
                                {userList.map((user: any) => (
                                    <tr key={user.id} className="border-b border-stone-800/50 hover:bg-stone-800/30 transition">
                                        <td className="p-3 font-mono text-stone-400 text-xs">{formatDate(user.created_at)}</td>
                                        <td className="p-3 font-bold">
                                            {user.name} <span className="text-stone-500 font-normal">({user.birth})</span>
                                        </td>
                                        <td className="p-3 text-stone-300">{user.phone}</td>
                                        <td className="p-3 text-right font-mono">{formatCurrency(user.amount)}</td>
                                        <td className="p-3 text-center">
                                            <div className="flex justify-center gap-2">
                                                <a
                                                    href={`/share/${user.id}`}
                                                    target="_blank"
                                                    className="px-2 py-1 bg-stone-700 hover:bg-stone-600 rounded text-xs text-white"
                                                >
                                                    보기
                                                </a>
                                                <button
                                                    onClick={() => {
                                                        const url = `${window.location.origin}/share/${user.id}`;
                                                        navigator.clipboard.writeText(url);
                                                        alert('링크가 복사되었습니다!');
                                                    }}
                                                    className="px-2 py-1 bg-stone-800 hover:bg-stone-700 rounded text-xs text-stone-300"
                                                >
                                                    복사
                                                </button>
                                            </div>
                                        </td>
                                        <td className="p-3 text-right">
                                            {user.isPaid
                                                ? <span className="bg-emerald-500/10 text-emerald-400 px-2 py-1 rounded text-xs border border-emerald-500/20">PAYMENT_SUCCESS</span>
                                                : <span className="bg-stone-500/10 text-stone-500 px-2 py-1 rounded text-xs border border-stone-500/20">FREE_TRIER</span>}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                        {userList.length === 0 && <div className="text-center py-10 text-stone-500">데이터가 없습니다.</div>}
                    </div>
                </div>
            )}

            {/* Footer */}
            <footer className="mt-12 text-center text-stone-600 text-xs">
                © 2026 Ten Years Inc. Admin Portal
            </footer>
        </div>
    );
}

function StatCard({ title, value, sub, icon, hero = false, loading = false, color = "text-white" }: any) {
    return (
        <div className={`relative overflow-hidden rounded-2xl p-6 border transition-all hover:scale-[1.02] ${hero
            ? 'bg-gradient-to-br from-amber-600 to-amber-800 border-amber-500 shadow-[0_0_30px_rgba(245,158,11,0.3)]'
            : 'bg-stone-900 border-stone-800 shadow-xl'
            }`}>
            <div className="flex justify-between items-start mb-4">
                <h3 className={`text-sm font-bold uppercase tracking-wider ${hero ? 'text-amber-100' : 'text-stone-500'}`}>{title}</h3>
                <span className="text-2xl">{icon}</span>
            </div>
            {loading ? (
                <div className="h-10 w-24 bg-white/10 animate-pulse rounded"></div>
            ) : (
                <>
                    <div className={`text-3xl font-black mb-1 ${hero ? 'text-white' : color}`}>{value}</div>
                    <div className={`text-xs font-medium ${hero ? 'text-amber-200' : 'text-stone-500'}`}>{sub}</div>
                </>
            )}
        </div>
    );
}
