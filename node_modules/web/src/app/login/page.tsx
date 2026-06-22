"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link"; // Імпортуємо Link
import { ui } from "@/components/ui/ui";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const res = await fetch("http://localhost:5000/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error);

      localStorage.setItem("accessToken", data.accessToken);
      document.cookie = `accessToken=${data.accessToken}; path=/; max-age=900; SameSite=Lax`;

      router.push("/profile");
      router.refresh();
    } catch (err: any) {
      setError(err.message || "Помилка авторизації.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="mx-auto max-w-md px-4 py-16">
      <div className={`${ui.card} ${ui.cardPad} border-t-2 border-t-cyan-500`}>
        <h1 className="text-xl font-bold text-slate-100 text-center font-mono tracking-tight">
          &lt; Вхід у RoomBooking &gt;
        </h1>
        <p className="mt-1 text-xs text-slate-400 text-center font-mono">
          Авторизація через корпоративний термінал
        </p>
        
        {error && (
          <div className="mt-4 p-2 bg-red-500/10 border border-red-500/20 text-red-400 font-mono text-xs rounded">
            [ПОМИЛКА]: {error}
          </div>
        )}

        <form className="mt-6 space-y-4 font-mono text-xs" onSubmit={handleLogin}>
          <div>
            <label className="block font-bold text-slate-400 uppercase tracking-wider">
              Електронна пошта
            </label>
            <input 
              type="email" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="user@company.com" 
              className={`${ui.input} mt-1.5 block w-full`} 
              required
              disabled={loading}
            />
          </div>
          
          <div>
            <label className="block font-bold text-slate-400 uppercase tracking-wider">
              Пароль
            </label>
            <input 
              type="password" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••" 
              className={`${ui.input} mt-1.5 block w-full`} 
              required
              disabled={loading}
            />
          </div>
          
          <div className="pt-2">
            <button type="submit" disabled={loading} className={`${ui.btnPrimary} w-full py-2.5 text-center`}>
              {loading ? "AUTHENTICATING..." : "AUTH_INITIALIZE _"}
            </button>
          </div>
        </form>

        {/* НАВІГАЦІЙНИЙ ПЕРЕХІД */}
        <div className="mt-5 pt-4 border-t border-slate-900 text-center font-mono text-[11px] text-slate-500">
          Вперше у системі?{" "}
          <Link href="/register" className="text-cyan-400 hover:text-cyan-300 underline underline-offset-4 transition-colors">
            CREATE_NEW_ACCOUNT &gt;&gt;
          </Link>
        </div>

      </div>
    </div>
  );
}