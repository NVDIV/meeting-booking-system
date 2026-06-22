"use client";

import { useEffect, useState } from "react";
import { ui } from "@/components/ui/ui";
import RoleSelect from "@/components/users/RoleSelect";

interface User {
  id: number;
  name: string;
  email: string;
  role: "USER" | "MANAGER" | "ADMIN";
  createdAt: string;
}

const roleLabels: Record<User["role"], string> = {
  USER: "Співробітник",
  MANAGER: "Менеджер офісу",
  ADMIN: "Адміністратор",
};

export default function UsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [currentUserRole, setCurrentUserRole] = useState<"USER" | "MANAGER" | "ADMIN" | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadData() {
      try {
        const token = localStorage.getItem("accessToken");

        // 1. Спочатку дізнаємося роль поточного користувача
        const meRes = await fetch("http://localhost:5000/api/auth/me", {
          method: "GET",
          headers: { Authorization: `Bearer ${token}` },
          cache: "no-store",
        });
        
        if (meRes.ok) {
          const meData = await meRes.json();
          setCurrentUserRole(meData.role);
        }

        // 2. Завантажуємо загальний список користувачів
        const usersRes = await fetch("http://localhost:5000/api/users", { cache: "no-store" });
        if (!usersRes.ok) throw new Error("Не вдалося завантажити реєстр користувачів.");
        
        const usersData = await usersRes.json();
        setUsers(usersData);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  // Оновлюємо стейт локально після успішної відповіді від бекенду
  function handleLocalRoleUpdate(userId: number, newRole: "USER" | "MANAGER" | "ADMIN") {
    setUsers((prevUsers) =>
      prevUsers.map((u) => (u.id === userId ? { ...u, role: newRole } : u))
    );
  }

  if (loading) {
    return (
      <div className="text-center py-20 text-xs font-mono text-cyan-500 animate-pulse">
        &gt; FETCHING_USER_REGISTRY... ЗЧИТУВАННЯ ПРАВ ДОСТУПУ_
      </div>
    );
  }

  const isAdmin = currentUserRole === "ADMIN";

  return (
    <div className="mx-auto max-w-6xl px-4 py-8">
      {/* Заголовок */}
      <div>
        <h1 className="text-xl font-semibold tracking-tight text-slate-100 font-mono">
          <span className="text-cyan-500">&gt;</span> Користувачі та права доступу_
        </h1>
        <p className="mt-1 text-xs text-slate-400 font-mono">
          Системний реєстр облікових записів співробітників та управління рівнями доступу.
        </p>
      </div>

      {error && (
        <div className="mt-4 p-2 bg-red-500/10 border border-red-500/20 text-red-400 font-mono text-xs rounded">
          [СИСТЕМНА ПОМИЛКА]: {error}
        </div>
      )}

      <div className="mt-6">
        <div className={`${ui.card} overflow-hidden border-l-2 border-l-cyan-500`}>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-slate-800 text-left text-sm text-slate-300">
              <thead className="bg-slate-900/50 text-xs font-semibold text-cyan-400 uppercase tracking-wider font-mono">
                <tr>
                  <th className="px-6 py-4 border-b border-slate-800">Ідентифікатор / Співробітник</th>
                  <th className="px-6 py-4 border-b border-slate-800">Робочий емейл</th>
                  <th className="px-6 py-4 border-b border-slate-800 text-right">
                    {isAdmin ? "Керування доступом" : "Системна роль"}
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 font-mono text-xs">
                {users.map((user) => (
                  <tr key={user.id} className="hover:bg-cyan-500/5 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-2">
                        <span className="text-slate-600 text-[10px]">#0{user.id}</span>
                        <div className="font-semibold text-slate-100 text-sm">{user.name}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-slate-400">{user.email}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-right">
                      {/* Умовний рендеринг: якщо АДМІН — показуємо селектор, інакше — закритий бейдж */}
                      {isAdmin ? (
                        <RoleSelect
                          userId={user.id}
                          currentRole={user.role}
                          onRoleUpdated={(newRole) => handleLocalRoleUpdate(user.id, newRole)}
                        />
                      ) : (
                        <span className={`inline-flex items-center rounded px-2 py-0.5 text-[10px] font-bold border uppercase tracking-wide ${
                          user.role === "ADMIN" 
                            ? "bg-rose-500/10 text-rose-400 border-rose-500/20" 
                            : user.role === "MANAGER"
                            ? "bg-amber-500/10 text-amber-400 border-amber-500/20"
                            : "bg-cyan-500/10 text-cyan-400 border-cyan-500/20"
                        }`}>
                          {roleLabels[user.role]}
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
        
        <p className="mt-3 text-[10px] text-slate-500 font-mono text-right">
          {isAdmin 
            ? "// Режим адміністратора: зміна ролей записується безпосередньо в базу даних." 
            : "// Режим перегляду: редагування ролей доступне лише для авторизованих адміністраторів."
          }
        </p>
      </div>
    </div>
  );
}