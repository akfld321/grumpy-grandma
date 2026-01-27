'use client';

import React, { useState } from 'react';
import Link from 'next/link';

export default function AdminRecoveryPage() {
    const [password, setPassword] = useState('');
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [query, setQuery] = useState('');
    const [results, setResults] = useState<any[]>([]);
    const [stats, setStats] = useState<any>(null); // NEW: Stats State
    const [loading, setLoading] = useState(false);
    const [msg, setMsg] = useState('');
    const [filter, setFilter] = useState<'all' | 'paid' | 'free'>('all');

    // Derived State for Filtering on Client Side
    const filteredResults = React.useMemo(() => {
        if (filter === 'all') return results;
        if (filter === 'paid') return results.filter(r => r.is_paid);
        if (filter === 'free') return results.filter(r => !r.is_paid);
        return results;
    }, [results, filter]);

    // Check LocalStorage on Mount
    React.useEffect(() => {
        const storedPw = localStorage.getItem('admin_pw');
        if (storedPw) {
            setPassword(storedPw);
            setIsAuthenticated(true);
            fetchResults('', storedPw);
        }
    }, []);

    const handleLogin = (e: React.FormEvent) => {
        e.preventDefault();
        if (password === 'grandma1234') {
            localStorage.setItem('admin_pw', password);
            setIsAuthenticated(true);
            fetchResults('', password);
        } else {
            alert('비밀번호가 틀렸습니다.');
        }
    };

    const handleLogout = () => {
        localStorage.removeItem('admin_pw');
        setPassword('');
        setIsAuthenticated(false);
        setResults([]);
        setStats(null);
    };

    const handleRefresh = () => {
        fetchResults(query, password);
    };

    const fetchResults = async (searchQuery: string, authPw = password) => {
        setLoading(true);
        setResults([]);
        setMsg('');

        try {
            // 1. Fetch Search Results
            const res = await fetch('/api/admin/search', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ password: authPw, query: searchQuery })
            });

            if (res.status === 401) {
                localStorage.removeItem('admin_pw');
                setIsAuthenticated(false);
                throw new Error("인증 실패: 다시 로그인해주세요.");
            }

            if (!res.ok) throw new Error("데이터 로드 실패");

            const data = await res.json();
            if (data.results) {
                setResults(data.results);
                if (data.results.length === 0) setMsg("데이터가 없습니다.");
            }

            // 2. Fetch Stats (Only on initial load or empty query)
            if (!searchQuery) {
                const statsRes = await fetch('/api/admin/stats', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ password: authPw })
                });
                if (statsRes.ok) {
                    const statsData = await statsRes.json();
                    setStats(statsData.stats);
                }
            }

        } catch (err: any) {
            setMsg(err.message);
        } finally {
            setLoading(false);
        }
    };

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        fetchResults(query, password);
    };

    const copyLink = (id: string) => {
        const url = `${window.location.origin}/share/${id}`;
        navigator.clipboard.writeText(url);
        alert('링크 복사 완료!');
    };

    if (!isAuthenticated) {
        return (
            <div className="min-h-screen bg-stone-900 flex items-center justify-center p-4">
                <form onSubmit={handleLogin} className="bg-stone-800 p-8 rounded-xl border border-stone-700 w-full max-w-sm">
                    <h1 className="text-xl font-bold text-white mb-6 text-center">🔐 관리자 접속</h1>
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="관리자 비밀번호"
                        className="w-full bg-stone-900 border border-stone-600 p-3 rounded text-white mb-4 outline-none focus:border-amber-500"
                    />
                    <button type="submit" className="w-full bg-amber-600 hover:bg-amber-700 text-white font-bold py-3 rounded transition">
                        접속하기
                    </button>
                </form>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-stone-900 text-stone-200 p-6">
            <div className="max-w-3xl mx-auto">
                {/* Header */}
                <div className="flex justify-between items-center mb-8 border-b border-stone-800 pb-4">
                    <div>
                        <h1 className="text-2xl font-bold text-amber-500 mb-1">🔍 할머니 장부 (Admin)</h1>
                        <p className="text-stone-500 text-sm">고객 결과지를 조회하고 링크를 따가거라.</p>
                    </div>
                    <div className="flex gap-2">
                        <button
                            onClick={handleRefresh}
                            className="bg-stone-700 hover:bg-stone-600 text-white px-4 py-2 rounded font-bold text-sm transition flex items-center gap-2"
                        >
                            🔄 새로고침
                        </button>
                        <button
                            onClick={handleLogout}
                            className="bg-red-900/50 hover:bg-red-900/80 text-red-200 px-4 py-2 rounded font-bold text-sm transition"
                        >
                            🔓 비밀번호 변경(로그아웃)
                        </button>
                    </div>
                </div>

                {/* --- STATS DASHBOARD --- */}
                {stats && (
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                        <div className="bg-stone-800 p-4 rounded-xl border border-stone-700">
                            <h3 className="text-stone-500 text-xs font-bold uppercase tracking-wider mb-1">💰 예상 매출 (가상)</h3>
                            <p className="text-2xl font-black text-white">₩{(stats.paidUsers * 29800).toLocaleString()}</p>
                            <p className="text-[10px] text-stone-500 mt-1">총 {stats.paidUsers}명 결제 (29,800원 기준)</p>
                        </div>
                        <div className="bg-stone-800 p-4 rounded-xl border border-stone-700">
                            <h3 className="text-stone-500 text-xs font-bold uppercase tracking-wider mb-1">📅 오늘 방문/결제</h3>
                            <p className="text-2xl font-black text-white">{stats.today.total} <span className="text-sm text-stone-500 font-normal">/ {stats.today.paid}</span></p>
                            <p className="text-[10px] text-stone-500 mt-1">오늘 신규 / 유료</p>
                        </div>
                        <div className="bg-stone-800 p-4 rounded-xl border border-stone-700">
                            <h3 className="text-stone-500 text-xs font-bold uppercase tracking-wider mb-1">📊 전체 전환율</h3>
                            <p className="text-2xl font-black text-amber-500">{stats.conversionRate}%</p>
                            <p className="text-[10px] text-stone-500 mt-1">전체 {stats.totalUsers}명 중</p>
                        </div>
                        <div className="bg-stone-800 p-4 rounded-xl border border-stone-700 relative overflow-hidden">
                            <div className="absolute top-0 right-0 p-2 opacity-10 text-4xl">🤖</div>
                            <h3 className="text-stone-500 text-xs font-bold uppercase tracking-wider mb-1">💸 AI API 비용</h3>
                            <p className="text-2xl font-black text-red-400">${stats.api?.estimatedCostUSD || '0.00'}</p>
                            <p className="text-[10px] text-stone-500 mt-1">Est. Gemini Usage</p>
                        </div>
                    </div>
                )}

                {/* Search Bar & Filters */}
                <div className="flex flex-col md:flex-row gap-4 mb-8">
                    <form onSubmit={handleSearch} className="flex gap-2 flex-1">
                        <input
                            type="text"
                            value={query}
                            onChange={(e) => setQuery(e.target.value)}
                            placeholder="이름 검색 (홍길동)"
                            className="flex-1 bg-stone-800 border border-stone-700 p-4 rounded-lg text-lg text-white outline-none focus:border-amber-500 placeholder:text-stone-600"
                        />
                        <button
                            type="submit"
                            disabled={loading}
                            className="bg-amber-600 hover:bg-amber-700 text-white font-bold px-6 rounded-lg transition disabled:opacity-50 whitespace-nowrap"
                        >
                            {loading ? '검색...' : '검색'}
                        </button>
                    </form>

                    {/* Filter Tabs */}
                    <div className="flex bg-stone-800 p-1 rounded-lg border border-stone-700 shrink-0">
                        {['all', 'paid', 'free'].map((f) => (
                            <button
                                key={f}
                                onClick={() => setFilter(f as any)}
                                className={`px-4 py-2 rounded-md text-sm font-bold transition-all ${filter === f
                                    ? f === 'paid' ? 'bg-amber-500 text-black shadow-lg' : 'bg-stone-600 text-white'
                                    : 'text-stone-500 hover:text-stone-300'
                                    }`}
                            >
                                {f === 'all' && '전체'}
                                {f === 'paid' && '👑 유료회원'}
                                {f === 'free' && '무료체험'}
                            </button>
                        ))}
                    </div>
                </div>

                {msg && <div className="bg-stone-800/50 p-4 rounded text-center text-stone-400 mb-6 border border-stone-800">{msg}</div>}

                {/* Results List */}
                <div className="space-y-3">
                    {filteredResults.map((item) => (
                        <div
                            key={item.id}
                            className={`
                                p-5 rounded-lg border transition flex justify-between items-center group
                                ${item.is_paid
                                    ? 'bg-stone-800/80 border-amber-500/50 shadow-[0_0_15px_rgba(245,158,11,0.1)]'
                                    : 'bg-stone-800 border-stone-700 hover:border-stone-600'}
                            `}
                        >
                            <div className="flex items-center gap-4">
                                <div className={`w-12 h-12 rounded-full flex items-center justify-center text-2xl relative ${item.is_paid ? 'bg-amber-900/40 border border-amber-500/50' : 'bg-stone-700'}`}>
                                    {item.birth_data?.gender === 'male' ? '🧔' : '👩'}
                                    {item.is_paid && <div className="absolute -top-1 -right-1 text-xs">👑</div>}
                                </div>
                                <div>
                                    <h3 className="text-lg font-bold text-white flex items-center gap-2">
                                        {item.user_name}
                                        {item.is_paid && <span className="text-[10px] bg-amber-500 text-black px-1.5 py-0.5 rounded font-black">PREMIUM</span>}
                                        <span className="text-stone-500 text-xs font-normal bg-stone-900 px-2 py-0.5 rounded">
                                            {item.birth_data?.birthDate}
                                        </span>
                                    </h3>
                                    <p className="text-stone-500 text-xs mt-0.5">
                                        ID: {item.id.slice(0, 8)}... &middot; {new Date(item.created_at).toLocaleString()}
                                    </p>
                                </div>
                            </div>
                            <div className="flex gap-2">
                                <Link
                                    href={`/share/${item.id}`}
                                    target="_blank"
                                    className="px-3 py-2 rounded text-sm font-bold text-stone-400 hover:text-white hover:bg-stone-700 transition"
                                >
                                    보기
                                </Link>
                                <button
                                    onClick={() => copyLink(item.id)}
                                    className={`px-4 py-2 rounded text-sm font-bold shadow-lg active:scale-95 transition ${item.is_paid ? 'bg-amber-600 hover:bg-amber-500 text-white shadow-amber-900/20' : 'bg-stone-700 hover:bg-stone-600 text-stone-300'}`}
                                >
                                    🔗 링크
                                </button>
                            </div>
                        </div>
                    ))}

                    {!loading && filteredResults.length === 0 && !msg && (
                        <div className="text-center py-12 text-stone-600">
                            {filter === 'paid' ? '유료 회원이 없습니다.' : '데이터가 없습니다.'}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
