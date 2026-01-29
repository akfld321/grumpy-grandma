"use client";

import React, { useState } from 'react';

export default function AdminDashboard() {
    const [adminKey, setAdminKey] = useState('');
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [users, setUsers] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            const res = await fetch('/api/admin/users?limit=100', {
                headers: {
                    'x-admin-key': adminKey
                }
            });

            if (!res.ok) {
                throw new Error('인증 실패: 비밀번호를 확인해주세요.');
            }

            const data = await res.json();
            setUsers(data);
            setIsLoggedIn(true);
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const refreshData = () => {
        handleLogin({ preventDefault: () => { } } as any);
    };

    if (!isLoggedIn) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-stone-900 text-stone-200">
                <form onSubmit={handleLogin} className="bg-stone-800 p-8 rounded-xl border border-stone-700 w-full max-w-md">
                    <h1 className="text-2xl font-bold mb-6 text-center">관리자 로그인</h1>

                    <div className="mb-4">
                        <label className="block text-sm mb-2">관리자 비밀키 (Admin Secret Key)</label>
                        <input
                            type="password"
                            value={adminKey}
                            onChange={(e) => setAdminKey(e.target.value)}
                            className="w-full bg-stone-900 border border-stone-600 rounded p-3 text-white focus:outline-none focus:border-amber-500"
                            placeholder="비밀키를 입력하세요"
                        />
                    </div>

                    {error && <p className="text-red-400 text-sm mb-4 text-center">{error}</p>}

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-amber-600 hover:bg-amber-500 text-white font-bold py-3 rounded transition disabled:opacity-50"
                    >
                        {loading ? '확인 중...' : '접속하기'}
                    </button>
                </form>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-stone-950 text-stone-200 p-8">
            <div className="max-w-6xl mx-auto">
                <div className="flex justify-between items-center mb-8">
                    <h1 className="text-3xl font-bold text-amber-500">욕쟁이 할머니 - 고객 관리</h1>
                    <button onClick={refreshData} className="px-4 py-2 bg-stone-800 rounded hover:bg-stone-700">
                        🔄 새로고침
                    </button>
                </div>

                <div className="bg-stone-900 rounded-xl overflow-hidden border border-stone-800">
                    <table className="w-full text-left">
                        <thead className="bg-stone-800 text-stone-400">
                            <tr>
                                <th className="p-4">등록일시</th>
                                <th className="p-4">이름</th>
                                <th className="p-4">생년월일</th>
                                <th className="p-4">전화번호</th>
                                <th className="p-4">결제여부</th>
                                <th className="p-4">관리</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-stone-800">
                            {users.map((user) => (
                                <tr key={user.id} className="hover:bg-stone-800/50">
                                    <td className="p-4 text-stone-400 text-sm">
                                        {new Date(user.created_at).toLocaleString('ko-KR')}
                                    </td>
                                    <td className="p-4 font-bold">{user.name}</td>
                                    <td className="p-4">{user.birth}</td>
                                    <td className="p-4 text-amber-200">{user.phone}</td>
                                    <td className="p-4">
                                        {user.isPaid ? (
                                            <span className="bg-green-900 text-green-300 px-2 py-1 rounded text-xs">결제완료</span>
                                        ) : (
                                            <span className="bg-stone-700 text-stone-400 px-2 py-1 rounded text-xs">무료</span>
                                        )}
                                    </td>
                                    <td className="p-4">
                                        <a href={`/share/${user.id}`} target="_blank" className="text-blue-400 hover:underline text-sm">
                                            결과보기
                                        </a>
                                    </td>
                                </tr>
                            ))}
                            {users.length === 0 && (
                                <tr>
                                    <td colSpan={6} className="p-8 text-center text-stone-500">
                                        데이터가 없습니다.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
