"use client";

import { useState } from "react";

interface StatusSelectProps {
  bookingId: number;
  currentStatus: string;
  onStatusUpdated: (newStatus: string) => void;
}

export default function StatusSelect({ bookingId, currentStatus, onStatusUpdated }: StatusSelectProps) {
  const [loading, setLoading] = useState(false);

  async function handleStatusChange(newStatus: string) {
    if (newStatus === currentStatus) return;

    setLoading(true);
    try {
      const token = localStorage.getItem("accessToken");
      const res = await fetch(`http://localhost:5000/api/bookings/${bookingId}/status`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ status: newStatus }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Помилка при зміні статусу");

      onStatusUpdated(newStatus);
      alert(data.message);
    } catch (err: any) {
      alert(`[ПОМИЛКА МОДЕРАЦІЇ]: ${err.message}`);
    } finally {
      setLoading(false);
    }
  }

  return (
    <select
      value={currentStatus}
      disabled={loading}
      onChange={(e) => handleStatusChange(e.target.value)}
      className={`bg-slate-950 border text-[11px] font-bold rounded px-2 py-0.5 font-mono uppercase tracking-wider cursor-pointer outline-none transition-colors ${
        currentStatus === "CONFIRMED"
          ? "text-emerald-400 border-emerald-500/30 bg-emerald-950/20"
          : currentStatus === "PENDING"
          ? "text-amber-400 border-amber-500/30 bg-amber-950/20"
          : "text-rose-400 border-rose-500/30 bg-rose-950/20"
      } disabled:opacity-50`}
    >
      <option value="PENDING" className="bg-slate-950 text-amber-400">Очікує</option>
      <option value="CONFIRMED" className="bg-slate-950 text-emerald-400">Підтверджено</option>
      <option value="CANCELLED" className="bg-slate-950 text-rose-400">Скасовано</option>
    </select>
  );
}