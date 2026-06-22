"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { ui } from "@/components/ui/ui";
import MyBookingsTable from "@/components/profile/MyBookingsTable";

interface UserProfile {
  id: number;
  name: string;
  email: string;
  role: "USER" | "MANAGER" | "ADMIN";
  bookings: Array<{
    id: number;
    title: string;
    startTime: string;
    endTime: string;
    room: {
      name: string;
    };
  }>;
}

const roleLabels = {
  USER: "Співробітник",
  MANAGER: "Менеджер",
  ADMIN: "Адміністратор",
};

export default function ProfilePage() {
  const router = useRouter();
  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadProfile() {
      try {
        const token = localStorage.getItem("accessToken");
        
        const res = await fetch("http://localhost:5000/api/auth/me", {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
          cache: "no-store",
        });

        if (!res.ok) {
          throw new Error("Не вдалося верифікувати сесію доступу.");
        }

        const data = await res.json();
        setUser(data);
      } catch (err: any) {
        console.error(err);
        setError(err.message);
        // Якщо токен битий або застарів — чистимо сесію і викидаємо на логін
        handleLogout();
      } finally {
        setLoading(false);
      }
    }

    loadProfile();
  }, []);

  function handleLogout() {
    // 1. Очищуємо токен з локального сховища
    localStorage.removeItem("accessToken");
    
    // 2. Стираємо куку, щоб Middleware закрив доступ
    document.cookie = "accessToken=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";
    
    // 3. Скидаємо стан і редиректимо
    router.push("/login");
    router.refresh();
  }

  if (loading) {
    return (
      <div className="text-center py-20 text-xs font-mono text-cyan-500 animate-pulse">
        &gt; CONNECTING_TO_TERMINAL... ОЧІКУВАННЯ ДАНИХ СЕСІЇ_
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-4xl px-4 py-10">
      <div className={`${ui.card} ${ui.cardPad} border-t-2 border-t-cyan-500`}>
        
        {/* Заголовок + Кнопка логауту */}
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 border-b border-slate-900 pb-4">
          <div>
            <h1 className="text-xl font-bold tracking-tight text-slate-100 font-mono">
              <span className="text-cyan-500">&gt;</span> Особистий кабінет_
            </h1>
            <p className="mt-1 text-xs text-slate-400 font-mono">
              Поточний статус оператора та активні сесії резервування.
            </p>
          </div>
          <button 
            onClick={handleLogout}
            className="border border-red-500/40 text-red-400 hover:bg-red-500/10 px-3 py-1.5 rounded font-mono text-xs font-bold transition-colors whitespace-nowrap self-start sm:self-center"
          >
            [ DISCONNECT / ВИХІД ]
          </button>
        </div>
        
        {/* Картка користувача / Метадані профілю */}
        <div className="mt-6 grid gap-4 rounded-xl border border-slate-900 bg-slate-950/50 p-4 sm:grid-cols-2 font-mono text-xs">
          <div>
            <span className="font-bold text-slate-500 uppercase tracking-wider">Ім&apos;я користувача</span>
            <p className="text-slate-200 mt-1 font-semibold">{user?.name}</p>
          </div>
          <div>
            <span className="font-bold text-slate-500 uppercase tracking-wider">Email</span>
            <p className="text-slate-300 mt-1 break-all">{user?.email}</p>
          </div>
          <div>
            <span className="font-bold text-slate-500 uppercase tracking-wider">Роль у системі</span>
            <p className="text-cyan-400 mt-1 font-bold">[ {user ? roleLabels[user.role] : "Офлайн"} ]</p>
          </div>
          <div>
            <span className="font-bold text-slate-500 uppercase tracking-wider">Термінал доступу</span>
            <p className="text-emerald-400 mt-1 font-semibold">ONLINE_NODE_LOCAL</p>
          </div>
        </div>

        {/* Таблиця моїх бронювань */}
        <div className="mt-8">
          <h2 className="text-xs font-bold text-cyan-400 uppercase tracking-widest font-mono mb-4">
            // Ваші активні резервації кімнат (Завантажено з БД)
          </h2>
          
          <MyBookingsTable bookings={user?.bookings || []} />
        </div>

      </div>
    </div>
  );
}