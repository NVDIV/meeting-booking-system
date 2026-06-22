"use client";

import { useEffect, useState } from "react";
import { ui } from "@/components/ui/ui";
import StatusSelect from "./StatusSelect";

interface BookingCardProps {
  booking: {
    id: number;
    title: string;
    description?: string;
    startTime: string;
    endTime: string;
    status: string;
    createdAt?: string;
    room?: { name: string };
    user?: { name: string; email: string };
  };
}

const statusLabels: Record<string, string> = {
  CONFIRMED: "Підтверджено",
  PENDING: "Очікує",
  CANCELLED: "Скасовано"
};

export function BookingCard({ booking: initialBooking }: BookingCardProps) {
  const [booking, setBooking] = useState(initialBooking);
  const [userRole, setUserRole] = useState<string | null>(null);

  useEffect(() => {
    async function fetchUserRole() {
      try {
        const token = localStorage.getItem("accessToken");
        const res = await fetch("http://localhost:5000/api/auth/me", {
          headers: { Authorization: `Bearer ${token}` }
        });
        if (res.ok) {
          const data = await res.json();
          setUserRole(data.role);
        }
      } catch (err) {
        console.error("Не вдалося завантажити роль користувача", err);
      }
    }
    fetchUserRole();
  }, []);

  const isModerator = userRole === "ADMIN" || userRole === "MANAGER";

  const start = new Date(booking.startTime);
  const end = new Date(booking.endTime);
  const formattedDate = start.toLocaleDateString("uk-UA");
  const formattedStartTime = start.toLocaleTimeString("uk-UA", { hour: "2-digit", minute: "2-digit" });
  const formattedEndTime = end.toLocaleTimeString("uk-UA", { hour: "2-digit", minute: "2-digit" });

  return (
    <div className="mt-6 grid gap-6 md:grid-cols-[1.5fr_1fr]">
      <div className="space-y-4">
        <div className={`${ui.card} ${ui.cardPad}`}>
          <div className="text-xs font-bold text-cyan-400 font-mono uppercase tracking-wider">// Ціль зустрічі (опис)</div>
          <p className="mt-3 text-sm leading-relaxed text-slate-300">
            {booking.description || "Опис зустрічі не надано організатором."}
          </p>
        </div>
      </div>

      <div className={`${ui.card} ${ui.cardPad} h-fit border-l-2 border-l-cyan-500`}>
        <div className="text-xs font-bold text-slate-100 font-mono uppercase tracking-widest">[Деталі резервування]</div>
        <dl className="mt-4 grid grid-cols-2 gap-y-4 gap-x-2 text-xs font-mono">
          <dt className="text-slate-500 flex items-center">Статус сесії</dt>
          <dd className="flex items-center justify-end sm:justify-start">
            {isModerator ? (
              <StatusSelect
                bookingId={booking.id}
                currentStatus={booking.status}
                onStatusUpdated={(newStatus) => setBooking({ ...booking, status: newStatus })}
              />
            ) : (
              <span className={`inline-flex items-center gap-1.5 font-bold ${
                booking.status === "CONFIRMED" ? "text-emerald-400" : booking.status === "PENDING" ? "text-amber-400" : "text-rose-400"
              }`}>
                <span className={`h-1.5 w-1.5 rounded-full ${
                  booking.status === "CONFIRMED" ? "bg-emerald-400 animate-pulse" : booking.status === "PENDING" ? "bg-amber-400" : "bg-rose-400"
                }`} />
                {statusLabels[booking.status] || booking.status}
              </span>
            )}
          </dd>
          <dt className="text-slate-500">Локація</dt>
          <dd className="font-semibold text-cyan-400">{booking.room?.name || "Не вказано"}</dd>
          <dt className="text-slate-500">Дата</dt>
          <dd className="text-slate-300">{formattedDate}</dd>
          <dt className="text-slate-500">Час зустрічі</dt>
          <dd className="text-slate-200 font-bold">{formattedStartTime} - {formattedEndTime}</dd>
          <dt className="text-slate-500">Ініціатор</dt>
          <dd className="text-slate-300">{booking.user?.name || "Анонім"}</dd>
          <dt className="text-slate-500">Email</dt>
          <dd className="break-all text-slate-400 text-[11px]">{booking.user?.email || "-"}</dd>
          <dt className="text-slate-500">Запис створено</dt>
          <dd className="text-slate-500 text-[11px]">
            {booking.createdAt ? new Date(booking.createdAt).toLocaleString("uk-UA") : "-"}
          </dd>
        </dl>
      </div>
    </div>
  );
}