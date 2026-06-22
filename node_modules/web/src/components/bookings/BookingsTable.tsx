"use client";

import { useState } from "react";
import Link from "next/link";
import { ui } from "@/components/ui/ui";

interface Booking {
  id: number;
  title: string;
  startTime: string;
  endTime: string;
  status: "CONFIRMED" | "PENDING" | "CANCELLED";
  room?: { name: string };
  user?: { name: string };
}

export function BookingsTable({ initialBookings }: { initialBookings: Booking[] }) {
  const [searchTerm, setSearchTerm] = useState("");

  const filteredBookings = initialBookings.filter((item) =>
    item.title?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="mt-6 space-y-4">
      {/* Поле пошуку */}
      <div className="max-w-xs">
        <input
          type="text"
          placeholder="Пошук події..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full px-3 py-1.5 bg-slate-900 border border-slate-800 rounded text-xs font-mono text-slate-300 focus:outline-none focus:border-cyan-500 transition-colors"
        />
      </div>

      {/* Таблиця */}
      <div className={`${ui.card} overflow-hidden h-fit`}>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-slate-800 text-left text-xs font-mono text-slate-300">
            <thead className="bg-slate-900/50 text-[11px] font-bold text-cyan-400 uppercase tracking-wider">
              <tr>
                <th className="px-6 py-4 border-b border-slate-800">Подія</th>
                <th className="px-6 py-4 border-b border-slate-800">Кімната</th>
                <th className="px-6 py-4 border-b border-slate-800">Дата / Час</th>
                <th className="px-6 py-4 border-b border-slate-800">Організатор</th>
                <th className="px-6 py-4 border-b border-slate-800 text-right">Управління</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 bg-transparent">
              {filteredBookings.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-8 text-center text-slate-500">
                    Нічого не знайдено за вашим запитом.
                  </td>
                </tr>
              ) : (
                filteredBookings.map((item) => {
                  const start = new Date(item.startTime);
                  const end = new Date(item.endTime);
                  const formattedDate = start.toLocaleDateString("uk-UA");
                  const formattedTime = `${start.toLocaleTimeString("uk-UA", { hour: '2-digit', minute: '2-digit' })} - ${end.toLocaleTimeString("uk-UA", { hour: '2-digit', minute: '2-digit' })}`;

                  return (
                    <tr key={item.id} className="hover:bg-cyan-500/5 transition-colors">
                      <td className="px-6 py-4 font-semibold text-slate-100">
                        <Link href={`/bookings/${item.id}`} className="hover:text-cyan-400 transition-colors">
                          {item.title}
                        </Link>
                      </td>
                      <td className="px-6 py-4 text-slate-300 whitespace-nowrap">
                        {item.room?.name || "Без кімнати"}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="text-slate-500 mr-2">{formattedDate}</span>
                        <span className="font-bold text-cyan-400">{formattedTime}</span>
                      </td>
                      <td className="px-6 py-4 text-slate-400 whitespace-nowrap">
                        {item.user?.name || "Невідомо"}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-xs font-bold">
                        <Link href={`/bookings/${item.id}`} className="text-cyan-500 hover:text-cyan-400 transition-colors">
                          [Деталі] &rarr;
                        </Link>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}