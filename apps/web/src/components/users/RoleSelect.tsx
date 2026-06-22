"use client";

import { useState } from "react";

interface RoleSelectProps {
  userId: number;
  currentRole: "USER" | "MANAGER" | "ADMIN";
  onRoleUpdated: (newRole: "USER" | "MANAGER" | "ADMIN") => void;
}

export default function RoleSelect({ userId, currentRole, onRoleUpdated }: RoleSelectProps) {
  const [loading, setLoading] = useState(false);

  async function handleRoleChange(newRole: "USER" | "MANAGER" | "ADMIN") {
    if (newRole === currentRole) return;
    
    setLoading(true);
    try {
      const token = localStorage.getItem("accessToken");
      const res = await fetch(`http://localhost:5000/api/users/${userId}/role`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ role: newRole }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error);

      onRoleUpdated(newRole);
      alert(data.message);
    } catch (err: any) {
      alert(`[ПОМИЛКА]: ${err.message}`);
    } finally {
      setLoading(false);
    }
  }

  return (
    <select
      value={currentRole}
      disabled={loading}
      onChange={(e) => handleRoleChange(e.target.value as any)}
      className={`bg-slate-950 border text-[11px] font-bold rounded px-2 py-1 font-mono uppercase tracking-wider cursor-pointer outline-none transition-colors ${
        currentRole === "ADMIN"
          ? "text-rose-400 border-rose-500/30 bg-rose-950/20"
          : currentRole === "MANAGER"
          ? "text-amber-400 border-amber-500/30 bg-amber-950/20"
          : "text-cyan-400 border-cyan-500/30 bg-cyan-950/20"
      } disabled:opacity-50`}
    >
      <option value="USER" className="bg-slate-950 text-cyan-400">Співробітник</option>
      <option value="MANAGER" className="bg-slate-950 text-amber-400">Менеджер</option>
      <option value="ADMIN" className="bg-slate-950 text-rose-400">Адміністратор</option>
    </select>
  );
}