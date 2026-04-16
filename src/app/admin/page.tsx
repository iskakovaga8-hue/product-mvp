"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

interface Stats {
  total: number;
  byStatus: Record<string, number>;
  completed: number;
  completionRate: number;
  avgScore: number;
}

interface UserRow {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  position: string | null;
  company: string | null;
  years_exp: number | null;
  status: string;
  created_at: string;
  overall_score: number | null;
  diagnostic_status: string | null;
}

const STATUS_LABELS: Record<string, { label: string; color: string }> = {
  new: { label: "Новый", color: "bg-blue-100 text-blue-700" },
  contacted: { label: "Связались", color: "bg-yellow-100 text-yellow-700" },
  in_program: { label: "В программе", color: "bg-green-100 text-green-700" },
};

export default function AdminDashboard() {
  const router = useRouter();
  const [stats, setStats] = useState<Stats | null>(null);
  const [users, setUsers] = useState<UserRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState("");
  const [search, setSearch] = useState("");

  const loadData = async () => {
    try {
      const [statsRes, usersRes] = await Promise.all([
        fetch("/api/admin/stats"),
        fetch(
          `/api/admin/users?status=${statusFilter}&search=${encodeURIComponent(search)}`
        ),
      ]);

      if (statsRes.status === 403 || usersRes.status === 403) {
        router.push("/admin/login");
        return;
      }

      const statsData = await statsRes.json();
      const usersData = await usersRes.json();
      setStats(statsData);
      setUsers(usersData.users || []);
    } catch {
      router.push("/admin/login");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [statusFilter, search]);

  const updateStatus = async (userId: string, newStatus: string) => {
    await fetch(`/api/admin/users/${userId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: newStatus }),
    });
    loadData();
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin h-8 w-8 border-4 border-navy border-t-transparent rounded-full" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-navy text-white px-6 py-4">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <h1 className="text-xl font-heading font-bold">
            Панель администратора
          </h1>
          <Link href="/" className="text-blue-200 hover:text-white text-sm">
            ← На сайт
          </Link>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Stats cards */}
        {stats && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            <StatCard
              label="Всего пользователей"
              value={stats.total}
              color="text-navy"
            />
            <StatCard
              label="Прошли диагностику"
              value={`${stats.completed} (${stats.completionRate}%)`}
              color="text-green-600"
            />
            <StatCard
              label="Средний балл"
              value={stats.avgScore}
              color="text-orange"
            />
            <StatCard
              label="В программе"
              value={stats.byStatus.in_program || 0}
              color="text-navy"
            />
          </div>
        )}

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <input
            type="text"
            placeholder="Поиск по имени или email..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="flex-1 px-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-navy"
          />
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-navy bg-white"
          >
            <option value="">Все статусы</option>
            <option value="new">Новые</option>
            <option value="contacted">Связались</option>
            <option value="in_program">В программе</option>
          </select>
        </div>

        {/* Users table */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="text-left px-4 py-3 font-medium text-gray-600">
                    Имя
                  </th>
                  <th className="text-left px-4 py-3 font-medium text-gray-600">
                    Email
                  </th>
                  <th className="text-left px-4 py-3 font-medium text-gray-600">
                    Должность
                  </th>
                  <th className="text-left px-4 py-3 font-medium text-gray-600">
                    Опыт
                  </th>
                  <th className="text-left px-4 py-3 font-medium text-gray-600">
                    Балл
                  </th>
                  <th className="text-left px-4 py-3 font-medium text-gray-600">
                    Статус
                  </th>
                  <th className="text-left px-4 py-3 font-medium text-gray-600">
                    Дата
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {users.map((user) => (
                  <tr key={user.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3 font-medium text-gray-800">
                      <Link
                        href={`/admin/users/${user.id}`}
                        className="text-navy hover:underline"
                      >
                        {user.name}
                      </Link>
                    </td>
                    <td className="px-4 py-3 text-gray-600">{user.email}</td>
                    <td className="px-4 py-3 text-gray-600">
                      {user.position || "—"}
                    </td>
                    <td className="px-4 py-3 text-gray-600">
                      {user.years_exp ? `${user.years_exp} лет` : "—"}
                    </td>
                    <td className="px-4 py-3">
                      {user.overall_score !== null ? (
                        <span className="font-semibold text-navy">
                          {Math.round(Number(user.overall_score))}
                        </span>
                      ) : (
                        <span className="text-gray-400">—</span>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      <select
                        value={user.status}
                        onChange={(e) =>
                          updateStatus(user.id, e.target.value)
                        }
                        className={`text-xs font-medium px-2 py-1 rounded-full border-0 cursor-pointer ${
                          STATUS_LABELS[user.status]?.color || ""
                        }`}
                      >
                        <option value="new">Новый</option>
                        <option value="contacted">Связались</option>
                        <option value="in_program">В программе</option>
                      </select>
                    </td>
                    <td className="px-4 py-3 text-gray-500 text-xs">
                      {new Date(user.created_at).toLocaleDateString("ru-RU")}
                    </td>
                  </tr>
                ))}
                {users.length === 0 && (
                  <tr>
                    <td
                      colSpan={7}
                      className="px-4 py-8 text-center text-gray-400"
                    >
                      Пользователи не найдены
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

function StatCard({
  label,
  value,
  color,
}: {
  label: string;
  value: number | string;
  color: string;
}) {
  return (
    <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
      <p className="text-sm text-gray-500 mb-1">{label}</p>
      <p className={`text-2xl font-heading font-bold ${color}`}>{value}</p>
    </div>
  );
}
