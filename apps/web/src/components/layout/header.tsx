"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useMemo, useState } from "react";

type NavItem = { href: string; label: string };

const NAV: NavItem[] = [
  { href: "/", label: "Головна" },
  { href: "/bookings", label: "Розклад" },
  { href: "/rooms", label: "Переговорні" },
  { href: "/users", label: "Користувачі" },
  { href: "/profile", label: "Профіль" }
];

// Мапінг ролей для відображення
const roleLabels: Record<string, string> = {
  USER: "Співробітник",
  MANAGER: "Менеджер офісу",
  ADMIN: "Адміністратор",
};

function cx(...v: Array<string | false | null | undefined>) {
  return v.filter(Boolean).join(" ");
}

export function Header() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  
  // Динамічний стейт для користувача
  const [user, setUser] = useState<{ name: string; role: string } | null>(null);

  const activeHref = useMemo(() => pathname ?? "/", [pathname]);

  // Завантаження актуальної сесії користувача
  useEffect(() => {
    async function fetchSession() {
      try {
        const token = localStorage.getItem("accessToken");
        if (!token) {
          setUser(null);
          return;
        }

        const res = await fetch("http://localhost:5000/api/auth/me", {
          headers: { Authorization: `Bearer ${token}` },
          cache: "no-store"
        });

        if (res.ok) {
          const data = await res.json();
          setUser({
            name: data.name,
            role: roleLabels[data.role] || data.role
          });
        } else {
          // Якщо токен невалідний — скидаємо юзера
          setUser(null);
        }
      } catch (err) {
        console.error("Помилка синхронізації сесії в Header:", err);
        setUser(null);
      }
    }

    fetchSession();
    
    // Вішаємо слухач подій для оновлення заголовка, якщо користувач увійшов/вийшов
    window.addEventListener("storage", fetchSession);
    return () => window.removeEventListener("storage", fetchSession);
  }, [pathname]); // Перезапускаємо при зміні сторінок, щоб оперативно оновлювати стан

  // Обробка клавіші Escape для закриття мобільного меню
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const onNavClick = () => setOpen(false);

  return (
    <header className="sticky top-0 z-50 border-b border-slate-800 bg-slate-950/90 backdrop-blur-md pointer-events-auto">
      <div className="mx-auto max-w-6xl px-4">
        <div className="flex h-14 items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <Link href="/" className="flex items-center gap-2" onClick={onNavClick}>
              <div className="h-6 w-6 rounded bg-cyan-500 shadow-md shadow-cyan-500/50" />
              <div className="leading-tight font-mono">
                <div className="text-sm font-bold text-slate-100 tracking-wide">RoomBooking</div>
                <div className="hidden text-[10px] text-slate-500 sm:block">SYS_INTERFACE_v1.0</div>
              </div>
            </Link>

            <nav className="hidden items-center gap-1 md:flex font-mono text-xs">
              {NAV.map((it) => {
                const isActive = activeHref === it.href || (it.href !== "/" && activeHref.startsWith(it.href));
                return (
                  <Link
                    key={it.href}
                    href={it.href}
                    onClick={onNavClick}
                    className={cx(
                      "rounded px-3 py-1.5 transition-colors border",
                      isActive
                        ? "bg-cyan-500/10 text-cyan-400 border-cyan-500/20 font-bold"
                        : "text-slate-400 border-transparent hover:bg-slate-900 hover:text-slate-100"
                    )}
                  >
                    {it.label}
                  </Link>
                );
              })}
            </nav>
          </div>

          <div className="flex items-center gap-2 font-mono">
            {/* Динамічний блок користувача */}
            <div className="hidden text-right sm:block mr-2 text-xs">
              <div className="font-semibold text-slate-200">
                {user ? user.name : "Гість системи"}
              </div>
              <div className={cx(
                "text-[10px]",
                user?.role === "Адміністратор" ? "text-rose-400" : user?.role === "Менеджер офісу" ? "text-amber-400" : "text-slate-500"
              )}>
                {user ? `// ${user.role}` : "AUTH_REQUIRED"}
              </div>
            </div>
            
            <Link
              href="/bookings/new"
              onClick={onNavClick}
              className="hidden items-center justify-center rounded bg-cyan-500 px-3 py-1.5 text-xs font-bold text-slate-950 shadow-md shadow-cyan-500/20 hover:bg-cyan-400 sm:inline-flex"
            >
              + Нова бронь
            </Link>

            {/* Мобільна кнопка бургер-меню */}
            <button
              type="button"
              onClick={() => setOpen((prev) => !prev)}
              className="relative z-50 inline-flex h-10 w-10 cursor-pointer items-center justify-center rounded border border-slate-700 bg-slate-900 text-slate-100 md:hidden pointer-events-auto select-none touch-manipulation active:bg-slate-800"
            >
              <div className="flex flex-col gap-1.5 pointer-events-none">
                <span className={cx("block h-0.5 w-4 bg-slate-100 transition-all duration-200", open && "translate-y-2 rotate-45")} />
                <span className={cx("block h-0.5 w-4 bg-slate-100 transition-all duration-200", open && "opacity-0")} />
                <span className={cx("block h-0.5 w-4 bg-slate-100 transition-all duration-200", open && "-translate-y-2 -rotate-45")} />
              </div>
            </button>
          </div>
        </div>

        {/* Мобільне розсувне меню */}
        {open && (
          <div className="block pb-4 pt-2 font-mono text-xs md:hidden border-t border-slate-900 mt-2 relative z-50 pointer-events-auto">
            {/* Мобільний блок профілю користувача */}
            <div className="px-3 py-2 border border-slate-800 bg-slate-900/50 rounded mb-2">
              <div className="font-semibold text-slate-200">{user ? user.name : "Гість системи"}</div>
              <div className="text-[10px] text-slate-500">{user ? user.role : "Авторизуйтесь в системі"}</div>
            </div>

            <div className="grid gap-1">
              {NAV.map((it) => {
                const isActive = activeHref === it.href || (it.href !== "/" && activeHref.startsWith(it.href));
                return (
                  <Link
                    key={it.href}
                    href={it.href}
                    onClick={onNavClick}
                    className={cx(
                      "rounded px-3 py-2 block transition-all pointer-events-auto", 
                      isActive 
                        ? "bg-cyan-500/10 text-cyan-400 border border-cyan-500/20" 
                        : "text-slate-400 hover:bg-slate-900"
                    )}
                  >
                    {it.label}
                  </Link>
                );
              })}
            </div>

            <div className="mt-3 pt-3 border-t border-slate-800">
              <Link
                href="/bookings/new"
                onClick={onNavClick}
                className="flex items-center justify-center rounded bg-cyan-500 py-2 font-bold text-slate-950 text-center pointer-events-auto"
              >
                + Нова бронь
              </Link>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}